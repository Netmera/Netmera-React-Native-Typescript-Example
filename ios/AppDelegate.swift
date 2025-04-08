import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications
import FirebaseCore
import RNNetmera
import Netmera

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, NetmeraPushDelegate {
    
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        self.moduleName = "NetmeraTSExample"
        self.dependencyProvider = RCTAppDependencyProvider()
        self.initialProps = [:]
        
        UNUserNotificationCenter.current().delegate = self
        
        FirebaseApp.configure()
        
        RNNetmera.logging(true)
        
        let apiKey = "gFtyH_nz5WDqpkkpQX-3Qn4e8xbxuQro0E1okJrMtasmkOS5quErZtg8Ag4o--e1J4SHSUV9d-Y"
        RNNetmera.initNetmera(apiKey)
        
        let baseUrl = "https://sdkapi.netmera.com" 
        Netmera.setBaseURL(baseUrl)
        
        RNNetmera.setPushDelegate(self)
        Netmera.setAppGroupName("group.com.netmerareactnativeexample")
        
        if #available(iOS 17.2, *) {
            LiveActivityManager.shared.fetchAllActivities()
            LiveActivityManager.shared.getPushToStartToken()
        }
        
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
    
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        return self.bundleURL()
    }
    
    override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
    
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
        if response.actionIdentifier == UNNotificationDismissActionIdentifier {
            RNNetmeraRCTEventEmitter.onPushDismiss(["userInfo": response.notification.request.content.userInfo])
        } else if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
            RNNetmeraRCTEventEmitter.onPushOpen(["userInfo": response.notification.request.content.userInfo])
        }
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler(.alert)
        RNNetmeraRCTEventEmitter.onPushReceive(["userInfo": notification.request.content.userInfo])
    }
    
    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        if deviceToken.isEmpty { return }
        RNNetmeraRCTEventEmitter.onPushRegister(["pushToken": deviceToken])
    }
    
    
    func shouldHandleOpen(_ url: URL, for object: NetmeraPushObject) -> Bool {
        return false
    }
    
    func handleOpen(_ url: URL, for object: NetmeraPushObject) {
        RNNetmeraRCTEventEmitter.handleOpen(url, for: object)
    }
    
    
    override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return RCTLinkingManager.application(app, open: url, options: options)
    }
} 
