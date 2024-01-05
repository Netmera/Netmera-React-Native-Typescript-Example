/*
 * Copyright (c) 2022 Inomera Research.
 */

// Netmera Push Events

import { Linking } from "react-native";

export class Token {
  static token;
}

export const onPushRegister = async message => {
  Token.token = message;
  console.log(Token.token);
  console.log('onPushRegister: ', message);
};

export const onPushReceive = async message => {
  console.log('onPushReceive: ', message);
};

export const onPushOpen = async message => {
  console.log('onPushOpen: ', message);
};

export const onPushDismiss = async message => {
  console.log('onPushDismiss: ', message);
};

export const onPushButtonClicked = async message => {
  console.log('onPushButtonClicked: ', message);
};

export const onCarouselObjectSelected = async message => {
  console.log('onCarouselObjectSelected: ', message);
};
