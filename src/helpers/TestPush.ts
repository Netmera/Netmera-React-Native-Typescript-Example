/*
 * Copyright (c) 2026 Netmera Research.
 */

import {Netmera} from 'react-native-netmera';

const TEST_PUSH_URL = 'netmera://e2e/push?nm=';
const TEST_SENDER_ID = '0000000000';

/**
 * Debug builds only. Nothing outside the app can hand an FCM message to the SDK on Android, so
 * e2e tests send the push payload with this deeplink and it takes the same call a real FCM
 * message takes.
 */
export const deliverTestPush = (url: string): boolean => {
  if (!__DEV__ || !url.startsWith(TEST_PUSH_URL)) {
    return false;
  }
  Netmera.onNetmeraFirebasePushMessageReceived(TEST_SENDER_ID, {
    _nm: decodeURIComponent(url.slice(TEST_PUSH_URL.length)),
  });
  return true;
};
