import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNNetmera
import NetmeraNotification
import Firebase

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "NetmeraTSExample"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    UNUserNotificationCenter.current().delegate = self
    
    // Call before RNNetmera.initNetmera()
    FirebaseApp.configure()
    
    initializeNetmera()
    Netmera.setPushDelegate(self)

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
  
  // Add it if you are using Firebase.
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
      if #available(iOS 14, *) {
        completionHandler([.banner, .list, .badge, .sound])
      } else {
        completionHandler([.alert, .badge, .sound])
      }
  }
  
  // Add it if you are using Firebase.
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    completionHandler()
  }

  // MARK: Deeplink Method
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
    return RCTLinkingManager.application(application, open: url, options: options)
  }
  
  private func initializeNetmera() {
      // Netmera config from iOS Settings (Config/NetmeraConfigProvider)
      NetmeraConfigProvider.registerSettingsBundleDefaults()
      let (apiKey, baseUrl) = NetmeraConfigProvider.configFromSettings()
      
      let netmeraParams = NetmeraParams(apiKey: apiKey, baseUrl: baseUrl, appGroupName: "group.com.netmera.demo.reactnative")
      RNNetmera.initialize(params: netmeraParams)
  }
}

extension AppDelegate: NetmeraPushDelegate {
    func urlOpeningDecision(for url: URL, push: NetmeraBasePush) -> PushDelegateDecision {
      .sdkHandles
    }
    
    func openURL(_ url: URL, for push: NetmeraBasePush) {
      RNNetmeraRCTEventEmitter.openURL(url, forPushObject: push)
    }
}
