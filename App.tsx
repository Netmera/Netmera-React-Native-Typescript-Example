/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import Coupons from './src/screens/Coupons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Events from './src/screens/Events';
import Toast from 'react-native-toast-message';
import Category from './src/screens/Category';
import User from './src/screens/User';
import PushInbox from './src/screens/PushInbox';
import SetPropertiesModal from './src/SetPropertiesModal';
import {Netmera} from 'react-native-netmera';
import {isIos} from './src/helpers/DeviceUtils';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

const App = () => {
  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

  useEffect(() => {
    Netmera.getInitialURL().then(url => {
      if (url) {
        Toast.show({
          type: 'success',
          text1: `Initial url: ${url}`,
        });
      }
    });

    Netmera.onWidgetUrlTriggered(url => {
      console.log('Netmera triggered widget url: ', url);
      Toast.show({
        type: 'success',
        text1: `Widget URL handle by app: ${url}`,
      });
    });

    messaging()
      .getToken()
      .then((pushToken: string) => {
        console.log('pushToken: ' + pushToken);
        Netmera.onNetmeraNewToken(pushToken);
      });

    messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage));
      if (
        Netmera.isNetmeraRemoteMessage(
          remoteMessage.data as {[key: string]: string},
        )
      ) {
        Netmera.onNetmeraFirebasePushMessageReceived(
          remoteMessage.from,
          remoteMessage.data as {[key: string]: string},
        );
      }
    });
  }, []);

  const headerOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTitle: () => (
      <View style={{justifyContent: 'flex-start', flex: 1}}>
        <Text style={{fontWeight: '500', fontSize: 18, color: Colors.white}}>
          {'ReactTSExample'}
        </Text>
      </View>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => setModalVisibility(true)}>
        <Text style={{color: Colors.white}}>SET PROPERTIES</Text>
      </TouchableOpacity>
    ),
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle={isIos() ? 'dark-content' : 'light-content'} />
      <Stack.Navigator initialRouteName={'Dashboard'}>
        <Stack.Screen name={'Category'} component={Category} />
        <Stack.Screen name={'Coupons'} component={Coupons} />
        <Stack.Screen
          name={'Dashboard'}
          options={headerOptions}
          component={Dashboard}
        />
        <Stack.Screen name={'Events'} component={Events} />
        <Stack.Screen name={'PushInbox'} component={PushInbox} />
        <Stack.Screen name={'User'} component={User} />
      </Stack.Navigator>
      <Toast />
      <SetPropertiesModal
        modalVisibility={modalVisibility}
        onPressCancel={() => setModalVisibility(false)}
      />
    </NavigationContainer>
  );
};

export default App;
