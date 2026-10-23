/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import AppColors from './AppColors';

interface Props {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  value: boolean;
  disabled?: boolean;
  showDivider?: boolean;
  testID?: string;
  onValueChange: (value: boolean) => void;
}

const SwitchRow = ({
  title,
  subtitle,
  subtitleColor,
  value,
  disabled,
  showDivider = true,
  testID,
  onValueChange,
}: Props) => (
  <View style={styles.row}>
    <View style={styles.text}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleColor ? {color: subtitleColor} : null]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    <Switch
      testID={testID}
      accessibilityLabel={title}
      value={value}
      disabled={disabled}
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
  text: {
    flex: 1,
    marginRight: 12,
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
