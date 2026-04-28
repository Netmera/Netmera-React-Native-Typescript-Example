/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Colors';
import {Netmera, NotificationPermissionStatus} from 'react-native-netmera';
import {pushToken} from '../../NetmeraPushHeadlessTask';

const enum PushState {
  PushEnabled = 'PushEnabled',
  PushDisabled = 'PushDisabled',
}

const enum PopUpPresentationState {
  PopUpPresentationEnabled = 'PopUpPresentationEnabled',
  PopUpPresentationDisabled = 'PopUpPresentationDisabled',
}

const Settings = () => {
  const [pushState, setPushState] = useState<PushState>(PushState.PushEnabled);
  const [pushTokenString, setPushTokenString] = useState<string>('');
  const [popUpPresentationState, setPopUpPresentationState] =
    useState<PopUpPresentationState>(
      PopUpPresentationState.PopUpPresentationEnabled,
    );

  useLayoutEffect(() => {
    Netmera.isPushEnabled().then(enabled => {
      setPushState(enabled ? PushState.PushEnabled : PushState.PushDisabled);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPushTokenString(pushToken);
    }, 1000);
  }, []);

  const isPushEnabled = async () => {
    const enabled = await Netmera.isPushEnabled();
    Toast.show({
      type: 'info',
      text1: 'Is Push Enabled: ' + enabled,
      position: 'bottom',
    });
  };

  const changePushState = () => {
    if (pushState === PushState.PushEnabled) {
      setPushState(PushState.PushDisabled);
      Netmera.disablePush();
    } else {
      setPushState(PushState.PushEnabled);
      Netmera.enablePush();
    }
  };

  const checkNotificationPermission = () => {
    Netmera.checkNotificationPermission().then(status => {
      let statusString;
      switch (status) {
        case NotificationPermissionStatus.NotDetermined:
          statusString = 'NOT DETERMINED';
          break;
        case NotificationPermissionStatus.Blocked:
          statusString = 'BLOCKED';
          break;
        case NotificationPermissionStatus.Denied:
          statusString = 'DENIED';
          break;
        case NotificationPermissionStatus.Granted:
          statusString = 'GRANTED';
          break;
        default:
          statusString = 'UNDEFINED';
          break;
      }
      Toast.show({
        type: 'info',
        text1: `Permission status :: ${statusString}`,
        position: 'bottom',
      });
    });
  };

  const requestPushNotificationAuthorization = () => {
    Netmera.requestPushNotificationAuthorization();
  };

  const disableOrEnablePopUpPresentation = () => {
    if (
      popUpPresentationState === PopUpPresentationState.PopUpPresentationEnabled
    ) {
      Netmera.disablePopupPresentation();
      setPopUpPresentationState(
        PopUpPresentationState.PopUpPresentationDisabled,
      );
    } else {
      Netmera.enablePopupPresentation();
      setPopUpPresentationState(
        PopUpPresentationState.PopUpPresentationEnabled,
      );
    }
  };

  const enableLocationAndGeofence = () => {
    Netmera.requestPermissionsForLocation();
  };

  const setNetmeraMaxActiveRegion = () => {
    Netmera.setNetmeraMaxActiveRegions(10);
  };

  const enableData = () => {
    Netmera.startDataTransfer();
  };

  const disableData = () => {
    Netmera.stopDataTransfer();
  };

  const currentExternalId = async () => {
    Toast.show({
      type: 'info',
      text1: 'Current External Id: ' + (await Netmera.currentExternalId()),
      position: 'bottom',
    });
  };

  const kill = () => {
    Netmera.kill();
  };

  const toastPushToken = () => {
    Toast.show({
      type: 'info',
      text1: `Pushtoken :: \`${pushTokenString}\``,
      position: 'bottom',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={isPushEnabled}>
          <Text style={styles.text}>IS PUSH ENABLED</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={changePushState}>
            <Text style={styles.text}>
              {pushState === PushState.PushEnabled
                ? 'DISABLE PUSH'
                : 'ENABLE PUSH'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={checkNotificationPermission}>
          <Text style={styles.text}>CHECK NOTIFICATION PERMISSION</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={requestPushNotificationAuthorization}>
          <Text style={styles.text}>REQUEST PUSH NOTIFICATION AUTHORIZATION</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={disableOrEnablePopUpPresentation}>
            <Text style={styles.text}>
              {popUpPresentationState ===
              PopUpPresentationState.PopUpPresentationDisabled
                ? 'ENABLE POPUP PRES.'
                : 'DISABLE POPUP PRES.'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={enableLocationAndGeofence}>
          <Text style={styles.text}>REQUEST PERMISSION FOR LOCATION</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={setNetmeraMaxActiveRegion}>
          <Text style={styles.text}>SET NETMERA MAX ACTIVE REGIONS</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={enableData}>
            <Text style={styles.text}>START DATA TRANSFER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={disableData}>
            <Text style={styles.text}>STOP DATA TRANSFER</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={currentExternalId}>
          <Text style={styles.text}>CURRENT EXTERNAL ID</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={kill}>
          <Text style={styles.text}>KILL NETMERA</Text>
        </TouchableOpacity>

        <View style={styles.deviceTokenContainer}>
          <Text style={[styles.text, {color: Colors.black}]}>DEVICE TOKEN</Text>
        </View>
        <Text style={styles.tokenText}>{pushTokenString}</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={toastPushToken}>
          <Text style={styles.text}>TOAST PUSH TOKEN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    marginBottom: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  deviceTokenContainer: {
    marginTop: 5,
  },
  tokenText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.black,
    marginBottom: 10,
  },
});

export default Settings;
