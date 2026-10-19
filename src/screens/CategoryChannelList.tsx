/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NMCategoryChannel} from 'react-native-netmera';
import AppColors from '../ui/AppColors';
import {ALL_CATEGORY_CHANNELS} from '../helpers/CategoryChannelUtils';

const CategoryChannelList = () => {
  const navigation = useNavigation<any>();

  return (
    <FlatList
      style={styles.container}
      data={ALL_CATEGORY_CHANNELS}
      keyExtractor={item => item}
      ListHeaderComponent={
        <Text style={styles.headerText}>
          {ALL_CATEGORY_CHANNELS.length} channels supported by this app
        </Text>
      }
      ListFooterComponent={
        <Text style={styles.footerText}>
          Pick a channel to see the user's categories on it and switch them on or off. The server
          can also have channels this app does not support yet; those show up on a category's own
          channel list and cannot be changed from the app.
        </Text>
      }
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ChannelCategories', {channel: item as NMCategoryChannel})}>
          <Text style={styles.title}>{item}</Text>
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
  row: {
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    color: AppColors.label,
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

export default CategoryChannelList;
