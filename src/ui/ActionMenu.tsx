/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {Fragment} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppColors from './AppColors';

export interface ActionMenuItem {
  id: string;
  title: string;
  checked?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  onPress: () => void;
}

interface Props {
  visible: boolean;
  sections: ActionMenuItem[][];
  testID?: string;
  onClose: () => void;
}

const ActionMenu = ({visible, sections, testID, onClose}: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.backdrop} onPress={onClose}>
      {/* Claims touches so that a tap on a disabled item does not reach the backdrop. */}
      <View style={styles.sheet} onStartShouldSetResponder={() => true}>
        <ScrollView bounces={false}>
          {sections.map((items, index) => (
            <Fragment key={items.map(item => item.id).join()}>
              {index > 0 ? <View style={styles.sectionGap} /> : null}
              {items.map(item => (
                <Pressable
                  key={item.id}
                  testID={testID ? `${testID}.${item.id}` : undefined}
                  accessibilityRole="menuitem"
                  accessibilityState={{disabled: item.disabled, checked: item.checked}}
                  disabled={item.disabled}
                  onPress={() => {
                    onClose();
                    item.onPress();
                  }}
                  style={({pressed}) => [styles.item, pressed && styles.pressed]}
                >
                  <Text
                    style={[
                      styles.title,
                      item.destructive && styles.destructive,
                      item.disabled && styles.disabled,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.checked ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              ))}
            </Fragment>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    maxHeight: '85%',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: AppColors.groupedBackground,
  },
  sectionGap: {
    height: 8,
  },
  item: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: AppColors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.divider,
  },
  pressed: {
    backgroundColor: AppColors.divider,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: AppColors.label,
  },
  destructive: {
    color: AppColors.destructive,
  },
  disabled: {
    color: AppColors.mutedText,
  },
  check: {
    fontSize: 17,
    color: AppColors.primary,
  },
});

export default ActionMenu;
