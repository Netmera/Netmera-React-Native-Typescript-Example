# Netmera React Native TypeScript Example

## Project Overview
React Native 0.77.1 TypeScript example app demonstrating Netmera SDK integration. Covers push notifications (FCM + HMS), in-app messaging, push inbox, analytics events, user identification, user profile attributes, permissions, coupons, geofence/location, and deeplink handling. Targets both Android (FCM + Huawei HMS) and iOS (APNs via Firebase).

**App ID:** `com.netmera.demo.reactnative`  
**Version:** `1.11.1-beta01`  
**Package manager:** npm (use `npm install`, not yarn)

## Tech Stack
- React Native 0.77.1 (TypeScript 5.0.4)
- react-native-netmera 2.0.0-alpha04
- Android: Gradle, Firebase (FCM), Huawei HMS
- iOS: CocoaPods, Firebase (FCM), APNs
- React Navigation (native-stack)
- @react-native-firebase/app + messaging
- @hmscore/react-native-hms-push
- react-native-device-info (HMS detection)
- react-native-toast-message, react-native-date-picker, react-hook-form

## Project Structure
```
App.tsx                     # Root: FCM/HMS token setup, navigation, deeplink/widget URL listeners
index.js                    # Entry: Netmera broadcast receiver init, background message handlers
NetmeraPushHeadlessTask.js  # Push callbacks: onPushRegister/Receive/Open/Dismiss/ButtonClicked/CarouselObjectSelected

src/
  screens/
    Dashboard.tsx    # Navigation hub — 8 buttons routing to all feature screens
    Settings.tsx     # Utility functions: push enable/disable, popup presentation, location,
                     #   data transfer, kill, device token display
    User.tsx         # User identification (userId, email, msisdn, wpNumber)
    Profile.tsx      # Update user profile attributes via Netmera.updateUserProfile()
    Permissions.tsx  # Email / SMS / WhatsApp permission toggles
    Events.tsx       # Send analytics events + generic event (Netmera.sendGenericEvent)
    PushInbox.tsx    # Inbox fetch/filter/paginate, status update, count, interactive actions
    Coupons.tsx      # Fetch and display coupons (page + max params)
    Category.tsx     # Category-related screen
  models/
    Events.tsx            # CustomPurchaseEvent (code: cjpnl), TestEvent (code: qlhov)
    MyNetmeraUser.tsx     # Extended NetmeraUser with custom attributes (testName, testGender)
    MyNetmeraUserProfile.ts  # Extended NetmeraUserProfile; overrides getSerializationMap()
                              #   with custom fields: luckyNumbers (is), isLuckyNumbersEnabled (qr),
                              #   lastLoginPlatform (ya)
  helpers/
    DeviceUtils.ts  # isAndroid(), isIos() helpers
  hooks/
    useDeeplinkUrl.ts  # Deeplink URL hook
  Colors.ts         # Color constants
  Style.tsx         # Shared StyleSheet

android/app/
  build.gradle      # App build config: FIREBASE_SENDER_ID, HMS_SENDER_ID, NETMERA_API_KEY (BuildConfig)
  google-services.json        # Firebase config
  agconnect-services.json     # Huawei AppGallery Connect config
  src/main/java/com/netmera/demo/reactnative/
    MainApplication.kt        # App init: reads config from NetmeraConfigProvider, inits RNNetmera
    MainActivity.kt
    config/
      NetmeraEnvironment.kt   # Enum: TEST / PREPROD / PROD / CUSTOM with URL + API key per env
      NetmeraConfigProvider.kt  # Reads/writes env config in SharedPreferences("Preferences")
      NetmeraConfigActivity.kt  # Standalone launcher Activity for switching environments at runtime

ios/
  AppDelegate.swift  # Netmera + Firebase init (calls initializeNetmera()), push delegate, deeplinks
  Config/
    NetmeraEnvironment.swift    # Enum: test / preprod / prod / custom with URL + API key per env
    NetmeraConfigProvider.swift # Reads Settings.bundle defaults → returns (apiKey, baseUrl)
  Settings.bundle/
    Root.plist        # iOS Settings app UI: environment picker + custom baseURL / APIKey fields
  Netmera-Config.plist          # Legacy SDK plist (app_group_name still used by extensions)
  GoogleService-Info.plist      # Firebase config
  Netmera_NotificationServiceExtension/  # Rich push (media attachments)
  Netmera_NotificationContentExtension/  # Rich push content display
  Podfile            # CocoaPods dependencies
```

## Key Rules
- All source files are TypeScript (`.ts` / `.tsx`). `NetmeraPushHeadlessTask.js` is the only plain JS file.
- Follow existing code style; no unnecessary comments.
- Never commit secrets or API keys.

## Netmera SDK Initialization Pattern

**Android:** `MainApplication.onCreate` calls `NetmeraConfigProvider.configFromPreferences(context)` to get `(apiKey, baseUrl)` from `SharedPreferences`, then passes them to `RNNetmeraConfiguration.Builder`. `FIREBASE_SENDER_ID` and `HMS_SENDER_ID` still come from `BuildConfig`.

**iOS:** `AppDelegate.initializeNetmera()` calls `NetmeraConfigProvider.registerSettingsBundleDefaults()` then `configFromSettings()` to get `(apiKey, baseUrl)` from `UserDefaults` (backed by `Settings.bundle`), then passes them to `RNNetmera.initialize(params:)`.

**JS layer (`index.js`):**
```js
Netmera.initBroadcastReceiver(onPushRegister, onPushReceive, onPushOpen, onPushDismiss, onPushButtonClicked, onCarouselObjectSelected);
Netmera.enablePopupPresentation();
```

**FCM token** is passed to Netmera via `Netmera.onNetmeraNewToken(token)` in `App.tsx`.  
**HMS token** is also passed the same way after a `DeviceInfo.hasHms()` check.

## Environment Switching

**Android:** A second launcher icon ("RN Config") opens `NetmeraConfigActivity`. The activity shows a spinner (Test / Pre-prod / Prod / Custom) and optional Base URL + API Key fields. On save it writes to `SharedPreferences("Preferences")` and kills the process; reopening the main app icon picks up the new config.

**iOS:** The environment is changed via the system Settings app (Settings → app name). `Settings.bundle/Root.plist` exposes a multi-value picker (test / preprod / prod / custom) and text fields for custom Base URL and API Key. On next cold launch `NetmeraConfigProvider` reads the updated `UserDefaults`.

## Extending Netmera Models

**Events:** Extend `NetmeraEvent` or `NetmeraEventPurchase`, set `code` to the dashboard event code. Use `Netmera.sendEvent(event)` for typed events or `Netmera.sendGenericEvent(code, attributes)` for ad-hoc payloads.

**User attributes:** Extend `NetmeraUser`. Private fields map to Netmera short-code parameter names.

**Profile attributes:** Extend `NetmeraUserProfile`. Override `getSerializationMap()` to add custom field → short-code mappings on top of the base map. Use `NetmeraProfileAttribute<T>` for simple fields and `NetmeraProfileAttributeCollection<T>` for collections. Call `Netmera.updateUserProfile(profile, callback?)`.

## Common Tasks
- **Install deps:** `npm install`
- **iOS pods:** `npm run pod-install`
- **Start Metro:** `npm start`
- **Run Android:** `npm run android` or `npx react-native run-android`
- **Run iOS:** `npm run ios` or `npx react-native run-ios`
- **Android debug build:** `cd android && ./gradlew assembleDebug`
- **Lint:** `npm run lint`
- **Test:** `npm test`

## Android Config Details
Located in `android/app/build.gradle`:
- `FIREBASE_SENDER_ID` — Firebase sender ID for FCM
- `HMS_SENDER_ID` — Huawei sender ID for HMS
- `NETMERA_API_KEY` — fallback only; runtime env is read from `SharedPreferences` via `NetmeraConfigProvider`
- Plugins: `com.google.gms.google-services`, `com.huawei.agconnect`

## iOS Config Details
- Notification extensions must have the same App Group entitlement as the main target (`group.com.netmera.demo.reactnative`).
- `Netmera_NotificationServiceExtension` — handles background download of rich media.
- `Netmera_NotificationContentExtension` — renders custom notification UI.
- Deeplinks handled via `RCTLinkingManager` in `AppDelegate.swift`.
- Push delegate (`NetmeraPushDelegate`) controls URL opening behavior.
- `ios/Config/` Swift files are registered in `project.pbxproj` under the `Config` group (Sources build phase).
- `ios/Settings.bundle` is registered in the Resources build phase.