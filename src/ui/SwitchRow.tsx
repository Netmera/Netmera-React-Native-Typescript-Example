/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import AppColors from './AppColors';

interface Props {
  title: string;
  value: boolean;
  showDivider?: boolean;
  testID?: string;
  onValueChange: (value: boolean) => void;
}

const SwitchRow = ({title, value, showDivider = true, testID, onValueChange}: Props) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    <Switch
      testID={testID}
      accessibilityLabel={title}
      value={value}
      onValueChange={onValueChange}
    />
    {showDivider ? <View style={styles.divider} /> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: AppColors.surface,
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    color: AppColors.label,
  },
  divider: {
    position: 'absolute',
    left: 16,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: AppColors.divider,
  },
});

export default SwitchRow;
