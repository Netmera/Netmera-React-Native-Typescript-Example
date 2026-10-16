/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {Netmera, NetmeraUser} from 'react-native-netmera';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import AppColors from '../ui/AppColors';

// Empty input leaves the field untouched; "null" clears it.
function valueFromInput(text: string): string | null {
  const t = text.trim();
  if (t.toLowerCase() === 'null') {
    return null;
  }
  return t;
}

function hasInput(text: string): boolean {
  return text.trim().length > 0;
}

const User = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [wpNumber, setWpNumber] = useState('');

  const buildUser = () => {
    const user = new NetmeraUser();
    if (hasInput(userId)) {
      user.userId = valueFromInput(userId);
    }
    if (hasInput(email)) {
      user.email = valueFromInput(email);
    }
    if (hasInput(msisdn)) {
      user.msisdn = valueFromInput(msisdn);
    }
    if (hasInput(wpNumber)) {
      user.wpNumber = valueFromInput(wpNumber);
    }
    return user;
  };

  const identifyUser = () => {
    Netmera.identifyUser(buildUser());
  };

  const identifyUserWithCallback = () => {
    Netmera.identifyUser(buildUser(), (success, error) => {
      if (success) {
        Toast.show({type: 'success', text1: 'User identified successfully!'});
      } else {
        Toast.show({
          type: 'error',
          text1: `Identify user failed: ${error?.message ?? 'unknown error'}`,
        });
      }
    });
  };

  return (
    <ScrollView
      testID="userIdentify.scroll"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      contentContainerStyle={styles.content}>
      <TextField
        testID="userIdentify.userId"
        placeholder="User ID (Type null to delete it)"
        value={userId}
        onChangeText={setUserId}
      />
      <TextField
        testID="userIdentify.email"
        placeholder="Email (Type null to delete it)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        testID="userIdentify.msisdn"
        placeholder="MSISDN (Type null to delete it)"
        value={msisdn}
        onChangeText={setMsisdn}
      />
      <TextField
        testID="userIdentify.whatsApp"
        placeholder="WhatsApp Number (Type null to delete it)"
        value={wpNumber}
        onChangeText={setWpNumber}
      />
      <Button testID="userIdentify.submit" title="Identify User" onPress={identifyUser} />
      <Button
        testID="userIdentify.submitWithCallback"
        title="Identify User With Callback"
        variant="callback"
        onPress={identifyUserWithCallback}
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
    padding: 16,
    gap: 16,
  },
});

export default User;
