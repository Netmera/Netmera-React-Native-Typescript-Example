/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Linking, StatusBar, Text, View} from 'react-native';
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
import Settings from './src/screens/Settings';
import Profile from './src/screens/Profile';
import Permissions from './src/screens/Permissions';
import {Netmera} from 'react-native-netmera';
import {isAndroid, isIos} from './src/helpers/DeviceUtils';
import messaging from '@react-native-firebase/messaging';
import {HmsPushEvent, HmsPushInstanceId, RNRemoteMessage} from '@hmscore/react-native-hms-push';
import DeviceInfo from 'react-native-device-info';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    Netmera.getInitialURL().then(url => {
      console.log('Netmera initial url: ', url);
      if (url) {
        Toast.show({
          type: 'success',
          text1: `Initial url: ${url}`,
        });
      }
    });

    Linking.getInitialURL().then(url => {
      console.log('Linking initial url: ', url);
      if (url) {
        Toast.show({
          type: 'success',
          text1: `Initial linking url: ${url}`,
        });
      }
    });

    Linking.addEventListener('url', event => {
      console.log('Linking foreground url: ', event.url);
      Toast.show({
        type: 'success',
        text1: `Foreground url: ${event.url}`,
      });
    });

    Netmera.onWidgetUrlTriggered(url => {
      console.log('Netmera triggered widget url: ', url);
      Toast.show({
        type: 'success',
        text1: `Widget URL handle by app: ${url}`,
      });
    });

    //FCM methods
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

  if (isAndroid()) {
    DeviceInfo.hasHms().then((hmsAvailable) => {
      if (hmsAvailable) {
        //HMS methods
        HmsPushInstanceId.getToken('')
            .then((result) => {
              // @ts-ignore
              Netmera.onNetmeraNewToken(result.result);
            })
            .catch((err) => {
              console.error('[getToken] Error/Exception: ' + JSON.stringify(err));
            });

        HmsPushEvent.onRemoteMessageReceived((event: any) => {
          // @ts-ignore
          const remoteMessage = new RNRemoteMessage(event.msg);
          let data = JSON.parse(remoteMessage.getData());
          if (Netmera.isNetmeraRemoteMessage(data)) {
            Netmera.onNetmeraHuaweiPushMessageReceived(
                remoteMessage.getFrom(),
                data,
            );
          }
        });
      }
    });
  }

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
        <Stack.Screen name={'Profile'} component={Profile} />
        <Stack.Screen name={'Settings'} component={Settings} />
        <Stack.Screen name={'Permissions'} component={Permissions} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
