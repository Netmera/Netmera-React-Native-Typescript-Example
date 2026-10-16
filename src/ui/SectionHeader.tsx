/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {StyleSheet, Text} from 'react-native';
import AppColors from './AppColors';

const SectionHeader = ({title}: {title: string}) => (
  <Text style={styles.header}>{title.toUpperCase()}</Text>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    fontSize: 13,
    color: AppColors.mutedText,
    backgroundColor: AppColors.groupedBackground,
  },
});

export default SectionHeader;
