/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import AppColors from './AppColors';

interface Props {
  title: string;
  destructive?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  onPress: () => void;
}

const TextButton = ({title, destructive, disabled, accessibilityLabel, testID, onPress}: Props) => (
  <Pressable
    testID={testID}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{disabled}}
    disabled={disabled}
    onPress={onPress}
    style={({pressed}) => [styles.button, pressed && styles.pressed]}>
    <Text style={[styles.title, destructive && styles.destructive, disabled && styles.disabled]}>
      {title}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: 17,
    color: AppColors.primary,
  },
  destructive: {
    color: AppColors.destructive,
  },
  disabled: {
    color: AppColors.mutedText,
  },
});

export default TextButton;
