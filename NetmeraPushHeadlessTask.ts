/*
 * Copyright (c) 2026 Netmera Research.
 */

// Netmera Push Events
import {
  NetmeraPushObject,
  NetmeraInteractiveAction,
  NetmeraCarouselObject
} from "react-native-netmera";
import { DeviceEventEmitter } from "react-native";

export const PUSH_EVENT = 'NetmeraPushEvent';

export let pushToken: string | undefined;

export const onPushRegister = async (data: { pushToken: string }) => {
  pushToken = data.pushToken;
  console.log('onPushRegister: ', data);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onPushRegister', data });
};

export const onPushReceive = async (push: NetmeraPushObject) => {
  console.log('onPushReceive: ', push);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onPushReceive', data: push });
};

export const onPushOpen = async (push: NetmeraPushObject) => {
  console.log('onPushOpen: ', push);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onPushOpen', data: push });
};

export const onPushDismiss = async (push: NetmeraPushObject) => {
  console.log('onPushDismiss: ', push);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onPushDismiss', data: push });
};

export const onPushButtonClicked = async (
  push: NetmeraPushObject,
  action?: NetmeraInteractiveAction
) => {
  console.log('onPushButtonClicked: ', push);
  console.log('Clicked action: ', action);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onPushButtonClicked', data: { push, action } });
};

export const onCarouselObjectSelected = async (
  push: NetmeraPushObject,
  carouselItem?: NetmeraCarouselObject
) => {
  console.log('onCarouselObjectSelected: ', push);
  console.log('Selected carousel item: ', carouselItem);
  DeviceEventEmitter.emit(PUSH_EVENT, { event: 'onCarouselObjectSelected', data: { push, carouselItem } });
};
