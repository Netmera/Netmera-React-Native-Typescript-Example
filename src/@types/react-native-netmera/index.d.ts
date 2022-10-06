declare module 'react-native-netmera' {
  export type NetmeraPushObjectStatus = number;
  export type NetmeraGender = number;
  export type NetmeraMaritalStatus = number;

  export class Netmera {

    static PUSH_OBJECT_STATUS_UNREAD: NetmeraPushObjectStatus;
    static PUSH_OBJECT_STATUS_READ: NetmeraPushObjectStatus;
    static PUSH_OBJECT_STATUS_DELETED: NetmeraPushObjectStatus;
    static PUSH_OBJECT_STATUS_READ_OR_UNREAD: NetmeraPushObjectStatus;
    static PUSH_OBJECT_STATUS_ALL: NetmeraPushObjectStatus;

    static initBroadcastReceiver(
      onPushRegister: (message: string) => void,
      onPushReceive: (message: string) => void,
      onPushOpen: (message: string) => void,
      onPushDismiss: (message: string) => void,
      onPushButtonClicked: (message: string) => void,
      onCarouselObjectSelected: (message: string) => void,
    ): void;

    static currentExternalId(): Promise<string>;

    static setBaseUrl(baseUrl: string): void;

    static requestPushNotificationAuthorization(): void;

    static requestPermissionsForLocation(): void;

    static setNetmeraMaxActiveRegions(maxActiveRegions: number): void;

    static enablePopupPresentation(): void;

    static disablePopupPresentation(): void;

    static isPushEnabled(): Promise<boolean>;

    static enablePush(): void;

    static disablePush(): void;

    static turnOffSendingEventAndUserUpdate(turnOff: boolean): void;

    static fetchInbox(netmeraInboxFilter: NetmeraInboxFilter): Promise<Array<NetmeraPushInbox>>;

    static fetchNextPage(): Promise<Array<NetmeraPushInbox>>;

    static countForStatus(status: NetmeraPushObjectStatus): Promise<number>;

    static inboxUpdateStatus(
      fromIndex: number,
      toIndex: number,
      status: NetmeraPushObjectStatus,
    ): Promise<any>;

    static fetchCategory(categoryFilter: NetmeraCategoryFilter): Promise<Array<NetmeraCategory>>;

    static fetchNextCategoryPage(): Promise<Array<NetmeraCategory>>;

    static sendEvent(event: any): void;

    static updateUser(user: NetmeraUser): void;

    static updateAll(inboxStatus: number): Promise<any>; //todo: test it

    static handlePushObject(pushId: string): void;

    static handleInteractiveAction(pushId: string): void;

    static setApiKey(apiKey: string): void;

    static handleLastMessage(categoryName: string): void;

    static updateStatusByCategories(fromIndex: number, toIndex: number, status: number): Promise<any>; //todo: test it

    static getInboxCountForStatus(nmInboxStatusCountFilter: NMInboxStatusCountFilter): Promise<any>; //todo: test it

    static getUserCategoryPreferenceList(): Promise<Array<NMCategoryPreference>>;

    static setUserCategoryPreference(categoryId: number, categoryEnabled: boolean): Promise<any>; //todo: test it

    static onNetmeraFirebasePushMessageReceived(from: string, data: any): void;

    static onNetmeraHuaweiPushMessageReceived(from: string, data: any): void;

    static onNetmeraNewToken(pushToken: string): void;

    static isNetmeraRemoteMessage(data: Object): boolean;

  }

  export class NetmeraUser {
    static GENDER_MALE: NetmeraGender;
    static GENDER_FEMALE: NetmeraGender;
    static GENDER_NOT_SPECIFIED: NetmeraGender;

    static MARITAL_STATUS_SINGLE: NetmeraMaritalStatus;
    static MARITAL_STATUS_MARRIED: NetmeraMaritalStatus;
    static MARITAL_STATUS_NOT_SPECIFIED: NetmeraMaritalStatus;

    userId: string;
    email: string;
    msisdn: string;
    name: string;
    surname: string;
    gender: NetmeraGender;
    externalSegments: string[];
    dateOfBirth: number;
    maritalStatus: NetmeraMaritalStatus;
    childCount: number;
    country: string;
    state: string;
    city: string;
    district: string;
    favoriteTeam: string;
    language: string;
    industry: string;
    occupation: string;
  }

  export class NetmeraInboxFilter {
    status?: NetmeraPushObjectStatus;
    pageSize?: number;
    categories?: string[];
    includeExpiredObjects?: boolean;
  }

  export class NetmeraCategoryFilter {
    pageSize: number;
    status: number;
    includeExpiredObjects: boolean;
  }

  export class NMInboxStatusCountFilter {
    nmInboxStatus: number;
    categoryList: any;
    includeExpired: boolean;
  }

  export class NetmeraPushInbox {
    title: string;
    subtitle: string;
    body: string;
    pushType: number;
    pushId: string;
    pushInstanceId: string;
    sendDate: string;
    inboxStatus: number;
    deepLink: string;
    webPage: string;
    externalId: string;
    customJson: any;
    pushAction: string;
    carousel: any;
    mediaAttachmentURL: string;
    category: string;
    categories: any;
    interactiveActions: string;
    expireTime: string;
  }

  class NetmeraCategory {
    categoryName: string;
    categoryStatus: string;
    lastMessage: NetmeraPushInbox;
    readCount: number;
    deletedCount: number;
    unreadCount: number;
  }

  export class NMCategoryPreference {
    categoryId: number;
    categoryName: string;
    optInStatus: boolean;
  }

  export class NMInboxStatus {
    static STATUS_READ: number;
    static STATUS_UNREAD: number;
    static STATUS_DELETED: number;
    static STATUS_ALL: number;
  }

}
