/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Netmera, NotificationPermissionStatus} from 'react-native-netmera';
import MenuRow from '../ui/MenuRow';
import SwitchRow from '../ui/SwitchRow';
import AppColors from '../ui/AppColors';

const PERMISSION_TITLES: Record<NotificationPermissionStatus, string> = {
  [NotificationPermissionStatus.NotDetermined]: 'Not determined',
  [NotificationPermissionStatus.Blocked]: 'Blocked',
  [NotificationPermissionStatus.Denied]: 'Denied',
  [NotificationPermissionStatus.Granted]: 'Granted',
};

const Notification = () => {
  const navigation = useNavigation<any>();
  const [permission, setPermission] = useState<NotificationPermissionStatus>();
  const [pushEnabled, setPushEnabled] = useState(false);

  const refresh = useCallback(() => {
    Netmera.checkNotificationPermission().then(setPermission);
    Netmera.isPushEnabled().then(setPushEnabled);
  }, []);

  useFocusEffect(refresh);

  const registerPush = () => {
    Netmera.requestPushNotificationAuthorization()
      .catch(error => console.log('requestPushNotificationAuthorization error: ', error))
      .finally(refresh);
  };

  const changePushReceiving = (enabled: boolean) => {
    if (enabled) {
      Netmera.enablePush();
    } else {
      Netmera.disablePush();
    }
    setPushEnabled(enabled);
  };

  return (
    <ScrollView
      testID="notification.menu"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      <MenuRow
        testID="notification.menu.registerPush"
        title="Register Push"
        onPress={registerPush}
      />
      <MenuRow
        testID="notification.menu.permission"
        title="Check Push Permission Type"
        subtitle={permission ? PERMISSION_TITLES[permission] : '—'}
        onPress={refresh}
      />
      <SwitchRow
        testID="notification.menu.pushReceivingStatus"
        title="Push Receiving Status"
        value={pushEnabled}
        onValueChange={changePushReceiving}
      />
      <MenuRow
        testID="notification.menu.inAppMessages"
        title="In-App Messages"
        showDivider={false}
        onPress={() => navigation.navigate('InAppMessages')}
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

export default Notification;
