/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Netmera} from 'react-native-netmera';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import SwitchRow from '../ui/SwitchRow';
import TextField from '../ui/TextField';
import AppColors from '../ui/AppColors';

const ID = 'autotracking.automation';
const LIST_ITEMS = [0, 1, 2];

const doNothing = () => {};

const AutoTrackingAutomation = () => {
  const navigation = useNavigation<any>();
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <ScrollView
      testID={ID}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.container}
    >
      <SectionHeader title="Screen views" />
      <View style={styles.group}>
        <Button
          testID={`${ID}.openPlainScreen`}
          title="Open Plain Screen"
          onPress={() => navigation.navigate('AutoTrackingAutomationPlain')}
        />
        <Button
          testID={`${ID}.openModal`}
          title="Open Modal"
          onPress={() => navigation.navigate('AutoTrackingAutomationModal')}
        />
        <Button
          testID={`${ID}.openAlert`}
          title="Open Alert"
          onPress={() => Alert.alert('Autotracking Alert')}
        />
      </View>

      <SectionHeader title="Actions" />
      <View style={styles.group}>
        <Button testID={`${ID}.plainButton`} title="Plain Button" onPress={doNothing} />
        <Button
          testID={`${ID}.disabledButton`}
          title="Disabled Button"
          disabled
          onPress={doNothing}
        />
        <TextField testID={`${ID}.textField`} placeholder="Text Field" />
        <Button
          testID={`${ID}.manualAction`}
          title="Track Manual Action"
          onPress={() => Netmera.trackAction('manualAction')}
        />
      </View>
      <SwitchRow
        testID={`${ID}.switch`}
        title="Switch"
        value={switchOn}
        showDivider={false}
        onValueChange={setSwitchOn}
      />

      <SectionHeader title="Click target resolution" />
      <View style={styles.group}>
        <Pressable testID={`${ID}.card`} style={styles.card} onPress={doNothing}>
          <Text testID={`${ID}.cardTitle`} style={styles.cardTitle}>
            Card Title
          </Text>
          <Pressable testID={`${ID}.cardInfoIcon`} hitSlop={8} onPress={doNothing}>
            <Text style={styles.icon}>ⓘ</Text>
          </Pressable>
        </Pressable>
        <Pressable testID={`${ID}.outerCard`} style={styles.card} onPress={doNothing}>
          <Pressable testID={`${ID}.innerCard`} style={styles.innerCard} onPress={doNothing}>
            <Text testID={`${ID}.innerCardTitle`} style={styles.cardTitle}>
              Inner Card Title
            </Text>
          </Pressable>
        </Pressable>
        <Pressable style={styles.card} onPress={doNothing}>
          <Text testID={`${ID}.textOnlyButtonTitle`} style={styles.cardTitle}>
            Text Only Button
          </Text>
        </Pressable>
        <Text testID={`${ID}.plainText`} style={styles.cardTitle}>
          Plain Text
        </Text>
      </View>

      <SectionHeader title="Lists" />
      <FlatList
        testID={`${ID}.list`}
        horizontal
        data={LIST_ITEMS}
        keyExtractor={item => String(item)}
        contentContainerStyle={styles.group}
        renderItem={({item}) => (
          <Pressable testID={`${ID}.listItem.${item}`} style={styles.listItem} onPress={doNothing}>
            <Text style={styles.cardTitle}>{`Item ${item}`}</Text>
          </Pressable>
        )}
      />
    </ScrollView>
  );
};

export const AutoTrackingAutomationPlain = () => (
  <View style={styles.centered}>
    <Text style={styles.cardTitle}>Plain Screen</Text>
  </View>
);

export const AutoTrackingAutomationModal = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.centered}>
      <Button testID={`${ID}.closeModal`} title="Close Modal" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.groupedBackground,
  },
  group: {
    gap: 12,
    padding: 16,
    backgroundColor: AppColors.surface,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: AppColors.fieldBorder,
  },
  innerCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: AppColors.groupedBackground,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    color: AppColors.label,
  },
  icon: {
    fontSize: 20,
    color: AppColors.primary,
  },
  listItem: {
    width: 120,
    padding: 16,
    borderRadius: 8,
    backgroundColor: AppColors.groupedBackground,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: AppColors.surface,
  },
});

export default AutoTrackingAutomation;
