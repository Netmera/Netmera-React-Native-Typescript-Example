/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Netmera} from 'react-native-netmera';
import {
  onCarouselObjectSelected,
  onPushButtonClicked,
  onPushDismiss,
  onPushOpen,
  onPushReceive,
  onPushRegister,
} from './NetmeraPushHeadlessTask';

Netmera.initBroadcastReceiver(
  onPushRegister,
  onPushReceive,
  onPushOpen,
  onPushDismiss,
  onPushButtonClicked,
  onCarouselObjectSelected,
);

AppRegistry.registerComponent(appName, () => App);
