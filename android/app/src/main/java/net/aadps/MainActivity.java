package net.aadps;

import android.net.Uri;
import android.os.Bundle;
import android.content.res.Resources;
import android.content.Intent;
import android.provider.MediaStore.Audio;
import android.app.Notification;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import org.pgsqlite.SQLitePluginPackage;

import com.baidu.android.pushservice.BasicPushNotificationBuilder;
import com.baidu.android.pushservice.PushConstants;
import com.baidu.android.pushservice.PushManager;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Push: 以apikey的方式登录，一般放在主Activity的onCreate中。
    // 这里把apikey存放于manifest文件中，只是一种存放方式，
    // 您可以用自定义常量等其它方式实现，来替换参数中的Utils.getMetaValue(PushDemoActivity.this,
    // "api_key")
    Utils.logStringCache = Utils.getLogText(getApplicationContext());

    Resources resource = this.getResources();
    String pkgName = this.getPackageName();

    PushManager.startWork(getApplicationContext(), PushConstants.LOGIN_TYPE_API_KEY,
            Utils.getMetaValue(MainActivity.this, "api_key"));
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

  }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "aadps";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new SQLitePluginPackage(this),   // register SQLite Plugin here
            new MainReactPackage()
        );
    }
}
