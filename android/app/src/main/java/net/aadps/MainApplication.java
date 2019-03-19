package net.aadps;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.pgsqlite.SQLitePluginPackage;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.alibaba.sdk.android.push.*;
import com.alibaba.sdk.android.push.register.*;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static final String TAG = "AADPS";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new SQLitePluginPackage(),
          new MainReactPackage(),
            new RNFetchBlobPackage()
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
    SoLoader.init(this, /* native exopackage */ false);
    initPushService(this);
  }

  private void initPushService(final Context applicationContext) {
    MiPushRegister.register(applicationContext, "2882303761517871485", "5181787195485");
    HuaWeiRegister.register(applicationContext);
    PushServiceFactory.init(applicationContext);
    final CloudPushService pushService = PushServiceFactory.getCloudPushService();
    pushService.register(applicationContext, new CommonCallback() {
      @Override
      public void onSuccess(String response) {
        Log.i(TAG, "init cloudchannel success: " + pushService.getDeviceId());
        //setConsoleText("init cloudchannel success");
        if(pushService.getDeviceId() != null){
          SQLiteDatabase aadpsDb = SQLiteDatabase.openOrCreateDatabase("/data/data/net.aadps/databases/aadps.db", null);
          aadpsDb.execSQL("DELETE FROM options WHERE id = 4");
          aadpsDb.execSQL("INSERT INTO options VALUES(4, \"" + pushService.getDeviceId() + "\")");
          aadpsDb.close();
        }
      }
      @Override
      public void onFailed(String errorCode, String errorMessage) {
        Log.e(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
        //setConsoleText("init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
      }
    });

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      // 通知渠道的id
      String id = "1";
      // 用户可以看到的通知渠道的名字.
      CharSequence name = "AADPS";
      // 用户可以看到的通知渠道的描述
      String description = "AADPS推送通知";
      int importance = NotificationManager.IMPORTANCE_HIGH;
      NotificationChannel mChannel = new NotificationChannel(id, name, importance);
      // 配置通知渠道的属性
      mChannel.setDescription(description);
      // 设置通知出现时的闪灯（如果 android 设备支持的话）
      mChannel.enableLights(true);
      mChannel.setLightColor(Color.WHITE);
      // 设置通知出现时的震动（如果 android 设备支持的话）
      mChannel.enableVibration(true);
      mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
      //最后在notificationmanager中创建该通知渠道
      mNotificationManager.createNotificationChannel(mChannel);
    }
  }
}
