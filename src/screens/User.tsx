/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../Style';
import {Netmera, NetmeraUser} from 'react-native-netmera';
import Colors from '../Colors';
import Toast from 'react-native-toast-message';

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

function applyUserInputs(
  user: NetmeraUser,
  userId: string,
  email: string,
  msisdn: string,
  wpNumber: string,
): void {
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
}

const User = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [wpNumber, setWpNumber] = useState('');

  const identifyUserWithCallback = () => {
    const user = new NetmeraUser();
    applyUserInputs(user, userId, email, msisdn, wpNumber);

    Netmera.identifyUser(user, (success, error) => {
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'User identified successfully!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `Identify user failed: ${error?.message ?? 'unknown error'}`,
        });
      }
    });
  };

  const identifyUserFireAndForget = () => {
    const user = new NetmeraUser();
    applyUserInputs(user, userId, email, msisdn, wpNumber);
    Netmera.identifyUser(user);
  };

  const fieldHint =
    'Leave empty: not set; type "null": sets null';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled
        bounces={false}
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: 24}}>
        <View style={{paddingHorizontal: 50, width: '100%'}}>
          <View style={{marginBottom: 12}}>
            <Text style={{color: Colors.black, fontSize: 14, marginBottom: 4}}>
              User ID (Optional)
            </Text>
            <Text style={{color: Colors.dark, fontSize: 11, marginBottom: 6}}>
              {fieldHint}
            </Text>
            <TextInput
              placeholder="User ID"
              placeholderTextColor={Colors.dark}
              style={styles.bigTextInput}
              value={userId}
              autoCapitalize="none"
              onChangeText={setUserId}
            />
          </View>

          <View style={{marginBottom: 12}}>
            <Text style={{color: Colors.black, fontSize: 14, marginBottom: 4}}>
              Email (Optional)
            </Text>
            <Text style={{color: Colors.dark, fontSize: 11, marginBottom: 6}}>
              {fieldHint}
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={Colors.dark}
              style={styles.bigTextInput}
              keyboardType="email-address"
              value={email}
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </View>

          <View style={{marginBottom: 12}}>
            <Text style={{color: Colors.black, fontSize: 14, marginBottom: 4}}>
              Msisdn (Optional)
            </Text>
            <Text style={{color: Colors.dark, fontSize: 11, marginBottom: 6}}>
              {fieldHint}
            </Text>
            <TextInput
              placeholder="Msisdn"
              placeholderTextColor={Colors.dark}
              style={styles.bigTextInput}
              keyboardType="phone-pad"
              value={msisdn}
              onChangeText={setMsisdn}
            />
          </View>

          <View style={{marginBottom: 12}}>
            <Text style={{color: Colors.black, fontSize: 14, marginBottom: 4}}>
              WhatsApp Number (Optional)
            </Text>
            <Text style={{color: Colors.dark, fontSize: 11, marginBottom: 6}}>
              {fieldHint}
            </Text>
            <TextInput
              placeholder="WhatsApp Number"
              placeholderTextColor={Colors.dark}
              style={styles.bigTextInput}
              keyboardType="phone-pad"
              value={wpNumber}
              onChangeText={setWpNumber}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, {marginTop: 30, width: '100%'}]}
            onPress={identifyUserWithCallback}>
            <Text style={styles.buttonText}>IDENTIFY USER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {width: '100%'}]}
            onPress={identifyUserFireAndForget}>
            <Text style={styles.buttonText}>IDENTIFY USER (No Callback)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
