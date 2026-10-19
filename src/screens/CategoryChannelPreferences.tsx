/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useCallback, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  Netmera,
  NMCategoryChannel,
  NMCategoryPreferenceFilter,
  NMCategoryPreferenceUpdate,
} from 'react-native-netmera';
import AppColors from '../ui/AppColors';
import SwitchRow from '../ui/SwitchRow';
import {
  ALL_CATEGORY_CHANNELS,
  ChannelPreferenceEntry,
  dedupeChannelPreferences,
  errorMessage,
  IDLE_STATUS,
  isKnownCategoryChannel,
  RowSaveStatus,
} from '../helpers/CategoryChannelUtils';

interface ChannelRowState {
  channel?: string;
  isEnabled?: boolean;
  status: RowSaveStatus;
}

interface RouteParams {
  categoryId: number;
  categoryName: string;
  categoryEnabled?: boolean;
  channelPreferences?: ChannelPreferenceEntry[];
}

const rowSwitchValue = (row: ChannelRowState): boolean =>
  row.status.kind === 'saving' ? row.status.enabled : row.isEnabled ?? false;

const rowIsInteractive = (row: ChannelRowState): boolean =>
  isKnownCategoryChannel(row.channel) && row.status.kind !== 'saving';

const CategoryChannelPreferences = () => {
  const route = useRoute<any>();
  const params = route.params as RouteParams;
  const {categoryId, categoryName} = params;

  const [categoryEnabled, setCategoryEnabled] = useState(params.categoryEnabled);
  const [allChannelsStatus, setAllChannelsStatus] = useState<RowSaveStatus>(IDLE_STATUS);
  const [channelRows, setChannelRows] = useState<ChannelRowState[]>(
    (params.channelPreferences ?? []).map(entry => ({
      channel: entry.channel,
      isEnabled: entry.optInStatus,
      status: IDLE_STATUS,
    })),
  );
  const [isFetching, setIsFetching] = useState(false);

  const isFetchingRef = useRef(false);
  const isWritingAllChannelsRef = useRef(false);
  const pendingWrites = useRef<Set<string>>(new Set());
  const writeGeneration = useRef<Map<string, number>>(new Map());
  const allChannelsGeneration = useRef(0);

  const reloadCategory = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setIsFetching(true);

    const generationAtIssue = new Map(writeGeneration.current);
    const allChannelsGenerationAtIssue = allChannelsGeneration.current;

    try {
      const filter = new NMCategoryPreferenceFilter();
      filter.categoryIds = [categoryId];
      const list = await Netmera.getUserCategoryPreferenceList(filter);
      const match = list.find(preference => preference.categoryId === categoryId);
      if (!match) {
        Toast.show({type: 'error', text1: `Category ${categoryId} was not in the response`});
        return;
      }

      const fresh: ChannelRowState[] = dedupeChannelPreferences(match.channelPreferences).map(
        entry => ({channel: entry.channel, isEnabled: entry.optInStatus, status: IDLE_STATUS}),
      );

      setChannelRows(currentRows =>
        fresh.map(row => {
          const channel = row.channel;
          const isStale =
            channel !== undefined &&
            (pendingWrites.current.has(channel) ||
              writeGeneration.current.get(channel) !== generationAtIssue.get(channel));
          if (isStale) {
            return currentRows.find(current => current.channel === channel) ?? row;
          }
          return row;
        }),
      );

      if (!isWritingAllChannelsRef.current && allChannelsGeneration.current === allChannelsGenerationAtIssue) {
        setCategoryEnabled(match.optInStatus);
        setAllChannelsStatus(IDLE_STATUS);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not load preferences',
        text2: errorMessage(error),
      });
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, [categoryId]);

  const setAllChannels = async (enabled: boolean) => {
    if (isWritingAllChannelsRef.current) {
      return;
    }
    const previousValue = categoryEnabled;

    isWritingAllChannelsRef.current = true;
    allChannelsGeneration.current += 1;
    ALL_CATEGORY_CHANNELS.forEach(channel => {
      writeGeneration.current.set(channel, (writeGeneration.current.get(channel) ?? 0) + 1);
    });
    setAllChannelsStatus({kind: 'saving', enabled});

    try {
      await Netmera.setUserCategoryPreference(new NMCategoryPreferenceUpdate(categoryId, enabled));
      isWritingAllChannelsRef.current = false;
      setCategoryEnabled(enabled);
      setAllChannelsStatus(IDLE_STATUS);
      setChannelRows(current =>
        current.map(row =>
          row.channel !== undefined && pendingWrites.current.has(row.channel)
            ? row
            : {...row, isEnabled: enabled, status: IDLE_STATUS},
        ),
      );
      // No reload here: right after the write the server can still return the old values,
      // which would flip the rows (and the switch) back.
      Toast.show({type: 'success', text1: 'Preference updated.'});
    } catch (error) {
      isWritingAllChannelsRef.current = false;
      setCategoryEnabled(previousValue);
      setAllChannelsStatus({kind: 'failed', reason: errorMessage(error)});
      Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(error)});
    }
  };

  const setChannelPreference = async (channel: string, enabled: boolean) => {
    const previousValue = channelRows.find(row => row.channel === channel)?.isEnabled;

    pendingWrites.current.add(channel);
    writeGeneration.current.set(channel, (writeGeneration.current.get(channel) ?? 0) + 1);
    setChannelRows(current =>
      current.map(row => (row.channel === channel ? {...row, status: {kind: 'saving', enabled}} : row)),
    );

    try {
      await Netmera.setUserCategoryPreference(
        new NMCategoryPreferenceUpdate(categoryId, enabled, channel as NMCategoryChannel),
      );
      pendingWrites.current.delete(channel);
      setChannelRows(current =>
        current.map(row =>
          row.channel === channel ? {...row, isEnabled: enabled, status: IDLE_STATUS} : row,
        ),
      );
      Toast.show({type: 'success', text1: 'Preference updated.'});
    } catch (error) {
      pendingWrites.current.delete(channel);
      setChannelRows(current =>
        current.map(row =>
          row.channel === channel
            ? {...row, isEnabled: previousValue, status: {kind: 'failed', reason: errorMessage(error)}}
            : row,
        ),
      );
      Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(error)});
    }
  };

  const allChannelsSwitchValue =
    channelRows.length === 0 ? categoryEnabled ?? false : channelRows.some(rowSwitchValue);

  const allChannelsSubtitle = (): {text: string; color?: string} => {
    if (allChannelsStatus.kind === 'saving') {
      return {text: 'Saving…'};
    }
    if (allChannelsStatus.kind === 'failed') {
      return {text: `⚠ Could not save — ${allChannelsStatus.reason}`, color: AppColors.destructive};
    }
    return {
      text:
        channelRows.length === 0
          ? 'No channels returned for this category'
          : `${channelRows.filter(rowSwitchValue).length} of ${channelRows.length} channels on`,
    };
  };

  const channelSubtitle = (row: ChannelRowState): {text?: string; color?: string} => {
    if (row.status.kind === 'saving') {
      return {text: 'Saving…'};
    }
    if (row.status.kind === 'failed') {
      return {text: `⚠ Could not save — ${row.status.reason}`, color: AppColors.destructive};
    }
    if (!isKnownCategoryChannel(row.channel)) {
      return {text: 'This app version does not support this channel, so it cannot be changed here.'};
    }
    if (row.isEnabled === undefined) {
      return {text: 'The server returned no value for this channel yet.', color: AppColors.warning};
    }
    return {};
  };

  const allChannelsSubtitleInfo = allChannelsSubtitle();

  return (
    <FlatList
      style={styles.container}
      data={channelRows}
      keyExtractor={(item, index) => item.channel ?? `unknown-${index}`}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={reloadCategory} />}
      ListHeaderComponent={
        <View>
          <Text style={styles.headerText}>
            “{categoryName}” · category id {categoryId}
          </Text>
          <SwitchRow
            title="All channels"
            subtitle={allChannelsSubtitleInfo.text}
            subtitleColor={allChannelsSubtitleInfo.color}
            value={
              allChannelsStatus.kind === 'saving' ? allChannelsStatus.enabled : allChannelsSwitchValue
            }
            disabled={allChannelsStatus.kind === 'saving'}
            onValueChange={setAllChannels}
            showDivider={false}
          />
          <Text style={styles.footerText}>
            Switching this off turns every channel of this category off in one go, and switching it
            on turns them all on. It follows the rows below, so it goes off by itself once the last
            channel is off.
          </Text>
          {channelRows.length > 0 && (
            <Text style={styles.sectionHeaderText}>Channels of this category</Text>
          )}
        </View>
      }
      renderItem={({item, index}) => {
        const subtitle = channelSubtitle(item);
        return (
          <SwitchRow
            title={isKnownCategoryChannel(item.channel) ? item.channel : 'UNKNOWN CHANNEL'}
            subtitle={subtitle.text}
            subtitleColor={subtitle.color}
            value={rowSwitchValue(item)}
            disabled={!rowIsInteractive(item)}
            onValueChange={value => item.channel && setChannelPreference(item.channel, value)}
            showDivider={index < channelRows.length - 1}
          />
        );
      }}
      ListFooterComponent={
        <Text style={styles.footerText}>
          {channelRows.length === 0
            ? 'The server returned no channels for this category, so there is nothing to change one by one. The switch above still applies to all channels.'
            : 'Only the channels the server returned for this category are listed. Each switch changes that one channel and leaves the others as they are.'}
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.groupedBackground,
  },
  headerText: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    fontSize: 13,
    color: AppColors.mutedText,
    backgroundColor: AppColors.groupedBackground,
  },
  sectionHeaderText: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    fontSize: 13,
    color: AppColors.mutedText,
    backgroundColor: AppColors.groupedBackground,
  },
  footerText: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    fontSize: 12,
    color: AppColors.mutedText,
    backgroundColor: AppColors.groupedBackground,
  },
});

export default CategoryChannelPreferences;
