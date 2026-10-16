/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {Fragment, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Netmera} from 'react-native-netmera';
import MenuRow from '../ui/MenuRow';
import SectionHeader from '../ui/SectionHeader';
import AppColors from '../ui/AppColors';

type ChannelId = 'email' | 'sms' | 'whatsApp';

const channels: {
  id: ChannelId;
  title: string;
  get: () => Promise<boolean>;
  set: (allowed: boolean) => Promise<void>;
}[] = [
  {
    id: 'email',
    title: 'Email',
    get: () => Netmera.getEmailPermission(),
    set: allowed => Netmera.setEmailPermission(allowed),
  },
  {
    id: 'sms',
    title: 'SMS',
    get: () => Netmera.getSmsPermission(),
    set: allowed => Netmera.setSmsPermission(allowed),
  },
  {
    id: 'whatsApp',
    title: 'WhatsApp',
    get: () => Netmera.getWhatsAppPermission(),
    set: allowed => Netmera.setWhatsAppPermission(allowed),
  },
];

const Permissions = () => {
  const [externalId, setExternalId] = useState<string>();
  const [statuses, setStatuses] = useState<Partial<Record<ChannelId, boolean>>>({});

  const updateStatus = (id: ChannelId, allowed: boolean) =>
    setStatuses(current => ({...current, [id]: allowed}));

  useEffect(() => {
    Netmera.currentExternalId()
      .then(setExternalId)
      .catch(e => console.error('Error fetching external id:', e));
    channels.forEach(channel => {
      channel
        .get()
        .then(allowed => updateStatus(channel.id, allowed))
        .catch(e => console.error(`Error fetching ${channel.title} permission:`, e));
    });
  }, []);

  const setPermission = (channel: (typeof channels)[number], allowed: boolean) => {
    updateStatus(channel.id, allowed);
    channel
      .set(allowed)
      .catch(e => console.error(`Error setting ${channel.title} permission:`, e));
  };

  return (
    <ScrollView
      testID="userSettings.scroll"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
      <SectionHeader title="User" />
      <Text testID="userSettings.externalId" style={styles.status}>
        Current External Id : {externalId || 'Not Set'}
      </Text>
      {channels.map(channel => (
        <Fragment key={channel.id}>
          <SectionHeader title={`${channel.title} Permission`} />
          <MenuRow
            testID={`userSettings.${channel.id}.allow`}
            title={`Allow ${channel.title} Permission`}
            onPress={() => setPermission(channel, true)}
          />
          <MenuRow
            testID={`userSettings.${channel.id}.disallow`}
            title={`Disallow ${channel.title} Permission`}
            onPress={() => setPermission(channel, false)}
          />
          <Text testID={`userSettings.${channel.id}.status`} style={styles.status}>
            {channel.title} Permission Status : {String(statuses[channel.id] ?? 'NaN')}
          </Text>
        </Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.groupedBackground,
  },
  status: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: AppColors.label,
    backgroundColor: AppColors.surface,
  },
});

export default Permissions;
