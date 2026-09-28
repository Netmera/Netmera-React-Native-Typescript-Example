/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';

const enum PopUpPresentationState {
  PopUpPresentationEnabled = 'PopUpPresentationEnabled',
  PopUpPresentationDisabled = 'PopUpPresentationDisabled',
}

const InAppMessages = () => {
  const [popUpPresentationState, setPopUpPresentationState] =
    useState<PopUpPresentationState>(
      PopUpPresentationState.PopUpPresentationEnabled,
    );
  const [widgetUrl, setWidgetUrl] = useState<string>('');

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

  const displayWidgetFullscreen = () => {
    Netmera.displayWidgetContent(
      widgetUrl.trim() ||
        'https://ntm.netmera-web.com/container/androidsdk-widget-2_5.html',
    );
  };

  const displayWidgetPopup = () => {
    Netmera.displayWidgetContent(
      widgetUrl.trim() ||
        'https://ntm.netmera-web.com/container/androidsdk-widget-3_1.html',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={disableOrEnablePopUpPresentation}>
            <Text style={styles.text}>
              {popUpPresentationState ===
              PopUpPresentationState.PopUpPresentationDisabled
                ? 'ENABLE POPUP PRES.'
                : 'DISABLE POPUP PRES.'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Widget URL"
          placeholderTextColor={Colors.dark}
          value={widgetUrl}
          onChangeText={setWidgetUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={displayWidgetFullscreen}>
            <Text style={styles.text}>DISPLAY WIDGET FULLSCREEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            activeOpacity={0.6}
            onPress={displayWidgetPopup}>
            <Text style={styles.text}>DISPLAY WIDGET POPUP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    marginBottom: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 13,
    color: Colors.black,
    backgroundColor: Colors.lighter,
  },
});

export default InAppMessages;
