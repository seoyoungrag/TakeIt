import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text
} from "react-native";

import Images from "@assets/Images";
import firebase from "react-native-firebase";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin,statusCodes } from "react-native-google-signin";
import { SocialIcon } from "react-native-elements";

import DrawerWrapped from "@drawer";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
const { width, height } = Dimensions.get("window");

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    }
  };
}
class Login extends React.Component {
  LoadingComponent = this;
  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '1054963004334-2dtvq3rdi93u85er7gnh12v9vt2j3jl3.apps.googleusercontent.com',
    });
  }
  googleFnc = async () => {
    this.googleSignIn().then(this.googleLogin);
  }
  googleSignIn = async () => {
    try {
      GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      this.setState({ userInfo: userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.log(error);
      }
    }
  };
  googleLogin = async () => {
    try {
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(
        this.state.userInfo.idToken,
        this.state.userInfo.accessToken
      );
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInWithCredential(credential);

      console.info(JSON.stringify(currentUser.user.toJSON()));
      currentUser
      ? this.props.navigation.navigate('Loading')
      : alert("로그인이 실패하였습니다.");
    } catch (e) {
      console.error(e);
    }
  };
  facebookLogin = async () => {

    try {
      const result = await LoginManager.logInWithReadPermissions([
        "public_profile",
        "email"
      ]);
      if (result.isCancelled) {
        console.log("User cancelled request"); // Handle this however fits the flow of your app
        return false;
      }
      console.log(
        `Login success with permissions: ${result.grantedPermissions.toString()}`
      );
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error(
          "Something went wrong obtaining the users access token"
        ); // Handle this however fits the flow of your app
      }
      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInWithCredential(credential);
      console.info(JSON.stringify(currentUser.user.toJSON()));

      if (!currentUser) {
        console.info(JSON.stringify(currentUser.user.toJSON()));
      }

      console.log("facebookLogin end");
      currentUser
        ? this.props.navigation.navigate("Loading")
        : alert("로그인이 실패하였습니다.");
    } catch (e) {
      console.error(e);
    }
    
  };
  retry = async () =>{
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log(isSignedIn);
      if(isSignedIn){
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        this.setState({ userInfo: null }); 
      }
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    if(this.props.isFocused){
      this.retry();
    }
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
            elevation: 0,
            
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
            onPress={this.facebookLogin}
            onLongPress={this.facebookLogin}
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
          <Text style={{paddingTop:40, paddingLeft: 20, paddingRight:20, color:"white", textAlign:"center"}}>이 앱을 통한 어떠한 사진 및 동영상도{"\n"}당신의 허락 없이 타인에게 공개되지 않습니다.</Text>
          
        </View>
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
