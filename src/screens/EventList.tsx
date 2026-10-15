/*
 * Copyright (c) 2026 Netmera Research.
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MenuRow from '../ui/MenuRow';
import AppColors from '../ui/AppColors';
import {sendEvent} from '../events/eventSender';
import {commerceEvents, EventEntry, generalEvents, mediaEvents} from '../events/eventLists';

const lists: Record<string, {id: string; events: EventEntry[]}> = {
  CommerceEvents: {id: 'commerce', events: commerceEvents},
  MediaEvents: {id: 'media', events: mediaEvents},
  GeneralEvents: {id: 'general', events: generalEvents},
};

const EventList = () => {
  const route = useRoute();
  const {id, events} = lists[route.name];

  const send = (entry: EventEntry) => {
    sendEvent(entry.create());
    Toast.show({type: 'info', text1: `${entry.title} sent.`, position: 'bottom'});
  };

  return (
    <ScrollView
      testID={`${id}.menu`}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      {events.map((entry, index) => (
        <MenuRow
          key={entry.id}
          testID={`${id}.menu.${entry.id}`}
          title={entry.title}
          showDivider={index < events.length - 1}
          onPress={() => send(entry)}
        />
      ))}
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

export default EventList;
