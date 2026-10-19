/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Netmera, NMCategoryChannel, NMCategoryPreferenceFilter, NMCategoryPreferenceUpdate} from 'react-native-netmera';
import AppColors from '../ui/AppColors';
import SwitchRow from '../ui/SwitchRow';
import {errorMessage, IDLE_STATUS, RowSaveStatus} from '../helpers/CategoryChannelUtils';

interface ChannelCategoryRow {
  categoryId: number;
  name: string;
  isEnabled?: boolean;
  status: RowSaveStatus;
}

interface RouteParams {
  channel: NMCategoryChannel;
}

const rowSwitchValue = (row: ChannelCategoryRow): boolean =>
  row.status.kind === 'saving' ? row.status.enabled : row.isEnabled ?? false;

const ChannelCategories = () => {
  const route = useRoute<any>();
  const {channel} = route.params as RouteParams;

  const [rows, setRows] = useState<ChannelCategoryRow[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const isFetchingRef = useRef(false);
  const pendingWrites = useRef<Set<number>>(new Set());
  const writeGeneration = useRef<Map<number, number>>(new Map());

  const fetchCategories = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setIsFetching(true);

    const generationAtIssue = new Map(writeGeneration.current);

    try {
      const filter = new NMCategoryPreferenceFilter();
      filter.channels = [channel];
      const list = await Netmera.getUserCategoryPreferenceList(filter);

      const seenIds = new Set<number>();
      const fresh: ChannelCategoryRow[] = [];
      list.forEach(preference => {
        if (preference.categoryId === undefined || seenIds.has(preference.categoryId)) {
          return;
        }
        seenIds.add(preference.categoryId);
        const entry = preference.channelPreferences?.find(p => p.channel === channel);
        fresh.push({
          categoryId: preference.categoryId,
          name: preference.categoryName?.trim() ? preference.categoryName : `id ${preference.categoryId}`,
          isEnabled: entry?.optInStatus,
          status: IDLE_STATUS,
        });
      });

      setRows(currentRows =>
        fresh.map(row => {
          const isStale =
            pendingWrites.current.has(row.categoryId) ||
            writeGeneration.current.get(row.categoryId) !== generationAtIssue.get(row.categoryId);
          if (isStale) {
            return currentRows.find(current => current.categoryId === row.categoryId) ?? row;
          }
          return row;
        }),
      );
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
  }, [channel]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setPreference = async (categoryId: number, enabled: boolean) => {
    const previousValue = rows.find(row => row.categoryId === categoryId)?.isEnabled;

    pendingWrites.current.add(categoryId);
    writeGeneration.current.set(categoryId, (writeGeneration.current.get(categoryId) ?? 0) + 1);
    setRows(current =>
      current.map(row =>
        row.categoryId === categoryId ? {...row, status: {kind: 'saving', enabled}} : row,
      ),
    );

    try {
      await Netmera.setUserCategoryPreference(new NMCategoryPreferenceUpdate(categoryId, enabled, channel));
      pendingWrites.current.delete(categoryId);
      setRows(current =>
        current.map(row =>
          row.categoryId === categoryId ? {...row, isEnabled: enabled, status: IDLE_STATUS} : row,
        ),
      );
      Toast.show({type: 'success', text1: 'Preference updated.'});
    } catch (error) {
      pendingWrites.current.delete(categoryId);
      setRows(current =>
        current.map(row =>
          row.categoryId === categoryId
            ? {...row, isEnabled: previousValue, status: {kind: 'failed', reason: errorMessage(error)}}
            : row,
        ),
      );
      Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(error)});
    }
  };

  const rowSubtitle = (row: ChannelCategoryRow): {text: string; color?: string} => {
    if (row.status.kind === 'saving') {
      return {text: 'Saving…'};
    }
    if (row.status.kind === 'failed') {
      return {text: `⚠ Could not save — ${row.status.reason}`, color: AppColors.destructive};
    }
    if (row.isEnabled === undefined) {
      return {text: `id ${row.categoryId} · the server returned no value for this channel yet`, color: AppColors.warning};
    }
    return {text: `id ${row.categoryId}`};
  };

  return (
    <FlatList
      style={styles.container}
      data={rows}
      keyExtractor={item => item.categoryId.toString()}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={fetchCategories} />}
      ListHeaderComponent={
        <Text style={styles.headerText}>
          {rows.length} categories on {channel}
        </Text>
      }
      ListFooterComponent={
        <Text style={styles.footerText}>
          Each switch changes the category on {channel} only — its other channels stay as they are.
        </Text>
      }
      ListEmptyComponent={
        !isFetching ? (
          <Text style={styles.emptyText}>
            No categories returned for {channel}. Pull to refresh to try again.
          </Text>
        ) : undefined
      }
      renderItem={({item, index}) => {
        const subtitle = rowSubtitle(item);
        return (
          <SwitchRow
            title={item.name}
            subtitle={subtitle.text}
            subtitleColor={subtitle.color}
            value={rowSwitchValue(item)}
            disabled={item.status.kind === 'saving'}
            onValueChange={value => setPreference(item.categoryId, value)}
            showDivider={index < rows.length - 1}
          />
        );
      }}
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
  footerText: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    fontSize: 12,
    color: AppColors.mutedText,
    backgroundColor: AppColors.groupedBackground,
  },
  emptyText: {
    backgroundColor: AppColors.surface,
    padding: 16,
    fontSize: 13,
    color: AppColors.mutedText,
    textAlign: 'center',
  },
});

export default ChannelCategories;
