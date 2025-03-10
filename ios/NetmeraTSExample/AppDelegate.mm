#import "AppDelegate.h"

#import "NetmeraTSExample-Swift.h"
#import <React/RCTBundleURLProvider.h>

#import <RNNetmera/RNNetmeraRCTEventEmitter.h>
#import <RNNetmera/RNNetmeraUtils.h>
#import <RNNetmera/RNNetmera.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"NetmeraTSExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [UNUserNotificationCenter currentNotificationCenter].delegate = self;

  // Init Netmera
  [RNNetmera logging: YES];
  [RNNetmera initNetmera: [SharedPreferencesModule getApiKey]]; // Replace [SharedPreferencesModule getApiKey] with your own NETMERA API KEY.
  [Netmera setBaseURL:[SharedPreferencesModule getBaseUrl]];
  [RNNetmera setPushDelegate:self];
  [Netmera setAppGroupName:@"group.com.netmerareactnativeexample"];
  
  [FIRApp configure];
  
  if (@available(iOS 17.2, *)) {
    [[LiveActivityManager shared] fetchAllActivities];
    [[LiveActivityManager shared] getPushToStartToken];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// MARK: Push Delegate Methods

// Take push payload for Push clicked:
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  if ([response.actionIdentifier isEqual:UNNotificationDismissActionIdentifier]) {
    [RNNetmeraRCTEventEmitter onPushDismiss: @{@"userInfo" : response.notification.request.content.userInfo}];
  } else if ([response.actionIdentifier isEqual:UNNotificationDefaultActionIdentifier]) {
    [RNNetmeraRCTEventEmitter onPushOpen: @{@"userInfo" : response.notification.request.content.userInfo}];
  }
  completionHandler();
}

// Take push payload for push Received on application foreground:
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert);
  [RNNetmeraRCTEventEmitter onPushReceive: @{@"userInfo" : notification.request.content.userInfo}];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  if(deviceToken == nil) {
    return;
  }
  [RNNetmeraRCTEventEmitter onPushRegister: @{@"pushToken" : deviceToken}];
}

// MARK: Handle Open URL

// Required code block to handle widget URL's in React Native
- (BOOL)shouldHandleOpenURL:(NSURL *)url forPushObject:(NetmeraPushObject *)object {
  return NO;
}

- (void)handleOpenURL:(NSURL *)url forPushObject:(NetmeraPushObject *)object {
  [RNNetmeraRCTEventEmitter handleOpenURL:url forPushObject:object];
}

// MARK: Deeplink Method

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
