/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {Netmera} from 'react-native-netmera';
import MenuRow from '../ui/MenuRow';
import AppColors from '../ui/AppColors';

const MAX_ACTIVE_REGIONS = 10;

const Location = () => {
  const requestLocationAuthorization = () => {
    Netmera.requestPermissionsForLocation();
  };

  const setMaxActiveRegions = () => {
    Netmera.setNetmeraMaxActiveRegions(MAX_ACTIVE_REGIONS);
    Toast.show({
      type: 'info',
      text1: `Max active regions set to ${MAX_ACTIVE_REGIONS}.`,
      position: 'bottom',
    });
  };

  return (
    <ScrollView
      testID="location.menu"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      <MenuRow
        testID="location.menu.requestLocationAuthorization"
        title="Request Location Authorization"
        onPress={requestLocationAuthorization}
      />
      <MenuRow
        testID="location.menu.setMaxActiveRegion"
        title={`Set Max Active Region (${MAX_ACTIVE_REGIONS})`}
        showDivider={false}
        onPress={setMaxActiveRegions}
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

export default Location;
