/**
 *
 * @format
 * @flow
 */
import React from 'react';

import { NativeModules, BackHandler, Platform, AppState} from 'react-native';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import Container from '@container/Container';
import MainTabNavigator from '@common/Routes';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '@redux-yrseo/reducers';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

const UIManager = NativeModules.UIManager;

const uiTheme = {
  fontFamily:"NotoSans-Regular",
  palette: {
    primaryColor: COLOR.white,
    secondaryColor: COLOR.white,
    // primaryColor: COLOR.pink500,
    // accentColor: COLOR.pink500,
    // primaryTextColor: COLOR.pink500,
    // secondaryTextColor: COLOR.pink500,
    alternateTextColor: COLOR.pink500,
    // accentColor: COLOR.pink500
  },
  icon: {
    // color: COLOR.white
  },
  // drawer를 위해서 사용
  listItem: {
    primaryText: {
      color: 'black',
      fontSize: 8,
      fontFamily: 'NotoSans-Regular',
    },
    container: {
      backgroundColor: COLOR.white,
    },
    // icon: {
    //   color: "rgba(255,255,255,1)"
    // },
    // label: {
    //   color: 'rgba(255,255,255,1)',
    // },
    //각 item을 감싸는 View
    contentViewContainer: {
      backgroundColor: 'silver',
      borderWidth: 1,
    },
    // drawer메뉴의 각 메뉴 좌측 아이콘 뷰를 감싸는 뷰
    leftElementContainer: {
      alignItems: 'flex-end',
      paddingRight: 10,
    },
    // 좌측 아이콘을 감싸는 뷰
    leftElement: {
      // color: "rgba(255,255,255,1)",
      height: 8,
    },
    centerElementContainer: {
      backgroundColor: 'silver',
    },
    textViewContainer: {
      backgroundColor: 'yellow',
    },
  },
};
/*
const channel = new firebase.notifications.Android.Channel(
  "TAKEAT",
  "찍먹 - 다이어트 필수 사진앱",
  firebase.notifications.Android.Importance.Max
).setDescription("notification channel of TAKEAT");
firebase.notifications().android.createChannel(channel);
*/
class App extends React.Component {
  static configureScene(route) {
    return route.animationType || Navigator.SceneConfigs.FloatFromRight;
  }
  static renderScene(route, navigator) {
    return (
      <Container>
      <route.Page route={route} navigator={navigator} />
      </Container>
    );
  }
  componentDidMount = async() => {
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      alert(JSON.stringify(notification.data, function(key, val) {
          if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                  return;
              }
              seen.push(val);
          }
          return val;
      }));
    } 
    const channel = new firebase.notifications.Android.Channel('takeat-channel', 'Takeat Channel', firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    try{
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        console.warn('1');
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    }catch(e){
      console.warn(e);
    }
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      console.warn('2');
      console.warn(notification);
      if(Platform.OS === 'android' ){

        notification.setNotificationId(notification._notificationId);
        notification.setTitle(notification._title);
        notification.setBody(notification._body);
        notification
        .android.setChannelId('takeat-channel')
        .android.setLargeIcon('ic_launcher')
        .android.setSmallIcon('ic_launcher')
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .setSound('default');

        firebase.notifications().displayNotification(notification);
        /*
        if(AppState.currentState=='background'||AppState.currentState=='inactive'){
        const COM = this;
        var pData = notification._data.data;
        console.warn(pData);
        if(pData){
          pData = JSON.parse(pData);
        }
        console.warn(pData);
        if(pData && pData.photoId && pData.userId){
          return cFetch(
            APIS.GET_PHOTO_WITH_FOOD,
            [
              pData.photoId,
              "user",
              pData.userId
            ],
            {},
            {
              responseProc: function(res) {
                console.warn(res);
                COM.navigator._navigation.navigate("Food", {food:res} )
              },
              responseNotFound: function(res) {
                console.warn(res);
                COM.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
              },
              responseError: function(e) {
                console.warn(e);
                COM.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
              },
            }
          );
        }
      }else{
        
        console.warn('11');
        
        notification.setNotificationId(notification._notificationId);
        notification.setTitle(notification._title);
        notification.setBody(notification._body);
        notification.android.setChannelId(notification._data.android_channel_id);
        //notification.android.setLargeIcon({icon:"ic_launcher"});
        //notification.android.setSmallIcon({});
        console.warn(notification);
        firebase.notifications().displayNotification(notification);
        
      }*/
      }
      if(Platform.OS === 'ios' ){
          notification.setSound('default');
          notification.ios.setBadge(0);
        firebase.notifications().displayNotification(notification);
      }
        
        
    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async(notificationOpen: NotificationOpen) => {
      console.warn('3');
      console.warn(notificationOpen);
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      //console.warn(notification);
      //console.warn(notification._data);
      const COM = this;
      var pData = notification._data;
      if(Platform.OS === 'android' ){
        pData = notification._data.data;
        if(pData){
          pData = JSON.parse(pData);
        }
      }
      console.warn(pData);
      if(pData && pData.photoId && pData.userId){
        return cFetch(
          APIS.GET_PHOTO_WITH_FOOD,
          [
            pData.photoId,
            "user",
            pData.userId
          ],
          {},
          {
            responseProc: function(res) {
              console.warn(res);
              COM.navigator._navigation.navigate("Food", {food:res, notificationId: notification._notificationId} )
            },
            responseNotFound: function(res) {
              console.warn(res);
              COM.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
            },
            responseError: function(e) {
              console.warn(e);
              COM.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
            },
          }
        );
      }else if(pData && pData.inbodyPhotoAcrossId){
        this.navigator._navigation.navigate("Graph");
      }else{
        this.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
      }
      var seen = [];
      /*
      alert(JSON.stringify(notification.data, function(key, val) {
          if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                  return;
              }
              seen.push(val);
          }
          return val;
      }));
      */
      //MainTabNavigator.navigation.navigate("Main")
      firebase.notifications().removeDeliveredNotification(notification.notificationId);

    });
  }
  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    try{
      this.notificationDisplayedListener();
      this.notificationListener();
      this.notificationOpenedListener();
    }catch(e){
      console.warn(e);
    }
  }

  handleBackButton() {
    return true;
}

  render() {
    return (
      <Provider store={createStore(reducers)}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <MainTabNavigator
            ref={nav => {
              this.navigator = nav;
            }}
          />
        </ThemeContext.Provider>
      </Provider>
    );
  }
}

export default App;
