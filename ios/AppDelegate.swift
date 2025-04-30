import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNNetmera
import Netmera
import Firebase

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, NetmeraPushDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "NetmeraTSExample"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    if #available(iOS 10.0, *) {
        UNUserNotificationCenter.current().delegate = self
    }
    
    RNNetmera.logging(true);
    RNNetmera.initNetmera(SharedPreferencesModule.getApiKey()) // Replace SharedPreferencesModule.getApiKey() with your own NETMERA API KEY.
    Netmera.setBaseURL(SharedPreferencesModule.getBaseUrl())
    RNNetmera.setPushDelegate(self)
    Netmera.setAppGroupName("group.com.netmerareactnativeexample")
    
    FirebaseApp.configure()
    
    if #available(iOS 17.2, *) {
      LiveActivityManager.shared.fetchAllActivities()
      LiveActivityManager.shared.getPushToStartToken()
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  // MARK: Push Delegate Methods

  // Take push payload for Push clicked:
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    let userInfo = response.notification.request.content.userInfo

    if response.actionIdentifier == UNNotificationDismissActionIdentifier {
        RNNetmeraRCTEventEmitter.onPushDismiss(["userInfo": userInfo])
    } else if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
        RNNetmeraRCTEventEmitter.onPushOpen(["userInfo": userInfo])
    }
          
    completionHandler()
  }
  
  // Take push payload for push Received on application foreground:
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([UNNotificationPresentationOptions.alert])
    RNNetmeraRCTEventEmitter.onPushReceive(["userInfo": notification.request.content.userInfo])
  }
  
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    RNNetmeraRCTEventEmitter.onPushRegister(["pushToken": deviceToken])
  }
  
  // MARK: Handle Open URL

  // Required code block to handle widget URL's in React Native
  func shouldHandleOpen(_ url: URL!, for object: NetmeraPushObject!) -> Bool {
    return false
  }

  func handleOpen(_ url: URL!, for object: NetmeraPushObject!) {
    RNNetmeraRCTEventEmitter.handleOpen(url, for: object)
  }

  // MARK: Deeplink Method
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
    return RCTLinkingManager.application(application, open: url, options: options)
  }
}
