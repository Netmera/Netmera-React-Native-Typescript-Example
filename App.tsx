/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Linking, StatusBar, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStaticNavigation, useNavigationContainerRef} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import Coupons from './src/screens/Coupons';
import Colors from './src/Colors';
import Events from './src/screens/Events';
import Toast from 'react-native-toast-message';
import PushEventModal from './src/components/PushEventModal';
import Category from './src/screens/Category';
import User from './src/screens/User';
import PushInbox from './src/screens/PushInbox';
import Settings from './src/screens/Settings';
import Profile from './src/screens/Profile';
import Permissions from './src/screens/Permissions';
import AutoTracking from './src/screens/AutoTracking';
import AutoTrackTest from './src/screens/AutoTrackTest';
import AutoTrackFlatListTest from './src/screens/AutoTrackFlatListTest';
import StackNavTest from './src/screens/StackNavTest';
import {Netmera, NetmeraAnalyticProvider} from 'react-native-netmera';
import {isAndroid, isIos} from './src/helpers/DeviceUtils';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, onMessage } from '@react-native-firebase/messaging';
import {HmsPushEvent, HmsPushInstanceId, RNRemoteMessage} from '@hmscore/react-native-hms-push';
import DeviceInfo from 'react-native-device-info';

const headerOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitle: () => (
    <View style={{justifyContent: 'flex-start', flex: 1}}>
      <Text style={{fontWeight: '500', fontSize: 18, color: Colors.white}}>
        {'Netmera React Native Demo'}
      </Text>
    </View>
  ),
};

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Dashboard',
  screens: {
    Dashboard: {screen: Dashboard, options: headerOptions},
    Category: Category,
    Coupons: Coupons,
    Events: Events,
    PushInbox: PushInbox,
    User: User,
    Profile: Profile,
    Settings: Settings,
    Permissions: Permissions,
    Autotracking: AutoTracking,
    AutoTrackTest: AutoTrackTest,
    AutoTrackFlatListTest: AutoTrackFlatListTest,
    StackNavTest: {screen: StackNavTest, options: {headerShown: false}},
  },
});

const Navigation = createStaticNavigation(RootStack);

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
    const fcmMessaging = getMessaging(getApp());
    getToken(fcmMessaging).then((pushToken: string) => {
      console.log('pushToken: ' + pushToken);
      Netmera.onNetmeraNewToken(pushToken);
    });

    onMessage(fcmMessaging, async remoteMessage => {
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

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle={isIos() ? 'dark-content' : 'light-content'} />
        <Navigation />
        <PushEventModal />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
