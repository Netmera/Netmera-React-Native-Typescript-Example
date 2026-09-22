/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import Colors from '../Colors';

interface Props {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

const SwitchStatusRow = ({
  title,
  subtitle,
  subtitleColor,
  value,
  disabled,
  onValueChange,
}: Props) => (
  <View style={styles.row}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleColor ? {color: subtitleColor} : null]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    <Switch value={value} disabled={disabled} onValueChange={onValueChange} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    color: Colors.black,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.dark,
  },
});

export default SwitchStatusRow;
