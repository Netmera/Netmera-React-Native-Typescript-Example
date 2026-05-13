/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Colors';
import {Netmera, Gender} from 'react-native-netmera';
import {MyNetmeraUserProfile} from '../models/MyNetmeraUserProfile';

type FieldOperation = 'none' | 'set' | 'unset';
type CollectionOperation = 'none' | 'set' | 'unset' | 'add' | 'remove';

const Profile = () => {
  const [name, setName] = useState('');
  const [nameOp, setNameOp] = useState<FieldOperation>('none');

  const [surname, setSurname] = useState('');
  const [surnameOp, setSurnameOp] = useState<FieldOperation>('none');

  const [gender, setGender] = useState('');
  const [genderOp, setGenderOp] = useState<FieldOperation>('none');

  const [segments1, setSegments1] = useState('');
  const [segments1Op, setSegments1Op] = useState<CollectionOperation>('none');

  const [segments2, setSegments2] = useState('');
  const [segments2Op, setSegments2Op] = useState<CollectionOperation>('none');

  const [includeCustomAttributes, setIncludeCustomAttributes] = useState(false);

  const toSegments = (text: string): string[] =>
    text
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

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

    if (includeCustomAttributes) {
      profile.luckyNumbers.set([1, 2, 3]);
      profile.isLuckyNumbersEnabled.set(true);
      profile.lastLoginPlatform.set('ReactNative');
    }

    return profile;
  };

  const updateProfileWithCallback = () => {
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

  const updateProfileAsync = () => {
    Netmera.updateUserProfile(buildProfile());
  };

  const OpButtons = ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (v: any) => void;
    options: string[];
  }) => (
    <View style={styles.opRow}>
      {options.map(op => (
        <TouchableOpacity
          key={op}
          style={[styles.opButton, value === op && styles.opButtonActive]}
          onPress={() => onChange(value === op ? 'none' : op)}>
          <Text
            style={[styles.opButtonText, value === op && styles.opButtonTextActive]}>
            {op.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={Colors.dark}
          value={name}
          onChangeText={setName}
        />
        <OpButtons value={nameOp} onChange={setNameOp} options={['set', 'unset']} />

        <Text style={styles.sectionLabel}>Surname</Text>
        <TextInput
          style={styles.input}
          placeholder="Surname"
          placeholderTextColor={Colors.dark}
          value={surname}
          onChangeText={setSurname}
        />
        <OpButtons value={surnameOp} onChange={setSurnameOp} options={['set', 'unset']} />

        <Text style={styles.sectionLabel}>MALE:0, FEMALE:1, NOT_SPECIFIED:2</Text>
        <TextInput
          style={styles.input}
          placeholder="Gender"
          placeholderTextColor={Colors.dark}
          keyboardType="numeric"
          value={gender}
          onChangeText={setGender}
        />
        <OpButtons value={genderOp} onChange={setGenderOp} options={['set', 'unset']} />

        <Text style={styles.sectionLabel}>Segments e.g. seg1,seg2</Text>
        <TextInput
          style={styles.input}
          placeholder="Segments"
          placeholderTextColor={Colors.dark}
          value={segments1}
          onChangeText={setSegments1}
        />
        <OpButtons
          value={segments1Op}
          onChange={setSegments1Op}
          options={['set', 'unset', 'add', 'remove']}
        />

        <Text style={styles.sectionLabel}>Segments e.g. seg1,seg2</Text>
        <TextInput
          style={styles.input}
          placeholder="Segments"
          placeholderTextColor={Colors.dark}
          value={segments2}
          onChangeText={setSegments2}
        />
        <OpButtons
          value={segments2Op}
          onChange={setSegments2Op}
          options={['set', 'unset', 'add', 'remove']}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Custom Attributes</Text>
          <Switch
            value={includeCustomAttributes}
            onValueChange={setIncludeCustomAttributes}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={updateProfileWithCallback}>
          <Text style={styles.buttonText}>UPDATE PROFILE ATTRIBUTES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={updateProfileAsync}>
          <Text style={styles.buttonText}>UPDATE PROFILE ATTRIBUTES (No Callback)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    color: Colors.black,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  opRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  opButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  opButtonActive: {
    backgroundColor: Colors.primary,
  },
  opButtonText: {
    fontSize: 12,
    color: Colors.primary,
  },
  opButtonTextActive: {
    color: Colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: Colors.black,
  },
  button: {
    marginBottom: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },
});

export default Profile;
