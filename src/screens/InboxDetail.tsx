/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Netmera, NetmeraPushObject, NMInboxStatus} from 'react-native-netmera';
import Button from '../ui/Button';
import TextButton from '../ui/TextButton';
import AppColors from '../ui/AppColors';
import {errorMessage} from '../helpers/CategoryChannelUtils';

interface RouteParams {
  message: NetmeraPushObject;
  index: number;
}

const InboxDetail = () => {
  const navigation = useNavigation<any>();
  const {message, index} = useRoute<any>().params as RouteParams;
  const [status, setStatus] = useState(message.inboxStatus);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TextButton testID="inbox.detail.close" title="Close" onPress={() => navigation.goBack()} />
      ),
    });
  }, [navigation]);

  const updateStatus = async (next: NMInboxStatus) => {
    try {
      await Netmera.inboxUpdateStatus(index, index + 1, next);
      setStatus(next);
      return true;
    } catch (e) {
      Toast.show({type: 'error', text1: 'Something went wrong', text2: errorMessage(e)});
      return false;
    }
  };

  const deleteMessage = async () => {
    if (await updateStatus(NMInboxStatus.STATUS_DELETED)) {
      navigation.goBack();
    }
  };

  const meta = [message.sendDate, message.category].filter(Boolean).join(' · ');

  return (
    <ScrollView
      testID="inbox.detail"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text testID="inbox.detail.title" style={styles.title}>
        {message.title || '(No title)'}
      </Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      {message.body ? <Text style={styles.body}>{message.body}</Text> : null}

      <View style={styles.actions}>
        {message.pushId ? (
          <Button
            testID="inbox.detail.open"
            title="Open"
            onPress={() => Netmera.handlePushObject(message.pushId!)}
          />
        ) : null}
        {message.interactiveActions?.map(action => (
          <Button
            key={action.id}
            title={action.actionTitle ?? action.id ?? 'Action'}
            onPress={() => action.id && Netmera.handleInteractiveAction(action.id)}
          />
        ))}
        {status === NMInboxStatus.STATUS_READ ? (
          <Button
            testID="inbox.detail.markUnread"
            title="Mark as unread"
            onPress={() => updateStatus(NMInboxStatus.STATUS_UNREAD)}
          />
        ) : null}
        {status !== NMInboxStatus.STATUS_DELETED ? (
          <Button
            testID="inbox.detail.delete"
            title="Delete"
            variant="destructive"
            onPress={deleteMessage}
          />
        ) : null}
      </View>
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
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: AppColors.label,
  },
  meta: {
    fontSize: 13,
    color: AppColors.mutedText,
  },
  body: {
    marginTop: 8,
    fontSize: 16,
    color: AppColors.label,
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
});

export default InboxDetail;
