package net.aadps;

import android.app.Application;
import android.net.Uri;
import android.os.Bundle;
import android.content.res.Resources;
import android.content.Intent;
import android.provider.MediaStore.Audio;
import android.app.Notification;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.pgsqlite.SQLitePluginPackage;

import com.baidu.android.pushservice.BasicPushNotificationBuilder;
import com.baidu.android.pushservice.PushConstants;
import com.baidu.android.pushservice.PushManager;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new SQLitePluginPackage(),
          new MainReactPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // Push: 以apikey的方式登录，一般放在主Activity的onCreate中。
    // 这里把apikey存放于manifest文件中，只是一种存放方式，
    // 您可以用自定义常量等其它方式实现，来替换参数中的Utils.getMetaValue(PushDemoActivity.this,
    // "api_key")
    Utils.logStringCache = Utils.getLogText(getApplicationContext());

    Resources resource = this.getResources();
    String pkgName = this.getPackageName();

    PushManager.startWork(getApplicationContext(), PushConstants.LOGIN_TYPE_API_KEY,
            Utils.getMetaValue(MainApplication.this, "api_key"));
    // Push: 如果想基于地理位置推送，可以打开支持地理位置的推送的开关
    // PushManager.enableLbs(getApplicationContext());

    // Push: 设置自定义的通知样式，具体API介绍见用户手册，如果想使用系统默认的可以不加这段代码
    // 请在通知推送界面中，高级设置->通知栏样式->自定义样式，选中并且填写值：1，
    // 与下方代码中 PushManager.setNotificationBuilder(this, 1, cBuilder)中的第二个参数对应
    BasicPushNotificationBuilder nBuilder = new BasicPushNotificationBuilder();
    nBuilder.setNotificationFlags(Notification.FLAG_AUTO_CANCEL);
    nBuilder.setNotificationDefaults(Notification.DEFAULT_VIBRATE);
    nBuilder.setStatusbarIcon(resource.getIdentifier(
            "status", "drawable", pkgName));
    nBuilder.setNotificationSound(Uri.withAppendedPath(
            Audio.Media.INTERNAL_CONTENT_URI, "6").toString());
    // 推送高级设置，通知栏样式设置为下面的ID
    PushManager.setDefaultNotificationBuilder(this, nBuilder);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
