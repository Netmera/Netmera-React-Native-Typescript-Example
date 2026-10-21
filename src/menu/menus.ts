/*
 * Copyright (c) 2026 Netmera Research.
 */

type Screen =
  | 'Notification'
  | 'UserMenu'
  | 'Core'
  | 'Location'
  | 'Settings'
  | 'User'
  | 'Profile'
  | 'Permissions'
  | 'UserCategoryPreferences'
  | 'CategoryChannelList'
  | 'Coupons'
  | 'Events'
  | 'Autotracking'
  | 'AutoTrackingAutomation'
  | 'AutoTrackTest'
  | 'AutoTrackFlatListTest'
  | 'StackNavTest'
  | 'Inbox';

export interface MenuEntry {
  id: string;
  title: string;
  subtitle?: string;
  screen: Screen;
}

export interface Menu {
  id: string;
  title: string;
  entries: MenuEntry[];
}

export const menus = {
  Home: {
    id: 'home',
    title: 'Netmera React Native Example',
    entries: [
      {
        id: 'core',
        title: 'Core',
        subtitle: 'To manage SDK core configuration and initialization lifecycle.',
        screen: 'Core',
      },
      {
        id: 'notification',
        title: 'Notification',
        subtitle:
          'To manage notification permissions and handle push notification delegation.',
        screen: 'Notification',
      },
      {
        id: 'user',
        title: 'User',
        subtitle: 'To identify users and update user profile information.',
        screen: 'UserMenu',
      },
      {
        id: 'events',
        title: 'Events',
        subtitle: 'To send and track Netmera events triggered within the application.',
        screen: 'Events',
      },
      {
        id: 'autotracking',
        title: 'Autotracking',
        subtitle: 'To test automatic UI interaction tracking and navigation events.',
        screen: 'Autotracking',
      },
      {
        id: 'inbox',
        title: 'Inbox',
        subtitle: 'To view and manage inbox messages with filtering options.',
        screen: 'Inbox',
      },
      {
        id: 'location',
        title: 'Location',
        subtitle:
          'To manage location authorization status and location-based features.',
        screen: 'Location',
      },
      {
        id: 'deviceInfo',
        title: 'Device & Token Info',
        subtitle: 'NetmeraIdentifiers, NetmeraDeviceInfo and Token.',
        screen: 'Settings',
      },
    ],
  },
  UserMenu: {
    id: 'user',
    title: 'User',
    entries: [
      {id: 'identify', title: 'User Identify', screen: 'User'},
      {id: 'update', title: 'User Update', screen: 'Profile'},
      {id: 'settings', title: 'User Settings', screen: 'Permissions'},
      {
        id: 'categoryPreferences',
        title: 'Category Preferences',
        screen: 'UserCategoryPreferences',
      },
      {
        id: 'channelPreferences',
        title: 'Channel Preferences',
        screen: 'CategoryChannelList',
      },
      {id: 'coupons', title: 'Coupons', screen: 'Coupons'},
    ],
  },
  Autotracking: {
    id: 'autotracking',
    title: 'Autotracking',
    entries: [
      {
        id: 'automation',
        title: 'Autotracking Automation Tests',
        screen: 'AutoTrackingAutomation',
      },
      {id: 'autotrackTest', title: 'Autotrack Test', screen: 'AutoTrackTest'},
      {id: 'flatListTest', title: 'FlatList Test', screen: 'AutoTrackFlatListTest'},
      {id: 'stackNavTest', title: 'Stack Navigation Test', screen: 'StackNavTest'},
    ],
  },
} satisfies Record<string, Menu>;

export type MenuRoute = keyof typeof menus;
