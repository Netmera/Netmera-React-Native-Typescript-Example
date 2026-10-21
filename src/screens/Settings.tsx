/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';
import {pushToken} from '../../NetmeraPushHeadlessTask';

const Settings = () => {
  const [pushTokenString, setPushTokenString] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setPushTokenString(pushToken ?? "");
    }, 1000);
  }, []);

  const currentExternalId = async () => {
    Toast.show({
      type: 'info',
      text1: 'Current External Id: ' + (await Netmera.currentExternalId()),
      position: 'bottom',
    });
  };

  const toastPushToken = () => {
    Toast.show({
      type: 'info',
      text1: `Pushtoken :: \`${pushTokenString}\``,
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={currentExternalId}>
          <Text style={styles.text}>CURRENT EXTERNAL ID</Text>
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
    </View>
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
