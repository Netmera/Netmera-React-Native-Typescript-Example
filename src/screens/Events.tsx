import React, {useState} from 'react';
import {
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from '../Colors';
import { CustomPurchaseEvent, TestEvent } from '../models/Events';
import {
  Netmera,
  NetmeraEventLogin,
  NetmeraEventRegister,
  NetmeraEventCartView,
  NetmeraLineItem,
  NetmeraEventBannerOpen,
  NetmeraEventBatteryLevel,
  NetmeraEventCategoryView,
  NetmeraEventInAppPurchase,
  NetmeraEventScreenView,
  NetmeraEventSearch,
  NetmeraEventShare,
  NetmeraEventCartAddProduct,
  NetmeraEventCartRemoveProduct,
  NetmeraEventOrderCancel,
  NetmeraEventProductComment,
  NetmeraEventProductRate,
  NetmeraEventProductView,
  NetmeraEventWishList,
  NetmeraEventContentComment,
  NetmeraEventContentRate,
  NetmeraEventContentView,
} from 'react-native-netmera';

const Events = () => {
  const [revenue, setRevenue] = useState<string>('');

  const sendLoginEvent = () => {
    const loginEvent = new NetmeraEventLogin();
    loginEvent.setUserId('TestUserId');
    if (revenue) {
      loginEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(loginEvent);
  };

  const sendRegisterEvent = () => {
    const registerEvent = new NetmeraEventRegister();
    registerEvent.setUserId('TestUserId');
    if (revenue) {
      registerEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(registerEvent);
  };

  const sendViewCartEvent = () => {
    const viewCartEvent = new NetmeraEventCartView();
    viewCartEvent.setSubTotal(96.7);
    viewCartEvent.setItemCount(9);
    if (revenue) {
      viewCartEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(viewCartEvent);
  };

  const sendPurchaseEvent = () => {
    const netmeraLineItem = new NetmeraLineItem();
    netmeraLineItem.setBrandId('TestBrandID');
    netmeraLineItem.setBrandName('TestBrandName');
    netmeraLineItem.setCampaignId('TestCampaignID');
    netmeraLineItem.setCategoryIds(['TestCategoryID1', 'TestCategoryID2']);
    netmeraLineItem.setCategoryNames([
      'TestCategoryName1',
      'TestCategoryName2',
      'TestCategoryName3',
    ]);
    netmeraLineItem.setKeywords(['keyword1', 'keyword2', 'keyword3']);
    netmeraLineItem.setCount(2);
    netmeraLineItem.setId('TestItemID');
    netmeraLineItem.setPrice(130);

    // CustomPurchaseEvent extends PurchaseEvent
    const purchaseEvent = new CustomPurchaseEvent();
    // Set default attributes
    purchaseEvent.setCoupon('TEST_COUPON');
    purchaseEvent.setDiscount(10);
    purchaseEvent.setGrandTotal(250.89);
    purchaseEvent.setItemCount(2);
    purchaseEvent.setPaymentMethod('Credit');
    purchaseEvent.setSubTotal(260.89);
    purchaseEvent.setShippingCost(0.0);
    purchaseEvent.setLineItems([netmeraLineItem, netmeraLineItem]);

    // Set custom attributes
    purchaseEvent.setInstallment('5');
    if (revenue) {
      purchaseEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(purchaseEvent);
  };

  const sendCustomEvent = () => {
    // Custom event
    const testEvent = new TestEvent();
    testEvent.setTestAttribute('TestAttribute');
    if (revenue) {
      testEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(testEvent);
  };

  const sendBannerOpenEvent = () => {
    const bannerOpenEvent = new NetmeraEventBannerOpen();
    bannerOpenEvent.setId('TestId');
    bannerOpenEvent.setKeywords(['TestKeyword1', 'TestKeyword2']);
    if (revenue) {
      bannerOpenEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(bannerOpenEvent);
  };

  const sendBatteryLevelEvent = () => {
    const batteryLevelEvent = new NetmeraEventBatteryLevel();
    batteryLevelEvent.setBatteryLevel(Number(87.3));
    if (revenue) {
      batteryLevelEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(batteryLevelEvent);
  };

  const sendCategoryViewEvent = () => {
    const categoryViewEvent = new NetmeraEventCategoryView();
    categoryViewEvent.setId('TestCategoryID');
    categoryViewEvent.setName('TestCategoryName');
    if (revenue) {
      categoryViewEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(categoryViewEvent);
  };

  const sendInAppPurchaseEvent = () => {
    const inAppPurchaseEvent = new NetmeraEventInAppPurchase();
    inAppPurchaseEvent.setId('TestInAppPurchase');
    inAppPurchaseEvent.setName('TestInAppPurchase');
    inAppPurchaseEvent.setCount(2);
    inAppPurchaseEvent.setPrice(25);
    inAppPurchaseEvent.setKeywords(['inAppPurchase1', 'inAppPurchase2']);
    inAppPurchaseEvent.setCategoryIds(['TestCategoryID1', 'TestCategoryID2']);
    inAppPurchaseEvent.setCategoryNames(['TestCategoryName1', 'TestCategoryName2']);
    if (revenue) {
      inAppPurchaseEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(inAppPurchaseEvent);
  };

  const sendScreenViewEvent = () => {
    const screenViewEvent = new NetmeraEventScreenView();
    screenViewEvent.setPageId('PageId1');
    screenViewEvent.setPageName('Screen1');
    screenViewEvent.setTimeInPage(20);
    screenViewEvent.setReferrerPageName('Screen2');
    screenViewEvent.setReferrerPageId('PageId2');
    if (revenue) {
      screenViewEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(screenViewEvent);
  };

  const sendSearchEvent = () => {
    const searchEvent = new NetmeraEventSearch();
    searchEvent.setQuery('TestSearch');
    searchEvent.setResultCount(3);
    if (revenue) {
      searchEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(searchEvent);
  };

  const sendShareEvent = () => {
    const shareEvent = new NetmeraEventShare();
    shareEvent.setChannel('Whatsapp');
    shareEvent.setContent('TestContent');
    if (revenue) {
      shareEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(shareEvent);
  };

  const sendCartAddProductEvent = () => {
    const cartAddProductEvent = new NetmeraEventCartAddProduct();
    cartAddProductEvent.setCount(2);
    cartAddProductEvent.setBasketTotal(249.99);
    if (revenue) {
      cartAddProductEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(cartAddProductEvent);
  };

  const sendCartRemoveProductEvent = () => {
    const cartRemoveProductEvent = new NetmeraEventCartRemoveProduct();
    cartRemoveProductEvent.setCount(1);
    if (revenue) {
      cartRemoveProductEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(cartRemoveProductEvent);
  };

  const sendOrderCancelEvent = () => {
    const orderCancelEvent = new NetmeraEventOrderCancel();
    orderCancelEvent.setGrandTotal(249.99);
    orderCancelEvent.setItemCount(2);
    orderCancelEvent.setSubTotal(200);
    orderCancelEvent.setPaymentMethod('CreditCard');
    if (revenue) {
      orderCancelEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(orderCancelEvent);
  };

  const sendProductCommentEvent = () => {
    const productCommentEvent = new NetmeraEventProductComment();
    if (revenue) {
      productCommentEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(productCommentEvent);
  };

  const sendProductRateEvent = () => {
    const productRateEvent = new NetmeraEventProductRate();
    productRateEvent.setRating(4);
    if (revenue) {
      productRateEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(productRateEvent);
  };

  const sendProductViewEvent = () => {
    const productViewEvent = new NetmeraEventProductView();
    if (revenue) {
      productViewEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(productViewEvent);
  };

  const sendWishListEvent = () => {
    const wishListEvent = new NetmeraEventWishList();
    if (revenue) {
      wishListEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(wishListEvent);
  };

  const sendContentCommentEvent = () => {
    const contentCommentEvent = new NetmeraEventContentComment();
    contentCommentEvent.setId('ContentId1');
    contentCommentEvent.setName('ContentName1');
    contentCommentEvent.setKeywords(['Keyword1', 'Keyword2']);
    contentCommentEvent.setCategoryIds(['Category1', 'Category2']);
    contentCommentEvent.setCategoryNames(['CategoryName1', 'CategoryName2']);
    contentCommentEvent.setType(2);
    contentCommentEvent.setProvider('Youtube');
    if (revenue) {
      contentCommentEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(contentCommentEvent);
  };

  const sendContentRateEvent = () => {
    const contentRateEvent = new NetmeraEventContentRate();
    contentRateEvent.setId('ContentId1');
    contentRateEvent.setName('ContentName1');
    contentRateEvent.setKeywords(['Keyword1', 'Keyword2']);
    contentRateEvent.setCategoryIds(['Category1', 'Category2']);
    contentRateEvent.setCategoryNames(['CategoryName1', 'CategoryName2']);
    contentRateEvent.setType(2);
    contentRateEvent.setProvider('Youtube');
    contentRateEvent.setRating(5);
    if (revenue) {
      contentRateEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(contentRateEvent);
  };

  const sendContentViewEvent = () => {
    const contentViewEvent = new NetmeraEventContentView();
    contentViewEvent.setId('ContentId1');
    contentViewEvent.setName('ContentName1');
    contentViewEvent.setKeywords(['Keyword1', 'Keyword2']);
    contentViewEvent.setCategoryIds(['Category1', 'Category2']);
    contentViewEvent.setCategoryNames(['CategoryName1', 'CategoryName2']);
    contentViewEvent.setType(2);
    contentViewEvent.setProvider('Youtube');
    if (revenue) {
      contentViewEvent.revenue = Number(revenue);
    }
    Netmera.sendEvent(contentViewEvent);
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
    {
      name: 'BANNER OPEN EVENT',
      method: sendBannerOpenEvent,
    },
    {
      name: 'BATTERY LEVEL EVENT',
      method: sendBatteryLevelEvent,
    },
    {
      name: 'CATEGORY VIEW EVENT',
      method: sendCategoryViewEvent,
    },
    {
      name: 'IN APP PURCHASE EVENT',
      method: sendInAppPurchaseEvent,
    },
    {
      name: 'SCREEN VIEW EVENT',
      method: sendScreenViewEvent,
    },
    {
      name: 'SEARCH EVENT',
      method: sendSearchEvent,
    },
    {
      name: 'SHARE EVENT',
      method: sendShareEvent,
    },
    {
      name: 'CART ADD PRODUCT EVENT',
      method: sendCartAddProductEvent,
    },
    {
      name: 'CART REMOVE PRODUCT EVENT',
      method: sendCartRemoveProductEvent,
    },
    {
      name: 'ORDER CANCEL EVENT',
      method: sendOrderCancelEvent,
    },
    {
      name: 'PRODUCT COMMENT EVENT',
      method: sendProductCommentEvent,
    },
    {
      name: 'PRODUCT RATE EVENT',
      method: sendProductRateEvent,
    },
    {
      name: 'PRODUCT VIEW EVENT',
      method: sendProductViewEvent,
    },
    {
      name: 'WISH LIST EVENT',
      method: sendWishListEvent,
    },
    {
      name: 'CONTENT COMMENT EVENT',
      method: sendContentCommentEvent,
    },
    {
      name: 'CONTENT RATE EVENT',
      method: sendContentRateEvent,
    },
    {
      name: 'CONTENT VIEW EVENT',
      method: sendContentViewEvent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginVertical: 20}}>
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
      </ScrollView>
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
