//
//  SharedPreferencesModule.m
//  NetmeraTSExample
//
//  Created by Netmera Research on 23.02.2024.
//

#import "SharedPreferencesModule.h"

@implementation SharedPreferencesModule

RCT_EXPORT_MODULE();

NSString* KEY_API_KEY = @"apiKey";
NSString* KEY_BASE_URL = @"baseUrl";

RCT_EXPORT_METHOD(setApiKey:(NSString *)value) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:value forKey:KEY_API_KEY];
  [defaults synchronize];
}

RCT_EXPORT_METHOD(setBaseUrl:(NSString *)value) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:value forKey:KEY_BASE_URL];
  [defaults synchronize];
}

+ (NSString *) getApiKey {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *value = [defaults stringForKey:KEY_API_KEY];
  if (value != nil) {
    return value;
  } else {
    return [RNCConfig envFor:@"NETMERA_PREPROD_API_KEY"];
  }
}

+ (NSString *) getBaseUrl {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *value = [defaults stringForKey:KEY_BASE_URL];
  if (value != nil) {
    return value;
  } else {
    return [RNCConfig envFor:@"NETMERA_PREPROD_BASE_URL"];
  }
}

@end
