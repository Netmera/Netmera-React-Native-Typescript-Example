/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../Colors';

const Dashboard = ({navigation}: any) => {
  const buttons = [
    {name: 'USER', route: 'User'},
    {name: 'PROFILE', route: 'Profile'},
    {name: 'EVENT', route: 'Events'},
    {name: 'SETTINGS', route: 'Settings'},
    {name: 'PUSH INBOX', route: 'PushInbox'},
    {name: 'CATEGORY', route: 'Category'},
    {name: 'PERMISSIONS', route: 'Permissions'},
    {name: 'COUPONS', route: 'Coupons'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => navigation.navigate(item.route)}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        ))}
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
});

export default Dashboard;
