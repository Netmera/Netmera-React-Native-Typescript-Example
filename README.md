# Netmera React Native Typescript Example

NETMERA is a Mobile Application Engagement Platform. We offer a series of development tools and app communication features to help your mobile business ignite and soar.

This is a TypeScript example project demonstrating the integration of the [react-native-netmera](https://github.com/Netmera/Netmera-React-Native) SDK. It covers push notifications (FCM + HMS), in-app messaging, push inbox, analytics events, user identification, user profile attributes, permissions, coupons, geofence/location, and deeplink handling for both Android and iOS.

## Running the Example

**Install dependencies:**

```
npm install
```

**iOS pods:**

```
npm run pod-install
```

**Start Metro:**

```
npm start
```

**Run Android:**

```
npm run android
```

**Run iOS:**

```
npm run ios
```

## Setup - Android Part

1. Create and register your app in [Firebase console](https://firebase.google.com/).

2. Download `google-services.json` file and place it into android/app/ folder.

3. In your project's build gradle file, add the following dependencies.

```
buildscript {
    repositories {
        google()
        mavenCentral()
        maven {url 'https://developer.huawei.com/repo/'}
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.3'
        classpath 'com.google.gms:google-services:4.3.10'
        classpath 'com.huawei.agconnect:agcp:1.6.3.300'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://maven.google.com'}
        maven { url 'https://developer.huawei.com/repo/'}
        maven { url "https://release.netmera.com/release/android" }
    }
}
```

4. In your app's build gradle file, add the following dependency.

```

 dependencies {

     implementation 'androidx.core:core:1.9.0'

 }
```

5. Add the following into the top of app's build.gradle file.

```
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.huawei.agconnect'
```

6. Create an application class as shown below.

- Initialize Netmera SDK in your Application class.

```
    public class MainApplication extends Application {

        @Override
        public void onCreate() {
            super.onCreate();
            RNNetmeraConfiguration netmeraConfiguration = new RNNetmeraConfiguration.Builder()
                .firebaseSenderId(<YOUR GCM SENDER ID>)
                .huaweiSenderId(<YOUR HMS SENDER ID>)
                .apiKey(<YOUR NETMERA API KEY>)
                .logging(true) // This is for enabling Netmera logs.
                .build(this);
            RNNetmera.initNetmera(netmeraConfiguration);
        }
    }
```

## Setup - iOS Part

1. Add the following post_install block to the end of your Podfile.

```
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name.include?('Swinject')
      target.build_configurations.each do |config|
        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
      end
    end
  end
end
```

2. Navigate to ios folder in your terminal and run the following command.

```
$ pod install
```

3. Enable push notifications for your project
   1. If you have not generated a valid push notification certificate yet,
      generate one and then export by following the steps explained in [Configuring Push Notifications section of App Distribution Guide](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns#2947597)
   2. Export the generated push certificate in .p12 format and upload to Netmera Dashboard.
   3. Enable Push Notifications capability for your application as explained in [Enable Push Notifications](https://developer.netmera.com/en/IOS/Quick-Start#enable-push-notifications) guide.
   4. Enable Remote notifications background mode for your application as explained in [Configuring Background Modes](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038) guide.

4. Add the `Netmera-Config.plist` file to your ios/YOUR-APP directory.

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>sdk_params</key>
        <dict>
            <key>api_key</key>
            <string>YOUR-API-KEY</string>
        </dict>
    </dict>
</plist>
```

- If you are using Netmera on-premises, you must add your server URL as the base_url key inside sdk_params.

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>sdk_params</key>
        <dict>
            ...
            <key>base_url</key>
            <string>YOUR-BASE-URL</string>
        </dict>
    </dict>
</plist>
```

5. Shape your AppDelegate.swift as following.

#### AppDelegate.swift

- Add the following to the top of AppDelegate.swift file.

```
import RNNetmera
```

- Add the following line into the `didFinishLaunchingWithOptions` method.

```
RNNetmera.initNetmera()
```

6. In order to use iOS10 Media Push, follow the instructions in [Netmera Product Hub.](https://user.netmera.com/netmera-developer-guide/platforms/ios/new-ios-swift/push-notifications/media-push) Differently, you should add the pods to the top of the `Podfile` as below.

   ```
   // For receiving Media Push, you must add Netmera pods to top of your Podfile.
   pod 'NetmeraNotificationServiceExtension', "4.23.0"
   pod "NetmeraNotificationContentExtension", "4.23.0"
   ```

7. In order to use the widget URL callback, add these lines into `AppDelegate.swift` file.

```
import NetmeraNotification

...
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    ...
    Netmera.setPushDelegate(self)
    ..
  }
...

extension AppDelegate: NetmeraPushDelegate {
  func urlOpeningDecision(for url: URL, push: NetmeraNotificationCore.NetmeraBasePush) -> PushDelegateDecision {
    return .sdkHandles
  }

  func openURL(_ url: URL, for push: NetmeraNotificationCore.NetmeraBasePush) {
    RNNetmeraRCTEventEmitter.openURL(url, forPushObject: push)
  }
}
```

## Setup - React Native Part

1. Create a new `NetmeraPushHeadlessTask.ts` inside your React Native project.

```ts
import type {
  NetmeraPushObject,
  NetmeraInteractiveAction,
  NetmeraCarouselObject,
} from 'react-native-netmera';

export const onPushRegister = async (data: { pushToken: string }) => {
  console.log('onPushRegister: ', data);
};

export const onPushReceive = async (push: NetmeraPushObject) => {
  console.log('onPushReceive: ', push);
};

export const onPushOpen = async (push: NetmeraPushObject) => {
  console.log('onPushOpen: ', push);
};

export const onPushDismiss = async (push: NetmeraPushObject) => {
  console.log('onPushDismiss: ', push);
};

export const onPushButtonClicked = async (
  push: NetmeraPushObject,
  action?: NetmeraInteractiveAction
) => {
  console.log('onPushButtonClicked: ', push);
  console.log('Clicked action: ', action);
};

export const onCarouselObjectSelected = async (
  push: NetmeraPushObject,
  carouselItem?: NetmeraCarouselObject
) => {
  console.log('onCarouselObjectSelected: ', push);
  console.log('Selected carousel item: ', carouselItem);
};
```

2. Register push lifecycle callbacks inside your `index.js` file.

```js
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Netmera } from 'react-native-netmera';

import {
  onCarouselObjectSelected,
  onPushButtonClicked,
  onPushDismiss,
  onPushOpen,
  onPushReceive,
  onPushRegister,
} from './NetmeraPushHeadlessTask';

Netmera.setPushLifecycleCallbacks(
  onPushRegister,
  onPushReceive,
  onPushOpen,
  onPushDismiss,
  onPushButtonClicked,
  onCarouselObjectSelected
);

// This should be called after Netmera.setPushLifecycleCallbacks.
AppRegistry.registerComponent(appName, () => App);
```

3. If you have custom Firebase Messaging integration, please see usage below.

1- Add the following line to your `AndroidManifest.xml` file inside the `application` tag to remove Netmera's default FCM service

```
<service
    android:name="com.netmera.nmfcm.NMFirebaseService"
    tools:node="remove" />
```

2- Update `FirebaseMessaging` methods like below

```
messaging()
   .getToken(firebase.app().options.messagingSenderId)
   .then(pushToken => {
       Netmera.onNetmeraNewToken(pushToken)
});

messaging().onMessage(async remoteMessage => {
   if (Netmera.isNetmeraRemoteMessage(remoteMessage.data)) {
       Netmera.onNetmeraFirebasePushMessageReceived(remoteMessage.from, remoteMessage.data)
   }
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (Netmera.isNetmeraRemoteMessage(remoteMessage.data)) {
        Netmera.onNetmeraFirebasePushMessageReceived(remoteMessage.from, remoteMessage.data)
    }
});

```

4. If you have custom Huawei Messaging integration, please see usage below.

1- Add the following line to your `AndroidManifest.xml` file inside the `application` tag to remove Netmera's default HMS service

```
<service
   android:name="com.netmera.nmhms.NMHuaweiService"
   tools:node="remove" />
```

2- Update `HuaweiPushKit` methods like below

```
HmsPushInstanceId.getToken("")
   .then((result) => {
       Netmera.onNetmeraNewToken(result.result)
   })

HmsPushEvent.onRemoteMessageReceived((event) => {
  const remoteMessage = new RNRemoteMessage(event.msg);
  let data = JSON.parse(remoteMessage.getData());
  if (Netmera.isNetmeraRemoteMessage(data)) {
    Netmera.onNetmeraHuaweiPushMessageReceived(
      remoteMessage.getFrom(),
      data,
    );
  }
});

HmsPushMessaging.setBackgroundMessageHandler(async dataMessage => {
  const remoteMessage = new RNRemoteMessage(dataMessage);
  let data = JSON.parse(remoteMessage.getData());
  if (Netmera.isNetmeraRemoteMessage(data)) {
    Netmera.onNetmeraHuaweiPushMessageReceived(
        remoteMessage.getFrom(),
        data,
    );
  }
});
```

## Calling React Native methods

##### Identify User Example

```
const identifyUser = () => {
    const user = new NetmeraUser();
    user.userId = <userId>;
    user.email = <email>;
    user.msisdn = <msisdn>;
    user.wpNumber = <whatsappNumber>;

    // Identify user with callback
    Netmera.identifyUser(user, (success, error) => {
      if (success) {
        console.log("User identified successfully")
      } else {
        console.error(error?.message)
      }
    });

    // Identify user without callback
    Netmera.identifyUser(user);
}
```

##### Update User Profile Example

```
const sendUserProfileUpdate = () => {
  const userProfile = new NetmeraUserProfile();
  userProfile.name.set('John');
  userProfile.surname.set('Doe');
  userProfile.dateOfBirth.set(new Date().getTime());
  userProfile.gender.set(Gender.MALE);
  userProfile.externalSegments.set(['segment1', 'segment2']);

  // Update user profile with callback
  Netmera.updateUserProfile(userProfile, (success, error) => {
      if (success) {
          ...
        } else {
          ...
        }
  });

  // Update user profile without callback
  Netmera.updateUserProfile(userProfile);
};
```

##### Sending Event Examples

You can send your events as follows. For more examples, please see the [Events screen](src/screens/Events.tsx) in this example project.

```
  const sendLoginEvent = () => {
    const loginEvent = new NetmeraEventLogin();
    loginEvent.setUserId(<userId>);
    Netmera.sendEvent(loginEvent)
  }

  const sendRegisterEvent = () => {
    const registerEvent = new NetmeraEventRegister();
    registerEvent.setUserId(<userId>);
    Netmera.sendEvent(registerEvent)
  }

  const sendViewCartEvent = () => {
    const viewCartEvent = new NetmeraEventCartView();
    viewCartEvent.setSubTotal(<subTotal>);
    viewCartEvent.setItemCount(<itemCount>);
    Netmera.sendEvent(viewCartEvent)
  }
```

##### Deeplink

In order to manage your deeplinks, use the following method for iOS initial url's

```
Netmera.getInitialURL().then(url => {
   if (url) {
     console.log(url);
   }
 });
```

You can use `Linking` methods as before

##### Widget URL Callback

In order to use the widget URL callback, use `onWidgetUrlTriggered` method as follows.

```
 Netmera.onWidgetUrlTriggered(url => {
   console.log('Netmera triggered widget url: ', url);
 });
```

##### Push Notification Permissions

If you don't request notification permission at runtime, you can request it by calling the `requestPushNotificationAuthorization()` method.
Note: Notification runtime permissions are required on Android 13 (API 33) or higher.
Therefore, before calling the method, make sure your project targets an API of 33 and above.

```
  Netmera.requestPushNotificationAuthorization()
  .then((isGranted) => {
    ...
  });
```

You can call the `checkNotificationPermission()` method if you need to know the status of permissions.

```
 Netmera.checkNotificationPermission().then(status => {
   //NotificationPermissionStatus.NotDetermined
   //NotificationPermissionStatus.Blocked
   //NotificationPermissionStatus.Denied
   //NotificationPermissionStatus.Granted
 });
```

##### Netmera Inbox Examples

You can fetch the Netmera inbox as following. For more detailed usage, please see the [PushInbox screen](src/screens/PushInbox.tsx) in this example project.

```
 const fetchInbox = async () => {
     try {
         const netmeraInboxFilter = new NetmeraInboxFilter();
         netmeraInboxFilter.status = Netmera.PUSH_OBJECT_STATUS_UNREAD;
         netmeraInboxFilter.pageSize = 2; // Fetch two push object
         const inbox = await Netmera.fetchInbox(netmeraInboxFilter);
         console.log("inbox", inbox);
     } catch (e) {
         console.log("error", e)
     }
 }
```

##### Netmera Inbox Category Examples

You can fetch the Netmera category as following. For more detailed usage, please see the [Category screen](src/screens/Category.tsx) in this example project.

```
 const fetchCategory = async () => {
     try {
         const netmeraCategoryFilter = new NetmeraCategoryFilter()
         netmeraCategoryFilter.status = categoryState
         netmeraCategoryFilter.pageSize = 1 // Fetch one by one
         const categories = await Netmera.fetchCategory(netmeraCategoryFilter)
         console.log("categories", categories);
         setCategories(categories)
     } catch (e) {
         console.log("error", e)
     }
 };
```

##### Netmera Getting ExternalId (if exists before)

```
    Netmera.currentExternalId()
```

##### Netmera Popup Presentation

To enable popup presentation, you need to call the `enablePopupPresentation()` method on the page where you want to display the popup.
Note: To show popup on the app start or everywhere in the app, please add this to `index.js` file.

```
 Netmera.enablePopupPresentation();
```

##### Data Start-Stop Transfer

###### Stop Data Transfer Method

The stopDataTransfer() method is a useful feature that can help users to temporarily pause all requests sent by the SDK to the backend.
This can be useful if, for example, the user needs to temporarily halt data transfers due to network issues or other reasons.
Once the issue has been resolved, the user can then restart the data transfer using the startDataTransfer() method.

```
 Netmera.stopDataTransfer();
```

###### Start Data Transfer Method

The startDataTransfer() method is a complementary feature to the stopDataTransfer() method, which allows users to restart any stopped requests.
This can be useful when the user has temporarily paused data transfers and is now ready to resume the transfer. Once the user calls the
startDataTransfer() method, the SDK will attempt to resend any requests that were previously stopped.

```
 Netmera.startDataTransfer();
```

Please explore the [source code](src/) of this example project for detailed information.

## Autotracking

Netmera Autotracking automatically captures screen transitions via **React Navigation** and tap interactions on **official React Native components** (`Pressable`, `TouchableOpacity`, `Switch`, etc.) without requiring manual instrumentation for each event.

### NetmeraAnalyticProvider

Wrap your app with `NetmeraAnalyticProvider` and pass a `navigationRef` so the provider can subscribe to screen changes. The provider handles both screen tracking and tap tracking based on the configuration received from the Netmera dashboard.

**Dynamic API** (React Navigation v6 / v7):

```tsx
import { useNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { NetmeraAnalyticProvider } from 'react-native-netmera';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NetmeraAnalyticProvider navigationRef={navigationRef}>
      <NavigationContainer ref={navigationRef}>
        {/* your navigators */}
      </NavigationContainer>
    </NetmeraAnalyticProvider>
  );
}
```

**Static API** (React Navigation v7):

```tsx
import { useNavigationContainerRef, createStaticNavigation } from '@react-navigation/native';
import { NetmeraAnalyticProvider } from 'react-native-netmera';

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NetmeraAnalyticProvider navigationRef={navigationRef}>
      <Navigation ref={navigationRef} />
    </NetmeraAnalyticProvider>
  );
}
```

> **Note:** Use a single `NetmeraAnalyticProvider` per application. The current screen name is stored in a module-level singleton — mounting multiple providers simultaneously will cause them to overwrite each other's screen state.

### Manual action tracking with `Netmera.trackAction`

For components that do not fire standard `onPress` or `onValueChange` events (e.g. third-party dropdowns, custom pickers, gesture-only views), call `Netmera.trackAction` to record the interaction manually.

The method automatically prepends the current screen name to the provided path:

```ts
import { Netmera } from 'react-native-netmera';

Netmera.trackAction('category-selector|Electronics');
// → records: "HomeScreen|category-selector|Electronics"
```

Use the `|` separator to build structured paths (e.g. `component|value`, `list|item-name`).

### Improving tap tracking with `accessibilityLabel` and `testID`

When a tap is detected, Netmera resolves an identifier for the tapped component using the following priority order:

1. **`accessibilityLabel`** — the preferred identifier; human-readable and stable.
2. **`testID`** — used when `accessibilityLabel` is absent.
3. **`placeholder`** — for `TextInput` components with no label or testID.
4. **Child text content** — the text of the first `<Text>` descendant.

If none of the above resolves to a non-empty string the tap is not recorded.

Add `accessibilityLabel` to interactive components that would otherwise produce no identifier (icon buttons, image buttons, custom gesture views):

```tsx
// Icon button — without accessibilityLabel it would produce no identifier
<Pressable
  accessibilityLabel="add-to-cart"
  onPress={handleAddToCart}
>
  <CartIcon />
</Pressable>
```

> **Recommendation:** Prefer `accessibilityLabel` over relying on child text content. Text content can change with copy updates or localisation, causing tracking paths to shift. An explicit label stays stable across UI changes.

For hands-on examples of autotracking integration, see the [Autotracking screens](src/screens/) in this project (`AutoTrackTest.tsx`, `AutoTrackFlatListTest.tsx`, `StackNavTest.tsx`).
