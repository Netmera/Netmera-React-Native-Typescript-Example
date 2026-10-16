/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import AppColors from './AppColors';

interface Props {
  title: string;
  variant?: 'primary' | 'callback';
  disabled?: boolean;
  testID?: string;
  onPress: () => void;
}

// "callback" is the green button for the *With Callback* variant of an SDK call, as in the native demos.
const Button = ({title, variant = 'primary', disabled, testID, onPress}: Props) => (
  <Pressable
    testID={testID}
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({pressed}) => [
      styles.button,
      variant === 'callback' && styles.callback,
      (pressed || disabled) && styles.dimmed,
    ]}>
    <Text style={styles.title}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },
  callback: {
    backgroundColor: AppColors.success,
  },
  dimmed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.surface,
  },
});

export default Button;
