//
//  SharedPreferencesModule.h
//  NetmeraTSExample
//
//  Created by Netmera Research on 23.02.2024.
//

#import <React/RCTBridgeModule.h>
#import "RNCConfig.h"

@interface SharedPreferencesModule : NSObject <RCTBridgeModule>

+(NSString *) getApiKey;
+(NSString *) getBaseUrl;

@end
