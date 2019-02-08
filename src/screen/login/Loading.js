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
import {AsyncStorage} from 'react-native';
import Moment from "moment";

const {width, height} = Dimensions.get("window");

function mapStateToProps(state) {
  return {
    IS_FROM_LOGIN: state.REDUCER_CONSTANTS.isFromLogin,
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTimestamp: timestamp => {
      dispatch(ActionCreator.setTimestamp(timestamp));
    },
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
var FONT_BACK_LABEL = 16;
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
        //console.log("loading.js: push perm check start");
        if (enabled) {
          try{
            const token = await firebase.messaging().getToken()
            if (token) {
              //console.log("loading.js: user has permissions: ", token);
              return token;
            } else {
              //console.log("loading.js: no token yet");
            }
          }catch(error){
          console.log("loading.js: have permission, but failed to get token:", error)
          };
        } else {
          //console.log("loading.js: user doesnt have permission");
          await firebase.messaging().requestPermission();
          const token = await firebase.messaging().getToken();
          //console.log("loading.js: requested permission, WHAT TOKEN: ", token);
          if (token) {
            //console.log("loading.js: user has permissions: ", token);
            return token;
          } else {
            console.log("loading.js: no token yet");
          }
        }
    }
  getSystemTimestamp = async () => {
    var serverTimestamp;
    await cFetch(
      APIS.GET_SERVER_TIMESTMAP,
      [],
      {},
      {
        responseProc: async (res) => {
          serverTimestamp = res;
        }
      }
    );
    this.props.setTimestamp(serverTimestamp);
    return serverTimestamp;
  }
  checkCacheValid(PROP, CHECKMAP, type){
    console.log("Loading.js cache check start");
    console.log(PROP);
    console.log(CHECKMAP);
    console.log(type);
    console.log("Loading.js cache check end");
    return (!PROP || (PROP && PROP.length ==0) || (PROP && PROP.length>0 && (Math.abs(PROP.timestamp - CHECKMAP.timestamp)> type=="CODE" ? CHECKMAP.code : 60000 )) )
  }
  getCode = async (CHECKMAP) => {
    var code;
    const CODE = await AsyncStorage.getItem("@CODE");
    const jsonCode = JSON.parse(CODE);
    if(jsonCode&&!jsonCode.timestamp){
      await AsyncStorage.removeItem("@CODE");
    }
    if(!this.checkCacheValid(jsonCode, CHECKMAP, "CODE")){
      console.log("CODE cache remained, CHECKMAP: "+JSON.stringify(CHECKMAP));
      return;
    }
    await cFetch(
      APIS.GET_CODE, [], {},
      {
        responseProc: async (res) => {
          code = res;
        }
      }
    );

    this.props.setCode(code);
    const strCode = JSON.stringify(code);
    await AsyncStorage.setItem('@CODE', strCode )
    .then( ()=>{
    console.log('It was saved successfully')
    } )
    .catch( ()=>{
    console.log('There was an error saving the product')
    } )
  }

  authProc = async () => {
    const CHECKMAP = await this.getSystemTimestamp();
    //console.log("loading.js: authProc in Loading.js start");
    //console.log(CHECKMAP);
    /*console.log("loading.js: isFocused");
    console.log(this.props.isFocused);
    */
    if(this.props.isFocused){
      const PROPS = this.props;
      let userInfo = PROPS.USER_INFO;
      //console.log("Loading.js: "+JSON.stringify(userInfo));
      let providerId = "";
      let SNSEmailOrUid = "";
      let pushToken = "";

      await firebase.auth().onAuthStateChanged(async(user) => {
        //console.log("loading.js: firebase auth check start"+Date.now()); //원래 여러번 호출된다고 한다. https://stackoverflow.com/questions/37673616/firebase-android-onauthstatechanged-called-twice
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
          //console.log("loading.js: firebase auth check end");
          //sns 인증만하고 회원가입정보 입력하지 않은 사용자가 다시 앱을 켰을 때 아래 정보들이 빠져 있음.
          userInfo.userNm = user.providerData[0].displayName;
          userInfo.userSnsPhoto = user.providerData[0].photoURL;
          if(user.providerData[0].phoneNumber){
            userInfo.userPhone = user.providerData[0].phoneNumber;
          }
      var token = await this.checkPushToken();
      //console.log("loading.js: pushToken: " + token);
      //console.log("loading.js: push perm check end");
      userInfo.pushToken = token;
      pushToken = token;

      await this.getCode(CHECKMAP);
      
      await cFetch(
        APIS.GET_USER_BY_EMAIL,
        [SNSEmailOrUid+"/"],
        {},
        {
          responseProc: async (res) =>  {
            userInfo = Object.assign(
              JSON.parse(JSON.stringify(userInfo)),
              res
            );
            console.warn('userNm is Merging? :');
            console.warn(userInfo);
            userInfo.pushToken = pushToken;
            //console.log("loading.js: for update token AFTER GET_USER_BY_EMAIL");
            //console.log("loading.js: userInfo AFTER GET_USER_BY_EMAIL: "+JSON.stringify(userInfo));
            if (res.userNm == null){ // 이름은 필수 값, 한번도 이름 저장 안한 사람은 로그인부터 해서 이름값 가져오도록 한다.
              PROPS.setIsFromLogin(false);
              //PROPS.setIsFromLoading(true);
              PROPS.navigation.navigate("Login");
            }else if(res.userSex == null|| res.userEmail == null|| res.userHeight == null|| res.userWeight == null|| res.userAgeRange == null) {
              PROPS.setIsFromLogin(false);
              PROPS.navigation.navigate("Regist");
            } else {

              var yesterDay = new Date();
              yesterDay.setDate(yesterDay.getDate() - 1);
              var dayBeforeYesterday = new Date();
              dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

              const viewAdKey0 = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
              const foodStorKey0 = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
              const inbodyStorKey0 = "@"+Moment(new Date()).format('YYMMDD')+"INBODY";
              const viewAdKey1 = "@"+Moment(yesterDay).format('YYMMDD')+"viewAD";
              const foodStorKey1 = "@"+Moment(yesterDay).format('YYMMDD')+"FOOD";
              const inbodyStorKey1 = "@"+Moment(yesterDay).format('YYMMDD')+"INBODY";
              const viewAdKey2 = "@"+Moment(dayBeforeYesterday).format('YYMMDD')+"viewAD";
              const foodStorKey2 = "@"+Moment(dayBeforeYesterday).format('YYMMDD')+"FOOD";
              const inbodyStorKey2 = "@"+Moment(dayBeforeYesterday).format('YYMMDD')+"INBODY";

              var viewAd0 = await AsyncStorage.getItem(viewAdKey0);
              var food0 = await AsyncStorage.getItem(foodStorKey0);
              var inbody0 = await AsyncStorage.getItem(inbodyStorKey0);
              var viewAd1 = await AsyncStorage.getItem(viewAdKey1);
              var food1 = await AsyncStorage.getItem(foodStorKey1);
              var inbody1 = await AsyncStorage.getItem(inbodyStorKey1);
              var viewAd2 = await AsyncStorage.getItem(viewAdKey2);
              var food2 = await AsyncStorage.getItem(foodStorKey2);
              var inbody2 = await AsyncStorage.getItem(inbodyStorKey2);

              var cntViewAd0 = viewAd0?Number(viewAd0):0;
              var cntViewAd1 = viewAd1?Number(viewAd1):0;
              var cntViewAd2 = viewAd2?Number(viewAd2):0;
              var cntFood0 = food0?Number(food0):0;
              var cntFood1 = food1?Number(food1):0;
              var cntFood2 = food2?Number(food2):0;
              var cntInbody0 = inbody0?Number(inbody0):0;
              var cntInbody1 = inbody1?Number(inbody1):0;
              var cntInbody2 = inbody2?Number(inbody2):0;
              userActCntLogList =[
                {userId:userInfo.userId, storeKey:viewAdKey0, cnt:cntViewAd0},
                {userId:userInfo.userId, storeKey:foodStorKey0, cnt:cntFood0},
                {userId:userInfo.userId, storeKey:inbodyStorKey0, cnt:cntInbody0},
                {userId:userInfo.userId, storeKey:viewAdKey1, cnt:cntViewAd1},
                {userId:userInfo.userId, storeKey:foodStorKey1, cnt:cntFood1},
                {userId:userInfo.userId, storeKey:inbodyStorKey1, cnt:cntInbody1},
                {userId:userInfo.userId, storeKey:viewAdKey2, cnt:cntViewAd2},
                {userId:userInfo.userId, storeKey:foodStorKey2, cnt:cntFood2},
                {userId:userInfo.userId, storeKey:inbodyStorKey2, cnt:cntInbody2},
              ]

              newUserActCntLogList =[
                {userId:userInfo.userId, refDate:String(Moment(new Date()).format('YYYYMMDD')), foodUpCnt: cntFood0, inbodyUpCnt: cntInbody0, adViewCnt: cntViewAd0},
                {userId:userInfo.userId, refDate:String(Moment(yesterDay).format('YYYYMMDD')), foodUpCnt: cntFood1, inbodyUpCnt: cntInbody1, adViewCnt: cntViewAd1},
                {userId:userInfo.userId, refDate:String(Moment(dayBeforeYesterday).format('YYYYMMDD')), foodUpCnt: cntFood2, inbodyUpCnt: cntInbody2, adViewCnt: cntViewAd2}
              ]

              userInfo.userActCntLogList = userActCntLogList;
              userInfo.newUserActCntLogList = newUserActCntLogList;
              
              var body = JSON.stringify(userInfo);

              await cFetch(APIS.PUT_USER_BY_EMAIL, [userInfo.userEmail+"/"], body, {
                responseProc: function(res) {
                  //console.log( "loading.js: pushToken saved in loading.js start- put method response:" );
                  //console.log(res);
                  PROPS.setUserInfo(res);
                  //console.log("loading.js: -pushToken saved in loading.js end");
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
              //console.log("loading.js: go Main in Loading.js");
              PROPS.setIsFromLogin(false);
              PROPS.navigation.navigate("Main");
            }
          },
          responseNotFound: function(res) {
            console.log("loading.js: occured 404 getUser by email in Loading.js");
            console.log("loading.js: userInfo AFTER GET_USER_BY_EMAIL: "+JSON.stringify(userInfo));
            PROPS.setUserInfo(userInfo);
            if (userInfo.userNm == null){ // 이름은 필수 값, 한번도 이름 저장 안한 사람은 로그인부터 해서 이름값 가져오도록 한다.
              //PROPS.setIsFromLogin(false);
              //PROPS.setIsFromLoading(true);
              //PROPS.navigation.navigate("Login");
            }else if(userInfo.userSex == null|| userInfo.userEmail == null|| userInfo.userHeight == null|| userInfo.userWeight == null) {
              //PROPS.setIsFromLogin(false);
              //PROPS.navigation.navigate("Regist");
            }
            PROPS.setIsFromLogin(false);
            PROPS.navigation.navigate("Regist");
          }
        }
      )
    } else {
        //console.log('firebase user null');
        PROPS.setIsFromLogin(false);
        //PROPS.setIsFromLoading(true);
        PROPS.navigation.navigate("Login");
      }
    });
    }
    //console.log("loading.js: authProc in Loading.js end");
  }
  render() {
    COM = this;
    setTimeout(function(){
      if(COM.props.isFocused&&COM.props.IS_FROM_LOGIN){
        //this.props.setIsFromLogin(false); //state 트랜지션 중엔 update할 수 없다. 
        COM.authProc(); 
      }
    }, 1000);
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
