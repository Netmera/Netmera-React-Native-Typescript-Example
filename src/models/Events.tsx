/*
 * Copyright (c) 2022 Inomera Research.
 */

import { NetmeraEvent, NetmeraEventPurchase } from 'react-native-netmera';

class CustomPurchaseEvent extends NetmeraEventPurchase {
  code = 'cjpnl';

  private ea: string | undefined;

  // Custom Attributes
  setInstallment(value: string) {
    this.ea = value;
  }
}

// Custom Event
class TestEvent extends NetmeraEvent {
  code = 'qlhov';

  private ea: string | undefined;

  setTestAttribute(value: string) {
    this.ea = value;
  }
}

export { CustomPurchaseEvent, TestEvent };
