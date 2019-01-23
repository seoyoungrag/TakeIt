import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Alert,
  Linking,
  PixelRatio
} from "react-native";

import Images from "@assets/Images";
import firebase from "react-native-firebase";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import VersionCheck from "react-native-version-check";
import { withNavigationFocus } from 'react-navigation';

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    CODE: state.REDUCER_CODE.code
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    setCode: data => {
      dispatch(ActionCreator.setCode(data));
    },
  };
}
const res = data => {
  for (let key in data) {
    console.log(`${key}: ${data[key]}`);
  }
};
var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.authProc = this.authProc.bind(this);
    this.exitApp = this.exitApp.bind(this);
    this.checkPushToken = this.checkPushToken.bind(this);
    this.getCode = this.getCode.bind(this);
    /*this.catchErr = this.catchErr.bind(this);*/
  }
  componentDidMount() {
    if (__DEV__) {
      this.authProc();
    }else{
      VersionCheck.needUpdate().then(async res => {
        if (res && res.isNeeded) {
          versionCheck();
        } else {
          this.authProc();
        }
      });
    }
  }
  exitApp() {
    // BackHandler.exitApp();
  }
  async versionCheck() {
    let url = await VersionCheck.getStoreUrl();
    Alert.alert(
      "업데이트가 필요합니다.",
      "업데이트를 하지 않으면 앱을 정상적으로 이용할 수 없습니다.\n업데이트를 시작 하시겠습니까?",
      [
        {
          text: "아니오",
          onPress: () => this.exitApp(),
          style: "cancel"
        },
        {
          text: "네",
          onPress: () => {
            Linking.openURL(url);
          }
        }
      ],
      { cancelable: false }
    );
  }
  
  catchErr(e) {
    let message = "에러가 발생했습니다.";
    if (e && (e.code || e.type || e.status || e.message || e.name)) {
      message += e.code ? "\nCODE: " + e.code : "";
      message += e.type ? "\nTYPE: " + e.type : "";
      message += e.status ? "\nCODE: " + e.status : "";
      message += e.message
        ? "\nMESSAGE: " +
          (e.code && e.code == "404" ? "페이지를 찾을 수 없습니다." : e.message)
        : "";
      message += e.name ? "\nNAME: " + e.name : "";
    } else if (e.notEnough) {
      message = "등록되지 않은 정보가 있습니다.";
    } else if (e.notReg) {
      message = "처음 방문 하셨군요.";
    } else {
      message += "\n 정의되지 않은 오류입니다.";
      message += "\n" + JSON.stringify(e);
    }
    console.log(JSON.stringify(e));
    if (e.message && e.message.indexOf("Network") > -1) {
    } else {
      alert(message);
    }
    //return Promise.reject(e);
  }
  
  checkPushToken() {
    return new Promise(function(resolve, reject) {
      const messaging = firebase.messaging();
      let pushToken = "";
      messaging.hasPermission().then(enabled => {
        console.log("push perm check start");
        if (enabled) {
          messaging
            .getToken()
            .then(token => {
              if (token) {
                console.log("user has permissions: ", token);
                resolve(token);
              } else {
                console.log("no token yet");
              }
            })
            .catch(error =>
              console.log("have permission, but failed to get token:", error)
            );
        } else {
          console.log("user doesnt have permission");
          messaging
            .requestPermission()
            .then(() => {
              messaging
                .getToken()
                .then(token => {
                  console.log("requested permission, WHAT TOKEN: ", token);
                  if (token) {
                    console.log("user has permissions: ", token);
                    return token;
                  } else {
                    console.log("no token yet");
                  }
                })
                .catch(error =>
                  console.log(
                    "have permission, but failed to get token:",
                    error
                  )
                );
            })
            .catch(error => {
              console.log("User has rejected permissions: ", error);
            });
        }
      });
    });
  }

  getCode() {
    const PROPS = this.props;
    return new Promise(function(resolve, reject) {
      cFetch(
        APIS.GET_CODE,
        [],
        {},
        {
          responseProc: function(res) {
            PROPS.setCode(res.list ? res.list : res);
          }
        }
      );
      resolve();
    });
  }

  authProc() {
    console.log("authProc in Loading.js start");
    const COM = this;
    const PROPS = this.props;
    let userInfo = {};
    let providerId = "";
    let SNSEmailOrUid = "";
    let pushToken = "";

    firebase.auth().onAuthStateChanged(user => {
      console.log("firebase auth check start");
      if (user) {
        // console.log(user);
        //providerID를 가져온다. 페이스북이냐 구글이냐
        if (user && user.providerData && user.providerData.length > 0) {
          providerId = user.providerData[0].providerId;
        }
        //email이 없는 경우 uid를 가져온다.. 처음부터 uid를 가져올걸 그랬나
        SNSEmailOrUid = user.email
          ? user.email
          : user.providerData[0].email
            ? user.providerData[0].email
            : user.providerData[0].uid;
        //구글이냐 페이스북이냐에 따라
        if (providerId.indexOf("google.com") > -1) {
          userInfo.userEmailGmail = SNSEmailOrUid;
        } else {
          userInfo.userEmailFacebook = SNSEmailOrUid;
        }
        userInfo.userEmail = SNSEmailOrUid;
        userInfo.id = SNSEmailOrUid; //기본은 email, 전화번호로 로그인한 경우에는 providerData의 uid가 입력된다.
        console.log(
          " user.email: " + user.email,
          " user.providerData[0].email id: " + user.providerData[0].email,
          " user.providerData[0].uid id: " + user.providerData[0].uid,
          " using for id: " + SNSEmailOrUid
        );
        console.log("firebase auth check end");
        Promise.resolve()
          .then(this.checkPushToken)
          .then(token => {
            console.log("pushToken: " + token);
            console.log("push perm check end");
            userInfo.pushToken = token;
            pushToken = token;
          })
          .then(this.getCode)
          .then(
            cFetch(
              APIS.GET_USER_BY_EMAIL,
              [SNSEmailOrUid],
              {},
              {
                responseProc: function(res) {
                  userInfo = Object.assign(
                    JSON.parse(JSON.stringify(userInfo)),
                    res
                  );
                  userInfo.pushToken = pushToken;
                  console.log("for update token");
                  console.log(userInfo);
                  PROPS.setUserInfo(userInfo);
                  if (res.userNm == null || res.userSex == null|| res.userEmail == null|| res.userHeight == null|| res.userWeight == null) {
                    PROPS.navigation.navigate("Regist", {
                      callBack: () => {
                        console.log("occured callback to Login in Loading.js");
                        PROPS.navigation.navigate("Login", {
                          callBack: () => {
                            return false;
                          }
                        });
                      },
                      refreshFnc: COM.authProc
                    });
                  } else {
                    var body = JSON.stringify(userInfo);
                    cFetch(APIS.PUT_USER_BY_EMAIL, [userInfo.userEmail], body, {
                      responseProc: function(res) {
                        console.log(
                          "pushToken saved in loading.js start- put method response:"
                        );
                        console.log(res);
                        console.log("-pushToken saved in loading.js end");
                      },
                      //입력된 회원정보가 없음.
                      responseNotFound: function(res) {
                        console.log(
                          "failed pushToken saved in loading.js start- put method response:"
                        );
                        console.log(res);
                        console.log(
                          "-failed pushToken saved in loading.js end"
                        );
                      }
                    });
                    if (
                      COM.props.navigation.state.params &&
                      COM.props.navigation.state.params.refreshFnc
                    ) {
                      COM.props.navigation.state.params.refreshFnc();
                    }
                    console.log("go Main in Loading.js");
                    PROPS.navigation.navigate("Main", {
                      callBack: () => {
                        COM.authProc();
                      }
                    });
                  }
                },
                responseNotFound: function(res) {
                  console.log("occured 404 getUser by email in Loading.js");
                  PROPS.setUserInfo(userInfo);
                  PROPS.navigation.navigate("Regist", {
                    userStep: "regist",
                    callBack: () => {
                      console.log("occured callback to Login in Loading.js");
                      PROPS.navigation.navigate("Login", {
                        callBack: () => {
                          return false;
                        }
                      });
                    },
                    refreshFnc: COM.authProc
                  });
                }
              }
            )
          )
          .then();
      } else {
        PROPS.navigation.navigate("Login", {
          callBack: () => {
            return false;
          }
        });
      }
    });
    console.log("authProc in Loading.js end");
  }
  render() {
    if(this.props.isFocused){
      this.authProc();
    }
    return (
      <ImageBackground
        source={Images.loginLoadingBack}
        style={styles.container}
      >
      <View
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          borderColor: "silver",
          borderWidth: 0,
          borderRadius: 10,
          elevation: 0
        }}
      >
        <Text style={{ color: "black", fontSize:FONT_BACK_LABEL, 
                  fontFamily: "NotoSans-Regular",margin:10}}>사용자 정보를 확인중입니다.</Text>
        {/*<Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>*/}
        <ActivityIndicator color="black" size="large" />
      </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Loading));
