/*
 * Copyright (c) 2026 Netmera Research.
 */

import {
  NetmeraEvent,
  NetmeraEventBannerOpen,
  NetmeraEventBatteryLevel,
  NetmeraEventCartAddProduct,
  NetmeraEventCartRemoveProduct,
  NetmeraEventCartView,
  NetmeraEventCategoryView,
  NetmeraEventContentComment,
  NetmeraEventContentRate,
  NetmeraEventContentView,
  NetmeraEventInAppPurchase,
  NetmeraEventLogin,
  NetmeraEventOrderCancel,
  NetmeraEventProductComment,
  NetmeraEventProductRate,
  NetmeraEventProductView,
  NetmeraEventRegister,
  NetmeraEventScreenView,
  NetmeraEventSearch,
  NetmeraEventShare,
  NetmeraEventWishList,
  NetmeraLineItem,
} from 'react-native-netmera';
import {CustomPurchaseEvent, TestEvent} from '../models/Events';

export interface EventEntry {
  id: string;
  title: string;
  create: () => NetmeraEvent;
}

const createLineItem = () => {
  const lineItem = new NetmeraLineItem();
  lineItem.setBrandId('TestBrandID');
  lineItem.setBrandName('TestBrandName');
  lineItem.setCampaignId('TestCampaignID');
  lineItem.setCategoryIds(['TestCategoryID1', 'TestCategoryID2']);
  lineItem.setCategoryNames(['TestCategoryName1', 'TestCategoryName2', 'TestCategoryName3']);
  lineItem.setKeywords(['keyword1', 'keyword2', 'keyword3']);
  lineItem.setCount(2);
  lineItem.setId('TestItemID');
  lineItem.setPrice(130);
  return lineItem;
};

const setContentFields = (
  event: NetmeraEventContentComment | NetmeraEventContentRate | NetmeraEventContentView,
) => {
  event.setId('ContentId1');
  event.setName('ContentName1');
  event.setKeywords(['Keyword1', 'Keyword2']);
  event.setCategoryIds(['Category1', 'Category2']);
  event.setCategoryNames(['CategoryName1', 'CategoryName2']);
  event.setType(2);
  event.setProvider('Youtube');
};

export const commerceEvents: EventEntry[] = [
  {
    id: 'cartAddProduct',
    title: 'CartAddProductEvent',
    create: () => {
      const event = new NetmeraEventCartAddProduct();
      event.setCount(2);
      event.setBasketTotal(249.99);
      return event;
    },
  },
  {
    id: 'cartRemoveProduct',
    title: 'CartRemoveProductEvent',
    create: () => {
      const event = new NetmeraEventCartRemoveProduct();
      event.setCount(1);
      return event;
    },
  },
  {
    id: 'cartView',
    title: 'CartViewEvent',
    create: () => {
      const event = new NetmeraEventCartView();
      event.setSubTotal(96.7);
      event.setItemCount(9);
      return event;
    },
  },
  {
    id: 'orderCancel',
    title: 'OrderCancelEvent',
    create: () => {
      const event = new NetmeraEventOrderCancel();
      event.setGrandTotal(249.99);
      event.setItemCount(2);
      event.setSubTotal(200);
      event.setPaymentMethod('CreditCard');
      return event;
    },
  },
  {
    id: 'productComment',
    title: 'ProductCommentEvent',
    create: () => new NetmeraEventProductComment(),
  },
  {
    id: 'productRate',
    title: 'ProductRateEvent',
    create: () => {
      const event = new NetmeraEventProductRate();
      event.setRating(4);
      return event;
    },
  },
  {
    id: 'productView',
    title: 'ProductViewEvent',
    create: () => new NetmeraEventProductView(),
  },
  {
    id: 'purchase',
    title: 'PurchaseEvent',
    create: () => {
      // CustomPurchaseEvent extends NetmeraEventPurchase with a custom attribute.
      const event = new CustomPurchaseEvent();
      event.setCoupon('TEST_COUPON');
      event.setDiscount(10);
      event.setGrandTotal(250.89);
      event.setItemCount(2);
      event.setPaymentMethod('Credit');
      event.setSubTotal(260.89);
      event.setShippingCost(0.0);
      event.setLineItems([createLineItem(), createLineItem()]);
      event.setInstallment('5');
      return event;
    },
  },
  {
    id: 'wishList',
    title: 'WishListEvent',
    create: () => new NetmeraEventWishList(),
  },
];

export const mediaEvents: EventEntry[] = [
  {
    id: 'contentComment',
    title: 'ContentCommentEvent',
    create: () => {
      const event = new NetmeraEventContentComment();
      setContentFields(event);
      return event;
    },
  },
  {
    id: 'contentRate',
    title: 'ContentRateEvent',
    create: () => {
      const event = new NetmeraEventContentRate();
      setContentFields(event);
      event.setRating(5);
      return event;
    },
  },
  {
    id: 'contentView',
    title: 'ContentViewEvent',
    create: () => {
      const event = new NetmeraEventContentView();
      setContentFields(event);
      return event;
    },
  },
];

export const generalEvents: EventEntry[] = [
  {
    id: 'bannerOpen',
    title: 'BannerOpenEvent',
    create: () => {
      const event = new NetmeraEventBannerOpen();
      event.setId('TestId');
      event.setKeywords(['TestKeyword1', 'TestKeyword2']);
      return event;
    },
  },
  {
    id: 'categoryView',
    title: 'CategoryViewEvent',
    create: () => {
      const event = new NetmeraEventCategoryView();
      event.setId('TestCategoryID');
      event.setName('TestCategoryName');
      return event;
    },
  },
  {
    id: 'inAppPurchase',
    title: 'InAppPurchaseEvent',
    create: () => {
      const event = new NetmeraEventInAppPurchase();
      event.setId('TestInAppPurchase');
      event.setName('TestInAppPurchase');
      event.setCount(2);
      event.setPrice(25);
      event.setKeywords(['inAppPurchase1', 'inAppPurchase2']);
      event.setCategoryIds(['TestCategoryID1', 'TestCategoryID2']);
      event.setCategoryNames(['TestCategoryName1', 'TestCategoryName2']);
      return event;
    },
  },
  {
    id: 'login',
    title: 'LoginEvent',
    create: () => {
      const event = new NetmeraEventLogin();
      event.setUserId('TestUserId');
      return event;
    },
  },
  {
    id: 'register',
    title: 'RegisterEvent',
    create: () => {
      const event = new NetmeraEventRegister();
      event.setUserId('TestUserId');
      return event;
    },
  },
  {
    id: 'search',
    title: 'SearchEvent',
    create: () => {
      const event = new NetmeraEventSearch();
      event.setQuery('TestSearch');
      event.setResultCount(3);
      return event;
    },
  },
  {
    id: 'share',
    title: 'ShareEvent',
    create: () => {
      const event = new NetmeraEventShare();
      event.setChannel('Whatsapp');
      event.setContent('TestContent');
      return event;
    },
  },
  {
    id: 'batteryLevel',
    title: 'BatteryLevelEvent',
    create: () => {
      const event = new NetmeraEventBatteryLevel();
      event.setBatteryLevel(87.3);
      return event;
    },
  },
  {
    id: 'screenView',
    title: 'ScreenViewEvent',
    create: () => {
      const event = new NetmeraEventScreenView();
      event.setPageId('PageId1');
      event.setPageName('Screen1');
      event.setTimeInPage(20);
      event.setReferrerPageName('Screen2');
      event.setReferrerPageId('PageId2');
      return event;
    },
  },
  {
    id: 'custom',
    title: 'TestEvent',
    create: () => {
      const event = new TestEvent();
      event.setTestAttribute('TestAttribute');
      return event;
    },
  },
];
