/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PUSH_EVENT} from '../../NetmeraPushHeadlessTask';
import Colors from '../Colors';

interface PushEventEntry {
  id: number;
  event: string;
  data: unknown;
}

const PushEventModal = () => {
  const [entries, setEntries] = useState<PushEventEntry[]>([]);
  const [visible, setVisible] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      PUSH_EVENT,
      ({event, data}: {event: string; data: unknown}) => {
        counter.current += 1;
        setEntries(prev => [{id: counter.current, event, data}, ...prev]);
        setVisible(true);
      },
    );
    return () => sub.remove();
  }, []);

  const formatted = (data: unknown) =>
    JSON.stringify(data, null, 2);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}>
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Push Callbacks</Text>
            <Pressable onPress={() => { setVisible(false); setEntries([]); }}>
              <Text style={styles.clearButton}>Temizle</Text>
            </Pressable>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {entries.map(entry => (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.eventName}>{entry.event}</Text>
                <Text style={styles.json} selectable>
                  {formatted(entry.data)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  clearButton: {
    color: Colors.white,
    fontSize: 13,
    paddingHorizontal: 6,
  },
  closeButton: {
    color: Colors.white,
    fontSize: 18,
    paddingHorizontal: 4,
  },
  scroll: {
    padding: 12,
  },
  entry: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
  },
  eventName: {
    fontWeight: '700',
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 4,
  },
  json: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: Colors.darker,
    backgroundColor: Colors.lighter,
    borderRadius: 6,
    padding: 8,
  },
});

export default PushEventModal;
