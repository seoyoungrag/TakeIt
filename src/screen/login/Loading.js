import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Alert,
  Linking,
  PixelRatio,
  Dimensions
} from "react-native";

import Images from "@assets/Images";
import firebase from "react-native-firebase";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import VersionCheck from "react-native-version-check";
import { withNavigationFocus } from 'react-navigation';

const {width, height} = Dimensions.get("window");

function mapStateToProps(state) {
  return {
    IS_FROM_LOGIN: state.REDUCER_CONSTANTS.isFromLogin,
    USER_INFO: state.REDUCER_USER.user,
    CODE: state.REDUCER_CODE.code,
    IS_FROM_LOADING: state.REDUCER_CONSTANTS.isFromLoading
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
    setIsFromLogin: data => {
      dispatch(ActionCreator.setIsFromLogin(data));
    },
    setIsFromLoading: data => {
      dispatch(ActionCreator.setIsFromLoading(data));
    }
  };
}
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
  
  checkPushToken = async () => {
      const enabled = await firebase.messaging().hasPermission();
        console.log("loading.js: push perm check start");
        if (enabled) {
          try{
            const token = await firebase.messaging().getToken()
            if (token) {
              console.log("loading.js: user has permissions: ", token);
              return token;
            } else {
              console.log("loading.js: no token yet");
            }
          }catch(error){
          console.log("loading.js: have permission, but failed to get token:", error)
          };
        } else {
          console.log("loading.js: user doesnt have permission");
          await firebase.messaging().requestPermission();
          const token = await firebase.messaging().getToken();
          console.log("loading.js: requested permission, WHAT TOKEN: ", token);
          if (token) {
            console.log("loading.js: user has permissions: ", token);
            return token;
          } else {
            console.log("loading.js: no token yet");
          }
        }
    }

  getCode () {
    const PROPS = this.props;
    cFetch(
      APIS.GET_CODE,
      [],
      {},
      {
        responseProc: async (res) => {
          PROPS.setCode(res.list ? res.list : res);
        }
      }
    );
  }

  authProc = async () => {
    console.log("loading.js: authProc in Loading.js start");
    console.log("loading.js: isFocused");
    console.log(this.props.isFocused);
    if(this.props.isFocused){
      const PROPS = this.props;
      let userInfo = PROPS.USER_INFO;
      console.log("Loading.js: "+JSON.stringify(userInfo));
      let providerId = "";
      let SNSEmailOrUid = "";
      let pushToken = "";

      await firebase.auth().onAuthStateChanged(user => {
        console.log("loading.js: firebase auth check start"+Date.now()); //원래 여러번 호출된다고 한다. https://stackoverflow.com/questions/37673616/firebase-android-onauthstatechanged-called-twice
        if (user) {
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
          console.log("loading.js: firebase auth check end");
        } else {
          PROPS.setIsFromLogin(false);
          //PROPS.setIsFromLoading(true);
          PROPS.navigation.navigate("Login");
        }
      });
      var token = await this.checkPushToken();
      console.log("loading.js: pushToken: " + token);
      console.log("loading.js: push perm check end");
      userInfo.pushToken = token;
      pushToken = token;

      await this.getCode();

      await cFetch(
        APIS.GET_USER_BY_EMAIL,
        [SNSEmailOrUid],
        {},
        {
          responseProc: async (res) =>  {
            userInfo = Object.assign(
              JSON.parse(JSON.stringify(userInfo)),
              res
            );
            userInfo.pushToken = pushToken;
            console.log("loading.js: for update token AFTER GET_USER_BY_EMAIL");
            console.log("loading.js: userInfo AFTER GET_USER_BY_EMAIL: "+JSON.stringify(userInfo));
            if (res.userNm == null){ // 이름은 필수 값, 한번도 이름 저장 안한 사람은 로그인부터 해서 이름값 가져오도록 한다.
              PROPS.setIsFromLogin(false);
              //PROPS.setIsFromLoading(true);
              PROPS.navigation.navigate("Login");
            }else if(res.userSex == null|| res.userEmail == null|| res.userHeight == null|| res.userWeight == null) {
              PROPS.setIsFromLogin(false);
              PROPS.navigation.navigate("Regist");
            } else {
              var body = JSON.stringify(userInfo);
              await cFetch(APIS.PUT_USER_BY_EMAIL, [userInfo.userEmail], body, {
                responseProc: function(res) {
                  console.log(
                    "loading.js: pushToken saved in loading.js start- put method response:"
                  );
                  console.log(res);
                  PROPS.setUserInfo(res);
                  console.log("loading.js: -pushToken saved in loading.js end");
                },
                //입력된 회원정보가 없음.
                responseNotFound: function(res) {
                  console.log(
                    "loading.js: failed pushToken saved in loading.js start- put method response:"
                  );
                  console.log(res);
                  console.log(
                    "loading.js: -failed pushToken saved in loading.js end"
                  );
                }
              });
              console.log("loading.js: go Main in Loading.js");
              PROPS.setIsFromLogin(false);
              PROPS.navigation.navigate("Main");
            }
          },
          responseNotFound: function(res) {
            console.log("loading.js: occured 404 getUser by email in Loading.js");
            console.log("loading.js: userInfo AFTER GET_USER_BY_EMAIL: "+JSON.stringify(userInfo));
            PROPS.setUserInfo(userInfo);
            if (userInfo.userNm == null){ // 이름은 필수 값, 한번도 이름 저장 안한 사람은 로그인부터 해서 이름값 가져오도록 한다.
              PROPS.setIsFromLogin(false);
              //PROPS.setIsFromLoading(true);
              PROPS.navigation.navigate("Login");
            }else if(userInfo.userSex == null|| userInfo.userEmail == null|| userInfo.userHeight == null|| userInfo.userWeight == null) {
              PROPS.setIsFromLogin(false);
              PROPS.navigation.navigate("Regist");
            }
          }
        }
      )
    }
    console.log("loading.js: authProc in Loading.js end");
  }
  render() {
    if(this.props.isFocused&&this.props.IS_FROM_LOGIN){
      //this.props.setIsFromLogin(false); //state 트랜지션 중엔 update할 수 없다. 
      this.authProc();
    }
    return (
      <ImageBackground
        source={Images.loginLoadingBack}
        style={styles.container}
      >
      <View style={{position:"absolute",top:0,left:0,width:width,height:height,backgroundColor:'rgba(0,0,0,0.5)',zIndex:0}}/>
        <ActivityIndicator color="white" size="large" />
        <Text style={{ color: "white", fontSize:FONT_BACK_LABEL*1.5, 
                  fontFamily: "NotoSans-Regular",margin:10, marginTop:height/4}}>잠시만 기다려 주세요.</Text>
        {/*<Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>
        <Text>{this.props.IS_FROM_LOGIN ? 'formLogin' : 'Not fromLogin'}</Text>*/}
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
