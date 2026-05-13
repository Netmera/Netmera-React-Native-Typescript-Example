/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';

const Permissions = () => {
  const [emailPermission, setEmailPermission] = useState(false);
  const [smsPermission, setSmsPermission] = useState(false);
  const [whatsAppPermission, setWhatsAppPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const [email, sms, whatsApp] = await Promise.all([
          Netmera.getEmailPermission(),
          Netmera.getSmsPermission(),
          Netmera.getWhatsAppPermission(),
        ]);
        setEmailPermission(email);
        setSmsPermission(sms);
        setWhatsAppPermission(whatsApp);
      } catch (e) {
        console.error('Error fetching permissions:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleEmailPermission = async (value: boolean) => {
    const previous = emailPermission;
    setEmailPermission(value);
    try {
      await Netmera.setEmailPermission(value);
    } catch (e) {
      console.error('Error setting email permission:', e);
      setEmailPermission(previous);
    }
  };

  const handleSmsPermission = async (value: boolean) => {
    const previous = smsPermission;
    setSmsPermission(value);
    try {
      await Netmera.setSmsPermission(value);
    } catch (e) {
      console.error('Error setting sms permission:', e);
      setSmsPermission(previous);
    }
  };

  const handleWhatsAppPermission = async (value: boolean) => {
    const previous = whatsAppPermission;
    setWhatsAppPermission(value);
    try {
      await Netmera.setWhatsAppPermission(value);
    } catch (e) {
      console.error('Error setting whatsapp permission:', e);
      setWhatsAppPermission(previous);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Email Permission</Text>
        <Switch
          value={emailPermission}
          onValueChange={handleEmailPermission}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <Text style={styles.label}>SMS Permission</Text>
        <Switch
          value={smsPermission}
          onValueChange={handleSmsPermission}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <Text style={styles.label}>WhatsApp Permission</Text>
        <Switch
          value={whatsAppPermission}
          onValueChange={handleWhatsAppPermission}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light,
    marginHorizontal: 16,
  },
});

export default Permissions;