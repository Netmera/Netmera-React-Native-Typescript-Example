/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {Netmera} from 'react-native-netmera';
import MenuRow from '../ui/MenuRow';
import AppColors from '../ui/AppColors';

const Core = () => {
  const enableData = () => {
    Netmera.startDataTransfer();
    Toast.show({type: 'info', text1: 'Data transfer is enabled.', position: 'bottom'});
  };

  const disableData = () => {
    Netmera.stopDataTransfer();
    Toast.show({type: 'info', text1: 'Data transfer is disabled.', position: 'bottom'});
  };

  const kill = () => {
    Netmera.kill();
  };

  return (
    <ScrollView
      testID="core.menu"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      <MenuRow testID="core.menu.enableData" title="Enable Data" onPress={enableData} />
      <MenuRow testID="core.menu.disableData" title="Disable Data" onPress={disableData} />
      <MenuRow
        testID="core.menu.kill"
        title="Kill Netmera"
        showDivider={false}
        onPress={kill}
      />
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

export default Core;
