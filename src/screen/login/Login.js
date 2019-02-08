import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text
} from "react-native";

import Images from "@assets/Images";
import firebase from "react-native-firebase";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin,statusCodes } from "react-native-google-signin";
import { SocialIcon } from "react-native-elements";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';

GoogleSignin.configure({
  webClientId:
    '850330784808-63uerqkqf44m25c84ard50adamjsmqu4.apps.googleusercontent.com',
});

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    IS_FROM_LOADING: state.REDUCER_CONSTANTS.isFromLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    setIsFromLogin: data => {
      dispatch(ActionCreator.setIsFromLogin(data));
    },
    setIsFromLoading: data => {
      dispatch(ActionCreator.setIsFromLoading(data));
    }
  };
}
class Login extends React.Component {
  LoadingComponent = this;
  constructor(props) {
    super(props);
  }

  // rerendering = async () => {
  //   this.props.setIsFromLogin(false);
  //   PROPS.navigation.navigate("Login");
  // }
  
  googleFnc = async () => {
    const resInfo = await this.googleSignIn();
    //console.log("Login.js(googleSignin): "+JSON.stringify(resInfo));
    if(resInfo) {await this.googleLogin(resInfo);}
    return;
  }

  googleSignIn = async () => {
    try {
      GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const resInfo = await GoogleSignin.signIn();
      resInfo.userNm = resInfo.user.name;
      resInfo.userEmail = resInfo.user.email;
      resInfo.userSnsPhoto = resInfo.user.photo;
      resInfo.hasSnsLogin = true;
      console.log('Loading.js: User Info(googlelogin) --> ', JSON.stringify(resInfo));
      this.props.setUserInfo(resInfo);
      return resInfo;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Loading.js: SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Loading.js: IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Loading.js: PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.log(error);
      }
      return;
    }
  };
  googleLogin = async (userInfo) => {
    try {
      console.log('Loading.js: '+JSON.stringify(userInfo));
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken,
        userInfo.accessToken
      );
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInWithCredential(credential);
      console.info("Loading.js(googleLogin) :"+JSON.stringify(currentUser.user.toJSON()));
      currentUser
      ? !isEmpty(this.props.USER_INFO) ? this.goLoading()
      : console.log('Loading.js: USER_INFO_IS_NULL')
      : alert("로그인이 실패하였습니다.");
    } catch (e) {
      console.log(e);
      return;
    }
  };

  facebookFnc = async () => {
    const resInfo = await this.facebookSignIn();
    console.log("Login.js(facebookSignin): "+JSON.stringify(resInfo));
    if(resInfo) {await this.facebookLogin(resInfo);}
    return;
  }

  facebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions([
        "public_profile",
        "email"
      ]);
      if (result.isCancelled) {
        console.log("Loading.js: User cancelled request"); // Handle this however fits the flow of your app
        return false;
      }
      console.log(
        `Loading.js: Login success with permissions: ${result.grantedPermissions.toString()}`
      );
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error(
          "Loading.js: Something went wrong obtaining the users access token"
        ); // Handle this however fits the flow of your app
      }else{
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  facebookLogin = async (data) => {
    try{
      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      // login with credential 
      const currentUser = await firebase
        .auth()
        .signInWithCredential(credential);
        console.log("Loading.js(fblogin) :"+JSON.stringify(currentUser.user.toJSON()));
        currentUser.userNm = currentUser.user.providerData[0].displayName;
        currentUser.userEmail = currentUser.user.providerData[0].email;
        currentUser.userSnsPhoto = currentUser.user.providerData[0].photoURL;
        if(currentUser.user.providerData[0].phoneNumber){
          currentUser.userPhone = currentUser.user.providerData[0].phoneNumber;
        }
        currentUser.hasSnsLogin = true;
      console.log('Loading.js: User Info(fblogin) --> ', currentUser);
      this.props.setUserInfo(currentUser);
      console.log("Loading.js: facebookLogin end");
      currentUser
        ? !isEmpty(this.props.USER_INFO) ? this.goLoading()
        : console.log('Loading.js: USER_INFO_IS_NULL')
        : alert("로그인이 실패하였습니다.");
    } catch (e) {
        console.log(e);
    } 
  }
  goLoading = () => {
    this.props.setIsFromLogin(true);
    this.props.navigation.navigate("Loading");
  }
  render() {
    /*
    if(this.props.isFocused&&this.props.IS_FROM_LOADING){
      this.rerendering();
    }
    */
    const content = (
      <ImageBackground
        source={Images.loginBack}
        style={styles.container}
      >
      <View
        style={[
          styles.rowContainer,
          {
            width:"100%",
            borderWidth: 0,
            backgroundColor: "rgba(255,255,255,0)",
            borderRadius: 10,
            padding: 20

          }
        ]}
      >
        <View
          style={[
            styles.button,
            {
              borderBottomWidth: 0,
              borderBottomColor: "#4b4d5b",
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 10
            }
          ]}
        >
          <Text
            style={{
              color: "#4b4d5b",
              fontFamily: "NotoSans-Regular",
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 30,
              fontSize: 16,
              textShadowColor: "rgba(0,0,0,0.1)",
              textShadowRadius: 10
            }}
          >
            {/*로그인*/}
          </Text>
        </View>
        <View style={styles.button}>
          <SocialIcon
            title="페이스북으로 로그인하기"
            button
            type="facebook"
            onPress={this.facebookFnc}
            onLongPress={this.facebookFnc}
            style={{borderRadius: 0,padding: 20}}
          />
        </View>
        <View style={styles.button}>
          <SocialIcon
            title="구글계정으로 로그인하기"
            button
            type="google-plus-official"
            onPress={this.googleFnc}
            onLongPress={this.googleFnc}
            style={{borderRadius: 0,padding: 20}}
          />
        </View>
          <Text style={{paddingTop:40, paddingLeft: 20, paddingRight:20, color:"white", textAlign:"center"}}>이 앱을 통한 어떠한 사진 및 동영상도{"\n"}당신의 허락 없이 타인에게 공개되지 않습니다.</Text>
          {/*
        <Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>
        <Text>{this.props.IS_FROM_LOADING ? 'formLoading' : 'Not formLoading'}</Text>
          */}
      </View>
      </ImageBackground>
    );
    return content;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  rowContainer: {
    margin: 8,
    //flexDirection: "row",
    justifyContent: "center"
  },
  button: {
    marginHorizontal: 8
    // margin: 10
    ,paddingTop:10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(withNavigationFocus(Login));
