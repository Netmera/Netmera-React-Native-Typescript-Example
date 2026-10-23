/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Netmera, NMCategoryPreferenceFilter} from 'react-native-netmera';
import AppColors from '../ui/AppColors';
import {
  ChannelPreferenceEntry,
  dedupeChannelPreferences,
  errorMessage,
} from '../helpers/CategoryChannelUtils';

interface UserCategoryRow {
  id: number;
  name: string;
  enabled?: boolean;
  channelPreferences: ChannelPreferenceEntry[];
}

const channelSummary = (row: UserCategoryRow): string =>
  row.channelPreferences.length === 0
    ? 'no channels returned'
    : `${row.channelPreferences.filter(p => p.optInStatus).length} of ${
        row.channelPreferences.length
      } channels on`;

const UserCategoryPreferences = () => {
  const navigation = useNavigation<any>();
  const [rows, setRows] = useState<UserCategoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const list = await Netmera.getUserCategoryPreferenceList();
      const seenIds = new Set<number>();
      const nextRows: UserCategoryRow[] = [];
      list.forEach(preference => {
        if (preference.categoryId === undefined || seenIds.has(preference.categoryId)) {
          return;
        }
        seenIds.add(preference.categoryId);
        nextRows.push({
          id: preference.categoryId,
          name: preference.categoryName?.trim() ? preference.categoryName : '(no name)',
          enabled: preference.optInStatus,
          channelPreferences: dedupeChannelPreferences(preference.channelPreferences),
        });
      });
      setRows(nextRows);
    } catch (error) {
      setRows([]);
      Toast.show({
        type: 'error',
        text1: 'Could not load preferences',
        text2: errorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories]),
  );

  // Re-fetches with a categoryIds filter for just the tapped row, so the console/toast
  // shows the filter actually narrowing the result down instead of returning everything.
  const verifyCategoryFilter = async (row: UserCategoryRow) => {
    try {
      const filter = new NMCategoryPreferenceFilter();
      filter.categoryIds = [row.id];
      const filtered = await Netmera.getUserCategoryPreferenceList(filter);
      console.log(`Filtered fetch (categoryIds: [${row.id}]) returned:`, filtered);
      Toast.show({
        type: 'success',
        text1: 'Filter check',
        text2: `categoryIds:[${row.id}] → ${filtered.length} result(s)`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Filter check failed',
        text2: errorMessage(error),
      });
    }
  };

  const openCategory = (row: UserCategoryRow) => {
    verifyCategoryFilter(row);
    navigation.navigate('CategoryChannelPreferences', {
      categoryId: row.id,
      categoryName: row.name,
      categoryEnabled: row.enabled,
      channelPreferences: row.channelPreferences,
    });
  };

  return (
    <FlatList
      style={styles.container}
      data={rows}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchCategories} />
      }
      ListHeaderComponent={
        <Text style={styles.headerText}>{rows.length} categories of this user</Text>
      }
      ListFooterComponent={
        <Text style={styles.footerText}>
          Tap a category to see which channels it is on and switch them on or off.
        </Text>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator style={styles.loading} size="large" color={AppColors.primary} />
        ) : (
          <Text style={styles.emptyText}>No categories returned. Pull to refresh to try again.</Text>
        )
      }
      renderItem={({item}) => (
        <TouchableOpacity style={styles.row} onPress={() => openCategory(item)}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {item.name}  ·  id {item.id}
            </Text>
            <Text style={styles.subtitle}>{channelSummary(item)}</Text>
          </View>
          <Text style={styles.chevron}>{'›'}</Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  loading: {
    paddingVertical: 24,
  },
  row: {
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    color: AppColors.label,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: AppColors.mutedText,
  },
  chevron: {
    fontSize: 20,
    color: AppColors.mutedText,
  },
  // The left border keeps the 16pt inset white on the grouped background.
  separator: {
    height: 1,
    borderLeftWidth: 16,
    borderLeftColor: AppColors.surface,
    backgroundColor: AppColors.divider,
  },
});

export default UserCategoryPreferences;
