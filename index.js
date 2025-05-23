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
import messaging from '@react-native-firebase/messaging';
import {HmsPushMessaging, RNRemoteMessage} from '@hmscore/react-native-hms-push';

Netmera.initBroadcastReceiver(
  onPushRegister,
  onPushReceive,
  onPushOpen,
  onPushDismiss,
  onPushButtonClicked,
  onCarouselObjectSelected,
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (Netmera.isNetmeraRemoteMessage(remoteMessage.data)) {
    Netmera.onNetmeraFirebasePushMessageReceived(
      remoteMessage.from,
      remoteMessage.data,
    );
  }
});

HmsPushMessaging.setBackgroundMessageHandler(async dataMessage => {
  const remoteMessage = new RNRemoteMessage(dataMessage);
  let data = JSON.parse(remoteMessage.getData());
  if (Netmera.isNetmeraRemoteMessage(data)) {
    Netmera.onNetmeraHuaweiPushMessageReceived(
        remoteMessage.getFrom(),
        data,
    );
  }
});

Netmera.enablePopupPresentation();

AppRegistry.registerComponent(appName, () => App);
