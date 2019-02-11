/**
 *
 * @format
 * @flow
 */
import React from 'react';

import { NativeModules, BackHandler} from 'react-native';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import Container from '@container/Container';
import MainTabNavigator from '@common/Routes';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '@redux-yrseo/reducers';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

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
  "찍먹",
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        console.log('User enabled authorised firebase.messaging');
      } else {
        firebase.messaging().requestPermission()
        .then(() => {
          console.log('User has authorised firebase.messaging');
        })
        .catch(error => {
          console.log('User has rejected permissions firebase.messaging');
          console.log(error);
        });
      }
    });
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.warn(notificationOpen);
        const action = notificationOpen.action;
        const notification: Notification = notificationOpen.notification;
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
    } 
    const channel = new firebase.notifications.Android.Channel('takeat-channel', 'Takeat Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
// Create the channel
    firebase.notifications().android.createChannel(channel);
    try{
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    }catch(e){
      console.warn(e);
    }
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      console.warn(notification._notificationId);
      this.navigator._navigation.navigate("Main", { notificationId: notification._notificationId});
      //MainTabNavigator.navigation.navigate("Main")
      // Process your notification as required
      /*
      notification
        .android.setChannelId('test-channel')
        .android.setSmallIcon('ic_launcher')
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .setSound('default')
      firebase.notifications()
        .displayNotification(notification)
        */
        
    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      console.warn(notificationOpen);
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
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
