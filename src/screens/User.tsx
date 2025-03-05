/*
 * Copyright (c) 2022 Inomera Research.
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight, TouchableOpacity,
  View
} from "react-native";
import styles from '../Style';
import {Picker} from '@react-native-picker/picker';
import {Netmera, NMUserGender} from 'react-native-netmera';
import MyNetmeraUser from '../models/MyNetmeraUser';
import Colors from '../Colors';
import Toast from 'react-native-toast-message';
import {isIos} from '../helpers/DeviceUtils';

const User = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [gender, setGender] = useState(NMUserGender.NOT_SPECIFIED);

  const sendUserUpdateAsync = () => {
    const user = new MyNetmeraUser();

    // Set Default Attributes
    user.userId = userId;

    if (name !== '') {
      user.name = name;
    }
    if (surname !== '') {
      user.surname = surname;
    }
    if (email !== '') {
      user.email = email;
    }
    if (msisdn !== '') {
      user.msisdn = msisdn;
    }
    if (gender !== null) {
      user.gender = gender;
    }

    // Set Custom Attributes
    user.testGender = MyNetmeraUser.TestGender.TESTGENDER_MALE;
    user.testName = 'Test Name';

    Netmera.updateUser(user);
  };

  const sendUserUpdateSync = () => {
    const user = new MyNetmeraUser();

    // Set Default Attributes
    user.userId = userId;

    if (name !== '') {
      user.name = name;
    }
    if (surname !== '') {
      user.surname = surname;
    }
    if (email !== '') {
      user.email = email;
    }
    if (msisdn !== '') {
      user.msisdn = msisdn;
    }
    if (gender !== null) {
      user.gender = gender;
    }

    // Set Custom Attributes
    user.testGender = MyNetmeraUser.TestGender.TESTGENDER_MALE;
    user.testName = 'Test Name';

    Netmera.updateUser(user)
      .then(() => {
        console.log('User updated successfully!');
        Toast.show({
          type: 'success',
          text1: 'User updated successfully!',
        });
      })
      .catch(error => {
        console.log(error.code, error.message);
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        bounces={false}
        style={styles.scrollView}
        contentContainerStyle={{alignItems: 'center'}}>
        <TextInput
          placeholder={'UserId (optional)'}
          placeholderTextColor={Colors.dark}
          style={styles.textInput}
          value={userId}
          autoCapitalize={'none'}
          onChangeText={text => setUserId(text)}
        />
        <TextInput
          placeholder={'Name (optional)'}
          placeholderTextColor={Colors.dark}
          style={styles.textInput}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder={'Surname (optional)'}
          placeholderTextColor={Colors.dark}
          style={styles.textInput}
          value={surname}
          onChangeText={text => setSurname(text)}
        />
        <TextInput
          placeholder={'Email (optional)'}
          placeholderTextColor={Colors.dark}
          style={styles.textInput}
          keyboardType={'email-address'}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder={'Msisdn (optional)'}
          placeholderTextColor={Colors.dark}
          style={styles.textInput}
          keyboardType={'phone-pad'}
          value={msisdn}
          onChangeText={text => setMsisdn(text)}
        />
        <Text
          style={{
            width: '50%',
            color: Colors.black,
            textAlign: 'center',
            marginBottom: 5,
          }}>
          Gender (optional)
        </Text>
        <View style={styles.picker}>
          <Picker
            style={[{color: Colors.black}, isIos() ? {height: '35%'} : null]}
            itemStyle={{fontSize: 13}}
            mode={'dropdown'}
            selectedValue={gender}
            onValueChange={itemValue => setGender(itemValue)}
            dropdownIconColor={Colors.black}>
            <Picker.Item label="MALE" value={NMUserGender.MALE} />
            <Picker.Item label="FEMALE" value={NMUserGender.FEMALE} />
            <Picker.Item
              label="NOT SPECIFIED"
              value={NMUserGender.NOT_SPECIFIED}
            />
          </Picker>
        </View>

        <TouchableHighlight
          style={styles.button}
          onPress={() => sendUserUpdateSync()}
          underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Update User Sync</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => sendUserUpdateAsync()}
          underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Update User Async</Text>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
