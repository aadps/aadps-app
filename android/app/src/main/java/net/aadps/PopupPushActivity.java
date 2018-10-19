package net.aadps;

import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;

import com.alibaba.sdk.android.push.AndroidPopupActivity;

import java.util.Map;

public class PopupPushActivity extends AndroidPopupActivity {
    static final String TAG = "PopupPushActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * 实现通知打开回调方法，获取通知相关信息
     *
     * @param title   标题
     * @param summary 内容
     * @param extMap  额外参数
     */
    @Override
    protected void onSysNoticeOpened(String title, String summary, Map<String, String> extMap) {
        Log.d("PopupPushActivity", "OnMiPushSysNoticeOpened, title: " + title + ", content: " + summary + ", extMap: " + extMap);
        if (extMap.get("view") != null) {
            SQLiteDatabase aadpsDb = SQLiteDatabase.openOrCreateDatabase("/data/data/net.aadps/databases/aadps.db", null);
            aadpsDb.execSQL("DELETE FROM options WHERE id = 5");
            aadpsDb.execSQL("INSERT INTO options VALUES(5, \"" + extMap.get("view") + "\")");
            aadpsDb.close();
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            this.getApplicationContext().startActivity(intent);
        }
    }
}