
import firebase, { RemoteMessage } from "react-native-firebase";
import { Platform } from "react-native";

export default async (message: RemoteMessage) => {
  console.log("background onMessage", message);

  let action = {};
  if (Platform.OS === "android") {
    const localNotification = new firebase.notifications.Notification({
      sound: "default",
      show_in_foreground: true
    })
      .setNotificationId(message.messageId)
      //.setTitle(message.data.title)
      .setTitle("찍먹 - 다이어트 필수 사진앱")
      // .setSubtitle(message.subtitle)
      .setBody(message.data.content)
      // .setData(message.data)
      //.android.setChannelId("justmoment") // e.g. the id you chose above
      //.android.setSmallIcon("ic_stat_ic_stat_smallicon") // create this icon in Android Studio
      // .android.setColor("#000000") // you can set a color here
      .android.setPriority(firebase.notifications.Android.Priority.High);

    firebase
      .notifications()
      .displayNotification(localNotification)
      .catch(err => console.error(err));
  } else if (Platform.OS === "ios") {
    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(message.messageId)
      .setTitle("찍먹 - 다이어트 필수 사진앱")
      //.setTitle(message.data.title)
      .setSubtitle(message.subtitle)
      .setBody(message.data.content)
      .setData(message.data)
      .ios.setBadge(message.ios.badge);

    firebase
      .notifications()
      .displayNotification(localNotification)
      .catch(err => console.error(err));
  }
  // console.log("RemoteMessage", message);
  return Promise.resolve();
};
