/*
 * Copyright (c) 2026 Netmera Research.
 */

import {Netmera, NetmeraEvent} from 'react-native-netmera';

let useGenericMethod = false;

export const isGenericMethodEnabled = () => useGenericMethod;

export const setGenericMethodEnabled = (enabled: boolean) => {
  useGenericMethod = enabled;
};

export const sendEvent = (event: NetmeraEvent) => {
  if (useGenericMethod) {
    const {code, ...attributes} = event as any;
    const cleanedAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([, value]) => value !== undefined),
    );
    Netmera.sendGenericEvent(code, cleanedAttributes);
  } else {
    Netmera.sendEvent(event);
  }
};
