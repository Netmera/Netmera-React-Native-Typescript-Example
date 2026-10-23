/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AppColors from './AppColors';

export type Operation = 'set' | 'unset' | 'add' | 'remove';

const LABELS: Record<Operation, string> = {
  set: 'Set',
  unset: 'Unset',
  add: 'Add',
  remove: 'Remove',
};

interface Props {
  label: string;
  options: Operation[];
  selected: Operation | null;
  testID?: string;
  onChange: (operation: Operation | null) => void;
}

/** Segmented choice of a profile operation; tapping the selected one clears it. */
const OperationSelector = ({label, options, selected, testID, onChange}: Props) => (
  <View style={styles.row}>
    {options.map((option, index) => {
      const isSelected = option === selected;
      return (
        <Pressable
          key={option}
          testID={testID ? `${testID}.${option}` : undefined}
          accessibilityRole="button"
          accessibilityLabel={`${label} ${LABELS[option]}`}
          accessibilityState={{selected: isSelected}}
          onPress={() => onChange(isSelected ? null : option)}
          style={[
            styles.segment,
            index > 0 && styles.segmentBorder,
            isSelected && styles.segmentSelected,
          ]}>
          <Text style={[styles.label, isSelected && styles.labelSelected]}>
            {LABELS[option]}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBorder: {
    borderLeftWidth: 1,
    borderLeftColor: AppColors.divider,
  },
  segmentSelected: {
    backgroundColor: AppColors.selected,
  },
  label: {
    fontSize: 12,
    color: AppColors.label,
  },
  labelSelected: {
    color: AppColors.primary,
  },
});

export default OperationSelector;
