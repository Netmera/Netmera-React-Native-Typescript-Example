/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {ReactNode, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {Netmera, Gender} from 'react-native-netmera';
import {MyNetmeraUserProfile} from '../models/MyNetmeraUserProfile';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import OperationSelector, {Operation} from '../ui/OperationSelector';
import AppColors from '../ui/AppColors';

const FIELD_OPS: Operation[] = ['set', 'unset'];
const COLLECTION_OPS: Operation[] = ['set', 'unset', 'add', 'remove'];

const toSegments = (text: string): string[] =>
  text
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

const toNumbers = (text: string): number[] =>
  text
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !isNaN(n));

interface AttributeInputProps {
  id: string;
  title: string;
  options: Operation[];
  operation: Operation | null;
  onOperationChange: (operation: Operation | null) => void;
  children: ReactNode;
}

const AttributeInput = ({
  id,
  title,
  options,
  operation,
  onOperationChange,
  children,
}: AttributeInputProps) => (
  <View style={styles.attribute}>
    <Text style={styles.attributeTitle}>{title}</Text>
    <OperationSelector
      label={title}
      testID={`userProfile.${id}.operation`}
      options={options}
      selected={operation}
      onChange={onOperationChange}
    />
    {children}
  </View>
);

const Profile = () => {
  const [name, setName] = useState('');
  const [nameOp, setNameOp] = useState<Operation | null>(null);

  const [surname, setSurname] = useState('');
  const [surnameOp, setSurnameOp] = useState<Operation | null>(null);

  const [gender, setGender] = useState('');
  const [genderOp, setGenderOp] = useState<Operation | null>(null);

  const [segments1, setSegments1] = useState('');
  const [segments1Op, setSegments1Op] = useState<Operation | null>(null);

  const [segments2, setSegments2] = useState('');
  const [segments2Op, setSegments2Op] = useState<Operation | null>(null);

  const [lastLoginPlatform, setLastLoginPlatform] = useState('');
  const [lastLoginPlatformOp, setLastLoginPlatformOp] = useState<Operation | null>(null);

  const [loginCount, setLoginCount] = useState('');
  const [loginCountOp, setLoginCountOp] = useState<Operation | null>(null);

  const [isLuckyNumbersEnabled, setIsLuckyNumbersEnabled] = useState(false);
  const [isLuckyNumbersEnabledOp, setIsLuckyNumbersEnabledOp] = useState<Operation | null>(
    null,
  );

  const [luckyNumbers, setLuckyNumbers] = useState('');
  const [luckyNumbersOp, setLuckyNumbersOp] = useState<Operation | null>(null);

  const buildProfile = (): MyNetmeraUserProfile => {
    const profile = new MyNetmeraUserProfile();

    if (nameOp === 'set' && name.length > 0) {
      profile.name.set(name);
    } else if (nameOp === 'unset') {
      profile.name.unset();
    }

    if (surnameOp === 'set' && surname.length > 0) {
      profile.surname.set(surname);
    } else if (surnameOp === 'unset') {
      profile.surname.unset();
    }

    const genderNum = parseInt(gender, 10);
    if (!isNaN(genderNum) && genderOp === 'set') {
      const genderValues = [Gender.MALE, Gender.FEMALE, Gender.NOT_SPECIFIED];
      if (genderNum >= 0 && genderNum < genderValues.length) {
        profile.gender.set(genderValues[genderNum]);
      }
    } else if (genderOp === 'unset') {
      profile.gender.unset();
    }

    const segs1 = toSegments(segments1);
    if (segments1Op === 'set' && segs1.length > 0) {
      profile.externalSegments.set(segs1);
    } else if (segments1Op === 'unset') {
      profile.externalSegments.unset();
    } else if (segments1Op === 'add' && segs1.length > 0) {
      profile.externalSegments.add(segs1);
    } else if (segments1Op === 'remove' && segs1.length > 0) {
      profile.externalSegments.remove(segs1);
    }

    const segs2 = toSegments(segments2);
    if (segments2Op === 'set' && segs2.length > 0) {
      profile.externalSegments.set(segs2);
    } else if (segments2Op === 'unset') {
      profile.externalSegments.unset();
    } else if (segments2Op === 'add' && segs2.length > 0) {
      profile.externalSegments.add(segs2);
    } else if (segments2Op === 'remove' && segs2.length > 0) {
      profile.externalSegments.remove(segs2);
    }

    if (lastLoginPlatformOp === 'set') {
      profile.lastLoginPlatform.set(lastLoginPlatform);
    } else if (lastLoginPlatformOp === 'unset') {
      profile.lastLoginPlatform.unset();
    }

    const loginCountNum = Number(loginCount);
    if (loginCountOp === 'set' && loginCount.trim() !== '' && !isNaN(loginCountNum)) {
      profile.loginCount.set(loginCountNum);
    } else if (loginCountOp === 'unset') {
      profile.loginCount.unset();
    }

    if (isLuckyNumbersEnabledOp === 'set') {
      profile.isLuckyNumbersEnabled.set(isLuckyNumbersEnabled);
    } else if (isLuckyNumbersEnabledOp === 'unset') {
      profile.isLuckyNumbersEnabled.unset();
    }

    const luckyNums = toNumbers(luckyNumbers);
    if (luckyNumbersOp === 'set' && luckyNums.length > 0) {
      profile.luckyNumbers.set(luckyNums);
    } else if (luckyNumbersOp === 'unset') {
      profile.luckyNumbers.unset();
    } else if (luckyNumbersOp === 'add' && luckyNums.length > 0) {
      profile.luckyNumbers.add(luckyNums);
    } else if (luckyNumbersOp === 'remove' && luckyNums.length > 0) {
      profile.luckyNumbers.remove(luckyNums);
    }

    return profile;
  };

  const updateUser = () => {
    Netmera.updateUserProfile(buildProfile());
  };

  const updateUserWithCallback = () => {
    Netmera.updateUserProfile(buildProfile(), (success, error) => {
      if (success) {
        Toast.show({type: 'success', text1: 'User profile updated successfully!'});
      } else {
        Toast.show({
          type: 'error',
          text1: `Update profile failed: ${error?.message ?? 'unknown error'}`,
        });
      }
    });
  };

  return (
    <ScrollView
      testID="userProfile.scroll"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.container}>
      <View style={styles.section}>
        <AttributeInput
          id="name"
          title="Name"
          options={FIELD_OPS}
          operation={nameOp}
          onOperationChange={setNameOp}>
          <TextField
            testID="userProfile.name.value"
            placeholder="Value..."
            value={name}
            onChangeText={setName}
          />
        </AttributeInput>
        <AttributeInput
          id="surname"
          title="Surname"
          options={FIELD_OPS}
          operation={surnameOp}
          onOperationChange={setSurnameOp}>
          <TextField
            testID="userProfile.surname.value"
            placeholder="Value..."
            value={surname}
            onChangeText={setSurname}
          />
        </AttributeInput>
        <AttributeInput
          id="gender"
          title="Gender (MALE:0, FEMALE:1, NOT_SPECIFIED:2)"
          options={FIELD_OPS}
          operation={genderOp}
          onOperationChange={setGenderOp}>
          <TextField
            testID="userProfile.gender.value"
            placeholder="Value..."
            keyboardType="numeric"
            value={gender}
            onChangeText={setGender}
          />
        </AttributeInput>
        <AttributeInput
          id="externalSegments1"
          title="External Segments"
          options={COLLECTION_OPS}
          operation={segments1Op}
          onOperationChange={setSegments1Op}>
          <TextField
            testID="userProfile.externalSegments1.value"
            placeholder="seg1,seg2"
            value={segments1}
            onChangeText={setSegments1}
          />
        </AttributeInput>
        <AttributeInput
          id="externalSegments2"
          title="External Segments"
          options={COLLECTION_OPS}
          operation={segments2Op}
          onOperationChange={setSegments2Op}>
          <TextField
            testID="userProfile.externalSegments2.value"
            placeholder="seg1,seg2"
            value={segments2}
            onChangeText={setSegments2}
          />
        </AttributeInput>
      </View>

      <SectionHeader title="Custom Attributes" />
      <View style={styles.section}>
        <AttributeInput
          id="lastLoginPlatform"
          title="Last Login Platform (string)"
          options={FIELD_OPS}
          operation={lastLoginPlatformOp}
          onOperationChange={setLastLoginPlatformOp}>
          <TextField
            testID="userProfile.lastLoginPlatform.value"
            placeholder="Value..."
            value={lastLoginPlatform}
            onChangeText={setLastLoginPlatform}
          />
        </AttributeInput>
        <AttributeInput
          id="loginCount"
          title="Login Count (number)"
          options={FIELD_OPS}
          operation={loginCountOp}
          onOperationChange={setLoginCountOp}>
          <TextField
            testID="userProfile.loginCount.value"
            placeholder="Value..."
            keyboardType="numeric"
            value={loginCount}
            onChangeText={setLoginCount}
          />
        </AttributeInput>
        <AttributeInput
          id="isLuckyNumbersEnabled"
          title="Is Lucky Numbers Enabled (boolean)"
          options={FIELD_OPS}
          operation={isLuckyNumbersEnabledOp}
          onOperationChange={setIsLuckyNumbersEnabledOp}>
          <Switch
            testID="userProfile.isLuckyNumbersEnabled.value"
            accessibilityLabel="Is Lucky Numbers Enabled"
            value={isLuckyNumbersEnabled}
            onValueChange={setIsLuckyNumbersEnabled}
          />
        </AttributeInput>
        <AttributeInput
          id="luckyNumbers"
          title="Lucky Numbers e.g. 0,1,2 (number[])"
          options={COLLECTION_OPS}
          operation={luckyNumbersOp}
          onOperationChange={setLuckyNumbersOp}>
          <TextField
            testID="userProfile.luckyNumbers.value"
            placeholder="0,1,2"
            value={luckyNumbers}
            onChangeText={setLuckyNumbers}
          />
        </AttributeInput>

        <Button testID="userProfile.submit" title="Update User" onPress={updateUser} />
        <Button
          testID="userProfile.submitWithCallback"
          title="Update User With Callback"
          variant="callback"
          onPress={updateUserWithCallback}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface,
  },
  section: {
    padding: 16,
    gap: 20,
  },
  attribute: {
    gap: 8,
  },
  attributeTitle: {
    fontSize: 15,
    color: AppColors.label,
  },
});

export default Profile;
