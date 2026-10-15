/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MenuRow from '../ui/MenuRow';
import SwitchRow from '../ui/SwitchRow';
import AppColors from '../ui/AppColors';
import {isGenericMethodEnabled, setGenericMethodEnabled} from '../events/eventSender';

const Events = () => {
  const navigation = useNavigation<any>();
  const [useGenericMethod, setUseGenericMethod] = useState(isGenericMethodEnabled);

  const onGenericMethodChange = (enabled: boolean) => {
    setGenericMethodEnabled(enabled);
    setUseGenericMethod(enabled);
  };

  return (
    <ScrollView
      testID="events.menu"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}>
      <SwitchRow
        testID="events.genericMethod"
        title="Use Generic Method"
        value={useGenericMethod}
        onValueChange={onGenericMethodChange}
      />
      <MenuRow
        testID="events.menu.commerce"
        title="Commerce Event Test"
        onPress={() => navigation.navigate('CommerceEvents')}
      />
      <MenuRow
        testID="events.menu.media"
        title="Media Event Test"
        onPress={() => navigation.navigate('MediaEvents')}
      />
      <MenuRow
        testID="events.menu.general"
        title="General Event Test"
        showDivider={false}
        onPress={() => navigation.navigate('GeneralEvents')}
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
    paddingVertical: 8,
  },
});

export default Events;
