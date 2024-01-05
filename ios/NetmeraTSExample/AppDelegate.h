#import <RCTAppDelegate.h>
#import "RNCConfig.h"
#import <UIKit/UIKit.h>
#import <Netmera/Netmera.h>
#import <NetmeraCore/NetmeraPushObject.h>
#import <UserNotifications/UserNotifications.h>


@interface AppDelegate : RCTAppDelegate <UNUserNotificationCenterDelegate,NetmeraPushDelegate>

@end
