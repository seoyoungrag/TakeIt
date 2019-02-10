package kr.co.dwebss.takeat.android;

import android.content.Intent;
import android.content.Context;
import android.os.PowerManager;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.app.PendingIntent;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import io.invertase.firebase.R;
import android.view.View;


import com.facebook.react.HeadlessJsTaskService;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import io.invertase.firebase.Utils;

import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

import org.json.JSONObject;
import org.json.JSONException;

import kr.co.dwebss.takeat.android.MainActivity;

import static android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;

public class NotificationService extends FirebaseMessagingService {

  private static final String TAG = "NotificationService";
  public static final String MESSAGE_EVENT = "messaging-message";
  public static final String NEW_TOKEN_EVENT = "messaging-token-refresh";
  public static final String REMOTE_NOTIFICATION_EVENT = "notifications-remote-notification";
  
  PowerManager powerManager;
  PowerManager.WakeLock wakeLock;

  @Override
  public void onNewToken(String token) {
    Log.d(TAG, "onNewToken event received");

    Intent newTokenEvent = new Intent(NEW_TOKEN_EVENT);
    LocalBroadcastManager
      .getInstance(this)
      .sendBroadcast(newTokenEvent);
  }

  @Override
  public void onMessageReceived(RemoteMessage message) {
    Log.d(TAG, "onMessageReceived event received in NotificationService");
    try {
      powerManager = (PowerManager)getSystemService(Context.POWER_SERVICE);
      wakeLock = powerManager.newWakeLock(PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE, "takeat: WAKELOCK");

      Intent intent = new Intent(this, MainActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);

      Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
      NotificationCompat.Builder notificationBuilder;
      NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      wakeLock.acquire();
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        notificationBuilder = new NotificationCompat.Builder(this, message.getData().get("android_channel_id"))
                .setSmallIcon(R.mipmap.ic_launcher)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(),
                        R.mipmap.ic_launcher))
                .setContentTitle(message.getData().get("title"))
                .setContentText(message.getData().get("body"))
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentIntent(pendingIntent)
                .setContentText(message.getData().get("body"));
      } else {
        notificationBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(),
                        R.mipmap.ic_launcher))
                .setContentTitle(message.getData().get("title"))
                .setContentText(message.getData().get("body"))
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentIntent(pendingIntent)
                .setContentText(message.getData().get("body"));
      }

      Notification notification = notificationBuilder.build();
      int smallIconId = getResources().getIdentifier("right_icon", "id", android.R.class.getPackage().getName());
      if (smallIconId != 0) { 
          if (notification.contentView!=null)
              notification.contentView.setViewVisibility(smallIconId, View.INVISIBLE);
      }
      notificationManager.notify(0, notification);
      //getApplicationContext().startActivity(intent);
      wakeLock.release();
    } catch (Exception e) {
      Log.d(TAG, "Error ", e);
    }
    Intent notificationEvent = new Intent(REMOTE_NOTIFICATION_EVENT);
    notificationEvent.putExtra("notification", message);

    // Broadcast it to the (foreground) RN Application
    LocalBroadcastManager.getInstance(this).sendBroadcast(notificationEvent);
  }
}