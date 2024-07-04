import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';
import {pushToken} from '../../NetmeraPushHeadlessTask';
import {isIos} from '../helpers/DeviceUtils';

const enum PushState {
  PushEnabled = 'PushEnabled',
  PushDisabled = 'PushDisabled',
}

const enum PopUpPresentationState {
  PopUpPresentationEnabled = 'PopUpPresentationEnabled',
  PopUpPresentationDisabled = 'PopUpPresentationDisabled',
}

const Dashboard = ({navigation}: any) => {
  const [pushState, setPushState] = useState<PushState>(PushState.PushEnabled);
  const [pushTokenString, setPushTokenString] = useState<string>('');
  const [popUpPresentationState, setPopUpPresentationState] =
    useState<PopUpPresentationState>(
      PopUpPresentationState.PopUpPresentationEnabled,
    );

  useLayoutEffect(() => {
    Netmera.isPushEnabled().then(enabled => {
      setPushState(enabled ? PushState.PushEnabled : PushState.PushDisabled);
    });
  }, []);

  useEffect(() => {
    if (isIos()) {
      Netmera.requestPushNotificationAuthorization();
    }
    setTimeout(() => {
      setPushTokenString(pushToken);
    }, 1000);
  }, []);

  const currentExternalId = async () =>
    Toast.show({
      type: 'info',
      text1: 'Current External Id: ' + (await Netmera.currentExternalId()),
      position: 'bottom',
    });

  const disableData = () => {
    Netmera.stopDataTransfer();
  };

  const disableOrEnablePopUpPresentation = () => {
    if (
      popUpPresentationState === PopUpPresentationState.PopUpPresentationEnabled
    ) {
      Netmera.disablePopupPresentation();
      setPopUpPresentationState(
        PopUpPresentationState.PopUpPresentationDisabled,
      );
    } else {
      Netmera.enablePopupPresentation();
      setPopUpPresentationState(
        PopUpPresentationState.PopUpPresentationEnabled,
      );
    }
  };

  const changePushState = () => {
    if (pushState === PushState.PushEnabled) {
      setPushState(PushState.PushDisabled);
      Netmera.disablePush();
    } else {
      setPushState(PushState.PushEnabled);
      Netmera.enablePush();
    }
  };

  const enableData = () => {
    Netmera.startDataTransfer();
  };

  const enableLocationAndGeofence = () => {
    Netmera.requestPermissionsForLocation();
  };

  const isPushEnabled = async () =>
    Toast.show({
      type: 'info',
      text1: 'Is Push Enabled: ' + (await Netmera.isPushEnabled()),
      position: 'bottom',
    });

  const setNetmeraMaxActiveRegion = () => {
    Netmera.setNetmeraMaxActiveRegions(10);
  };

  const navigateToCategory = () => {
    navigation.navigate('Category');
  };

  const navigateToCoupons = () => {
    navigation.navigate('Coupons');
  };

  const navigateToEvents = () => {
    navigation.navigate('Events');
  };

  const navigateToPushInbox = () => {
    navigation.navigate('PushInbox');
  };

  const navigateToUser = () => {
    navigation.navigate('User');
  };

  const requestPushNotificationAuthorization = () => {
    Netmera.requestPushNotificationAuthorization();
  };

  const toastPushTest = () =>
    Toast.show({
      type: 'info',
      text1: `Pushtoken :: \`${pushTokenString}\``,
      position: 'bottom',
    });

  const turnOffSendingEventAndUserUpdate = () => {
    Netmera.turnOffSendingEventAndUserUpdate(false);
  };

  const kill = () => {
    Netmera.kill();
  };

  const buttons = [
    {
      name: 'ENABLE LOCATION & GEOFENCE',
      method: enableLocationAndGeofence,
    },
    {
      name: 'REQUEST PUSH NOTIFICATION AUTHORIZATION',
      method: requestPushNotificationAuthorization,
    },
    {
      name: 'COUPONS',
      method: navigateToCoupons,
    },
    {
      name: 'CURRENT EXTERNAL ID',
      method: currentExternalId,
    },
    {
      name: 'EVENTS',
      method: navigateToEvents,
    },
    {
      name: 'USER',
      method: navigateToUser,
    },
    {
      name: 'PUSH INBOX',
      method: navigateToPushInbox,
    },
    {
      name: 'CATEGORY',
      method: navigateToCategory,
    },
    {
      name: 'IS PUSH ENABLED',
      method: isPushEnabled,
    },
    {
      name:
        pushState === PushState.PushEnabled ? 'DISABLE PUSH' : 'ENABLE PUSH',
      method: changePushState,
    },
    {
      name:
        popUpPresentationState ===
        PopUpPresentationState.PopUpPresentationDisabled
          ? 'ENABLE PRESENTATION STATE'
          : 'DISABLE PRESENTATION STATE',
      method: disableOrEnablePopUpPresentation,
    },
    {
      name: 'SET NETMERA MAX ACTIVE REGION',
      method: setNetmeraMaxActiveRegion,
    },
    {
      name: 'TOAST PUSH TOKEN',
      method: toastPushTest,
    },
    {
      name: 'TURN OFF SENDING EVENT AND USER UPDATE',
      method: turnOffSendingEventAndUserUpdate,
    },
    {
      name: 'KILL NETMERA',
      method: kill,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={enableData}>
            <Text style={styles.text}>ENABLE DATA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={disableData}>
            <Text style={styles.text}>DISABLE DATA</Text>
          </TouchableOpacity>
        </View>
        {buttons.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.button}
              onPress={item.method}
              key={index}
              activeOpacity={0.6}>
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.deviceTokenContainer}>
          <Text style={[styles.text, {color: Colors.black}]}>DEVICE TOKEN</Text>
        </View>
        <Text style={[styles.tokenText]}>{pushTokenString}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },

  container: {
    flex: 1,
  },

  deviceTokenContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 5,
  },

  text: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },

  tokenText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.black,
    marginHorizontal: 15,
  },
});
export default Dashboard;
