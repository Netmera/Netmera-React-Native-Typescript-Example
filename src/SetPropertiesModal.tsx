import {
  Dimensions,
  Modal,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useLayoutEffect, useState} from 'react';
import Colors from './Colors';
import Config from 'react-native-config';
import {Netmera} from 'react-native-netmera';
import {isAndroid} from './helpers/DeviceUtils';

const {SharedPreferencesModule} = NativeModules;

type SetPropertiesModelPropTypes = {
  modalVisibility: boolean;
  onPressCancel: () => void;
};

const SetPropertiesModal: FC<SetPropertiesModelPropTypes> = ({
  modalVisibility,
  onPressCancel,
}) => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  useLayoutEffect(() => {
    SharedPreferencesModule.getApiKey().then((value: any) => {
      setApiKey(value.toString());
    });
    SharedPreferencesModule.getBaseUrl().then((value: any) => {
      setBaseUrl(value.toString());
    });
  }, []);

  const onLongPress = () => {
    if (baseUrl === 'b' && apiKey === 'b') {
      setBaseUrl(Config.NETMERA_PREPROD_BASE_URL ?? '');
      setApiKey(Config.NETMERA_PREPROD_API_KEY ?? '');
    } else if (baseUrl === 'c' && apiKey === 'c') {
      setBaseUrl(Config.NETMERA_TEST_BASE_URL ?? '');
      setApiKey(Config.NETMERA_TEST_API_KEY ?? '');
    } else if (baseUrl === 'd' && apiKey === 'd') {
      setBaseUrl(Config.NETMERA_PROD_BASE_URL ?? '');
      setApiKey(Config.NETMERA_PROD_API_KEY ?? '');
    } else if (baseUrl === 'e' && apiKey === 'e') {
      setBaseUrl(Config.NETMERA_UAT_BASE_URL ?? '');
      setApiKey(Config.NETMERA_UAT_API_KEY ?? '');
    }
  };

  const onPress = () => {
    if (baseUrl !== '' && apiKey !== '') {
      if (isAndroid()) {
        Netmera.skipAppConfigAndSetBaseUrl(baseUrl);
      } else {
        Netmera.setBaseUrl(baseUrl);
      }
      Netmera.setApiKey(apiKey);
      SharedPreferencesModule.setApiKey(apiKey);
      SharedPreferencesModule.setBaseUrl(baseUrl);
    }
    onPressCancel();
  };

  return (
    <Modal animationType={'slide'} transparent={true} visible={modalVisibility}>
      <View style={styles.container}>
        <View style={styles.popup}>
          <TextInput
            autoCapitalize={'none'}
            onChangeText={value => setBaseUrl(value)}
            placeholder={'BaseUrl'}
            placeholderTextColor={Colors.black}
            style={styles.input}
            value={baseUrl}
          />
          <TextInput
            autoCapitalize={'none'}
            onChangeText={value => setApiKey(value)}
            placeholder={'API Key'}
            placeholderTextColor={Colors.black}
            style={styles.input}
            value={apiKey}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPressCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onLongPress={() => onLongPress()}
              onPress={() => onPress()}>
              <Text style={styles.set}>SET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 20,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  cancel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 15, 43, 0.5)',
  },
  input: {
    height: 40,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    color: Colors.black,
  },
  popup: {
    width: Dimensions.get('screen').width - 64,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  set: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default SetPropertiesModal;
