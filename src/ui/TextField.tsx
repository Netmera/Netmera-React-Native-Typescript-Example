/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import AppColors from './AppColors';

const TextField = ({style, ...props}: TextInputProps) => (
  <TextInput
    placeholderTextColor={AppColors.placeholder}
    autoCapitalize="none"
    autoCorrect={false}
    style={[styles.field, style]}
    {...props}
  />
);

const styles = StyleSheet.create({
  field: {
    minHeight: 44,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: AppColors.fieldBorder,
    fontSize: 16,
    color: AppColors.label,
    backgroundColor: AppColors.surface,
  },
});

export default TextField;
