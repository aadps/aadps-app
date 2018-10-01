/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#define DBNAME    @"aadps.db"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"aadps"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  

  UIUserNotificationType myTypes = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
    
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:myTypes categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  
#if TARGET_IPHONE_SIMULATOR
  Byte dt[32] = {0xc6, 0x1e, 0x5a, 0x13, 0x2d, 0x04, 0x83, 0x82, 0x12, 0x4c, 0x26, 0xcd, 0x0c, 0x16, 0xf6, 0x7c, 0x74, 0x78, 0xb3, 0x5f, 0x6b, 0x37, 0x0a, 0x42, 0x4f, 0xe7, 0x97, 0xdc, 0x9f, 0x3a, 0x54, 0x10};
  [self application:application didRegisterForRemoteNotificationsWithDeviceToken:[NSData dataWithBytes:dt length:32]];
#endif
  //角标清0
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  
  [application registerForRemoteNotifications];
  
  
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog(@"Device token: %@",deviceToken);
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
  NSString *library_path = [paths objectAtIndex:0];
  NSString *database_path = [[library_path stringByAppendingString:@"/LocalDatabase"] stringByAppendingPathComponent:DBNAME];
  
  if (sqlite3_open([database_path UTF8String], &db) != SQLITE_OK) {
    sqlite3_close(db);
    NSLog(@"数据库打开失败");
  }else{
    NSLog(@"数据库打开成功");
    char *error;
    sqlite3_exec(db, "DELETE FROM options WHERE id = 4", NULL, NULL, &error);
    sqlite3_exec(db, [[NSString stringWithFormat:@"%@%@%@", @"INSERT INTO options VALUES(4, \"", deviceToken, @"\")"]  cStringUsingEncoding:NSASCIIStringEncoding], NULL, NULL, &error);
    NSString  * query = @"SELECT * from options";
    sqlite3_stmt* stmt =NULL;
    sqlite3_prepare_v2(db, [query UTF8String], -1, &stmt, NULL);
    while (sqlite3_step(stmt) == SQLITE_ROW) //get each row in loop
    {
      NSInteger age =  sqlite3_column_int(stmt, 0);
      NSString * name =@"";
      if(sqlite3_column_text(stmt, 1)!=NULL)name =[NSString stringWithUTF8String:(const char *)sqlite3_column_text(stmt, 1)];
      
      
      NSLog(@"选项%ld：%@", (long)age, name);
      
    }
    NSLog(@"Done");
    sqlite3_finalize(stmt);
    sqlite3_prepare_v2(db, [query UTF8String], -1, &stmt, NULL);
    sqlite3_close(db);
  }
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  
  NSLog(@"%@",userInfo);
  
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
  NSString *library_path = [paths objectAtIndex:0];
  NSString *database_path = [[library_path stringByAppendingString:@"/LocalDatabase"] stringByAppendingPathComponent:DBNAME];
  
  if (sqlite3_open([database_path UTF8String], &db) != SQLITE_OK) {
    sqlite3_close(db);
    NSLog(@"数据库打开失败");
  }else{
    char *error;
    sqlite3_exec(db, "DELETE FROM options WHERE id = 5", NULL, NULL, &error);
    sqlite3_exec(db, [[NSString stringWithFormat:@"%@%@%@", @"INSERT INTO options VALUES(5, \"", userInfo[@"view"], @"\")"]  cStringUsingEncoding:NSASCIIStringEncoding], NULL, NULL, &error);
    sqlite3_close(db);
    NSLog(@"View saved: %@", userInfo[@"view"]);
  }
}

@end
