/*
 * Copyright (c) 2022 Inomera Research.
 */

import {NetmeraEvent} from "react-native-netmera";

class LoginEvent extends NetmeraEvent {
  code = 'n:cl';

  private uid: string | undefined;
  private uida: number | undefined;
  private uidas: string | undefined;

  set userId(userId: string) {
    this.uid = userId;
  }

  set userIda(userId: number) {
    this.uida = userId;
  }

  set userIdax(userId: string) {
    this.uidas = userId;
  }
}

class RegisterEvent {
  code = 'n:rg';
}

class ViewCartEvent {
  code = 'n:vt';

  private er: any;
  private ec: any;

  set subTotal(value: number) {
    this.er = value;
  }

  set itemCount(value: number) {
    this.ec = value;
  }
}

class PurchaseEvent {
  code = 'n:ph';

  private ek: string | undefined;
  private fl: any;
  private el: number | undefined;
  private em: string | undefined;
  private fo: any;
  private fp: any;
  private ep: number | undefined;
  private er: number | undefined;
  private ec: number | undefined;
  private es: number | undefined;
  private items: NetmeraLineItem[] | undefined;

  set coupon(value: string) {
    this.ek = value;
  }

  set utmSource(value: any) {
    this.fl = value;
  }

  set discount(value: number) {
    this.el = value;
  }

  set paymentMethod(value: string) {
    this.em = value;
  }

  set utmMedium(value: any) {
    this.fo = value;
  }

  set utmCampaign(value: any) {
    this.fp = value;
  }

  set shippingCost(value: number) {
    this.ep = value;
  }

  set subTotal(value: number) {
    this.er = value;
  }

  set itemCount(value: number) {
    this.ec = value;
  }

  set grandTotal(value: number) {
    this.es = value;
  }

  set purchaseLineItemEvent(values: NetmeraLineItem[]) {
    this.items = values;
  }
}

class NetmeraLineItem {
  private ea: string | undefined;
  private eb: any;
  private eq: number | undefined;
  private eh: string | undefined;
  private gd: string | undefined;
  private ei: any;
  private ge: string | undefined;
  private ec: number | undefined;
  private ga: string[] | undefined;
  private ef: string[] | undefined;
  private eg: string[] | undefined;

  set id(id: string) {
    this.ea = id;
  }

  set name(name: any) {
    this.eb = name;
  }

  set price(price: number) {
    this.eq = price;
  }

  set brandName(brandName: string) {
    this.eh = brandName;
  }

  set brandId(brandId: string) {
    this.gd = brandId;
  }

  set variant(variant: any) {
    this.ei = variant;
  }

  set campaignId(campaignId: string) {
    this.ge = campaignId;
  }

  set count(count: number) {
    this.ec = count;
  }

  set categoryIds(categoryIds: string[]) {
    this.ga = categoryIds;
  }

  set categoryNames(categoryNames: string[]) {
    this.ef = categoryNames;
  }

  set keywords(keywords: string[]) {
    this.eg = keywords;
  }
}

class CustomPurchaseEvent extends PurchaseEvent {
  code = 'mxw';

  private ea: string | undefined;

  // Custom Attributes
  set installment(value: string) {
    this.ea = value;
  }
}

// Custom Event
class TestEvent {
  code = 'ral';

  private ea: string | undefined;

  set testAttribute(value: string) {
    this.ea = value;
  }
}

export {
  LoginEvent,
  RegisterEvent,
  ViewCartEvent,
  PurchaseEvent,
  NetmeraLineItem,
  CustomPurchaseEvent,
  TestEvent,
};
