/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AppColors from './AppColors';
import {isIos} from '../helpers/DeviceUtils';

interface Props {
  title: string;
  subtitle?: string;
  showDivider?: boolean;
  testID?: string;
  onPress: () => void;
}

const MenuRow = ({title, subtitle, showDivider = true, testID, onPress}: Props) => (
  <Pressable
    testID={testID}
    accessibilityRole="button"
    onPress={onPress}
    android_ripple={{color: AppColors.divider}}
    style={({pressed}) => [styles.row, pressed && isIos() && styles.pressed]}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {showDivider ? <View style={styles.divider} /> : null}
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: AppColors.surface,
  },
  pressed: {
    backgroundColor: AppColors.divider,
  },
  title: {
    fontSize: 17,
    color: AppColors.label,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 18,
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

export default MenuRow;
