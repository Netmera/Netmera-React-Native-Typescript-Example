/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Netmera} from 'react-native-netmera';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import SwitchRow from '../ui/SwitchRow';
import TextField from '../ui/TextField';
import AppColors from '../ui/AppColors';

const FULLSCREEN_WIDGET_URL = 'https://ntm.netmera-web.com/container/androidsdk-widget-2_5.html';
const POPUP_WIDGET_URL = 'https://ntm.netmera-web.com/container/androidsdk-widget-3_1.html';

const InAppMessages = () => {
  // index.js enables popup presentation at launch.
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [widgetUrl, setWidgetUrl] = useState('');

  const changePopupPresentation = (enabled: boolean) => {
    if (enabled) {
      Netmera.enablePopupPresentation();
    } else {
      Netmera.disablePopupPresentation();
    }
    setPopupEnabled(enabled);
  };

  const displayWidget = (defaultUrl: string) => {
    Netmera.displayWidgetContent(widgetUrl.trim() || defaultUrl);
  };

  return (
    <ScrollView
      testID="inAppMessages"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.container}>
      <SwitchRow
        testID="inAppMessages.popupPresentation"
        title="Popup Presentation"
        value={popupEnabled}
        showDivider={false}
        onValueChange={changePopupPresentation}
      />
      <SectionHeader title="Widget" />
      <View style={styles.group}>
        <TextField
          testID="inAppMessages.widgetUrl"
          placeholder="Widget URL"
          keyboardType="url"
          value={widgetUrl}
          onChangeText={setWidgetUrl}
        />
        <Button
          testID="inAppMessages.displayWidgetFullscreen"
          title="Display Widget Fullscreen"
          onPress={() => displayWidget(FULLSCREEN_WIDGET_URL)}
        />
        <Button
          testID="inAppMessages.displayWidgetPopup"
          title="Display Widget Popup"
          onPress={() => displayWidget(POPUP_WIDGET_URL)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.groupedBackground,
  },
  group: {
    gap: 12,
    padding: 16,
    backgroundColor: AppColors.surface,
  },
});

export default InAppMessages;
