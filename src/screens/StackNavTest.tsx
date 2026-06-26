/*
 * Stack navigator tracking test.
 * Uses @react-navigation/stack (JS stack) — not native-stack — to verify
 * that screen name tracking works correctly in a nested JS stack.
 */

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../Colors';

const Stack = createStackNavigator();

// ── Screen A ──────────────────────────────────────────────────────────────────

const ScreenA = ({navigation}: any) => (
  <View style={styles.container}>
    <Text style={styles.hint}>
      This screen's name is <Text style={styles.bold}>StackScreenA</Text>.{'\n'}
      Pressing "Track Action" should send an autotracking event as{'\n'}
      <Text style={styles.code}>StackScreenA|track-action-btn</Text>.
    </Text>

    <Pressable
      style={[styles.btn, styles.btnPrimary]}
      accessibilityLabel="track-action-btn"
      onPress={() => console.log('[NMAutotrack] action → "test-action"')}>
      <Text style={styles.btnText}>Track Action</Text>
    </Pressable>

    <Pressable
      style={[styles.btn, styles.btnSecondary]}
      accessibilityLabel="go-to-screen-b"
      onPress={() => navigation.navigate('StackScreenB')}>
      <Text style={styles.btnTextDark}>Go to StackScreenB →</Text>
    </Pressable>
  </View>
);

// ── Screen B ──────────────────────────────────────────────────────────────────

const ScreenB = ({navigation}: any) => (
  <View style={styles.container}>
    <Text style={styles.hint}>
      This screen's name is <Text style={styles.bold}>StackScreenB</Text>.{'\n'}
      Pressing "Track Action" should send an autotracking event as{'\n'}
      <Text style={styles.code}>StackScreenB|track-action-btn</Text>.
    </Text>

    <Pressable
      style={[styles.btn, styles.btnPrimary]}
      accessibilityLabel="track-action-btn"
      onPress={() => console.log('[NMAutotrack] action → "test-action"')}>
      <Text style={styles.btnText}>Track Action</Text>
    </Pressable>

    <Pressable
      style={[styles.btn, styles.btnSecondary]}
      accessibilityLabel="go-back-btn"
      onPress={() => navigation.goBack()}>
      <Text style={styles.btnTextDark}>← Back</Text>
    </Pressable>
  </View>
);

// ── Navigator ─────────────────────────────────────────────────────────────────

const StackNavTest = () => (
  <Stack.Navigator>
    <Stack.Screen name="StackScreenA" component={ScreenA} />
    <Stack.Screen name="StackScreenB" component={ScreenB} />
  </Stack.Navigator>
);

export default StackNavTest;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.lighter,
    gap: 12,
  },
  hint: {
    fontSize: 14,
    color: Colors.darker,
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {fontWeight: '700'},
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
  },
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btnPrimary: {backgroundColor: Colors.primary},
  btnSecondary: {backgroundColor: Colors.light},
  btnText: {color: Colors.white, fontWeight: '600', fontSize: 15},
  btnTextDark: {color: Colors.darker, fontWeight: '600', fontSize: 15},
});
