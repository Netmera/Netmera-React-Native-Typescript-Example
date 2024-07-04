import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from '../Colors';
import {
  CustomPurchaseEvent,
  LoginEvent,
  NetmeraLineItem,
  RegisterEvent,
  TestEvent,
  ViewCartEvent,
} from '../models/Events';
import {Netmera} from 'react-native-netmera';

const Events = () => {
  const [revenue, setRevenue] = useState<string>('');

  const sendLoginEvent = () => {
    const loginEvent = new LoginEvent();
    loginEvent.userId = 'TestUserId';
    loginEvent.userIda = 21893718239812738;
    loginEvent.userIdax = '21893718239812738';
    if (revenue) {
      loginEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(loginEvent);
  };

  const sendRegisterEvent = () => {
    const registerEvent = new RegisterEvent();
    if (revenue) {
      registerEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(registerEvent);
  };

  const sendViewCartEvent = () => {
    const viewCartEvent = new ViewCartEvent();
    viewCartEvent.subTotal = 96.7;
    viewCartEvent.itemCount = 9;
    if (revenue) {
      viewCartEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(viewCartEvent);
  };

  const sendPurchaseEvent = () => {
    const netmeraLineItem = new NetmeraLineItem();
    netmeraLineItem.brandId = 'TestBrandID';
    netmeraLineItem.brandName = 'TestBrandName';
    netmeraLineItem.campaignId = 'TestCampaignID';
    netmeraLineItem.categoryIds = ['TestCategoryID1', 'TestCategoryID2'];
    netmeraLineItem.categoryNames = [
      'TestCategoryName1',
      'TestCategoryName2',
      'TestCategoryName3',
    ];
    netmeraLineItem.keywords = ['keyword1', 'keyword2', 'keyword3'];
    netmeraLineItem.count = 2;
    netmeraLineItem.id = 'TestItemID';
    netmeraLineItem.price = 130;

    // CustomPurchaseEvent extends PurchaseEvent
    const purchaseEvent = new CustomPurchaseEvent();
    // Set default attributes
    purchaseEvent.coupon = 'TEST_COUPON';
    purchaseEvent.discount = 10;
    purchaseEvent.grandTotal = 250.89;
    purchaseEvent.itemCount = 2;
    purchaseEvent.paymentMethod = 'Credit';
    purchaseEvent.subTotal = 260.89;
    purchaseEvent.shippingCost = 0.0;
    purchaseEvent.purchaseLineItemEvent = [netmeraLineItem, netmeraLineItem];

    // Set custom attributes
    purchaseEvent.installment = '5';
    if (revenue) {
      purchaseEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(purchaseEvent);
  };

  const sendCustomEvent = () => {
    // Custom event
    const testEvent = new TestEvent();
    testEvent.testAttribute = 'TestAttribute';
    if (revenue) {
      testEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(testEvent);
  };

  const buttons = [
    {
      name: 'LOGIN EVENT',
      method: sendLoginEvent,
    },
    {
      name: 'REGISTER EVENT',
      method: sendRegisterEvent,
    },
    {
      name: 'VIEW CART EVENT',
      method: sendViewCartEvent,
    },
    {
      name: 'PURCHASE EVENT',
      method: sendPurchaseEvent,
    },
    {
      name: 'CUSTOM TEST EVENT',
      method: sendCustomEvent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder={'Revenue'}
        placeholderTextColor={Colors.dark}
        style={styles.revenueInput}
        value={revenue}
        autoCapitalize={'none'}
        keyboardType="numeric"
        onChangeText={value => setRevenue(value)}
      />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    marginHorizontal: 35,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
  },

  revenueInput: {
    alignSelf: 'center',
    color: Colors.black,
    borderColor: Colors.dark,
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    height: 40,
    marginBottom: 5,
  },

  text: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },
});

export default Events;
