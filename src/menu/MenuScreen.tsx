/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import MenuRow from '../ui/MenuRow';
import AppColors from '../ui/AppColors';
import {Menu, MenuRoute, menus} from './menus';

const MenuScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const menu: Menu = menus[route.name as MenuRoute];

  return (
    <ScrollView
      testID={`${menu.id}.menu`}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      {menu.entries.map((entry, index) => (
        <MenuRow
          key={entry.id}
          testID={`${menu.id}.menu.${entry.id}`}
          title={entry.title}
          subtitle={entry.subtitle}
          showDivider={index < menu.entries.length - 1}
          onPress={() => navigation.navigate(entry.screen)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface,
  },
  content: {
    paddingVertical: 8,
  },
});

export default MenuScreen;
