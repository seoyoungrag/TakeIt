import React from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert, PermissionsAndroid, AsyncStorage, Platform
} from "react-native";
import Permissions from 'react-native-permissions'
import Images from "@assets/Images";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
import {BoxShadow} from 'react-native-shadow'
import { COLOR } from 'react-native-material-ui';
import firebase from 'react-native-firebase';
import Moment from "moment";

const AdMobRewarded = firebase.admob().rewarded('ca-app-pub-3705279151918090/3468709592');
const AdMobInterstitial = firebase.admob().interstitial('ca-app-pub-3705279151918090/4058315659');
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const { height, width } = Dimensions.get("window");
let styles = {
  footerIcon: {
    height: height * 0.038*0.69,
    resizeMode: "contain"
  },
  footerText: {
    height: height * 0.019*0.69,
    resizeMode: "contain",
    marginTop:height * 0.015*0.69
  },
  footerIconContainer: { 
    width:width/5, 
    alignItems: "center",
    marginTop:height * 0.03*0.69, 
    marginBottom: height * 0.03*0.69
}
};
async function requestGpsPermission() {
  var isGranted = false;
  try {
    if(Platform.OS === 'ios' ){
      const check = await Permissions.check('location')
      console.log("check is one of: 'authorized', 'denied', 'restricted', or 'undetermined'");
      console.log(check);
      if(check!='authorized'){
        console.log('request permission');
        const GRANTED = await Permissions.request('location');
        console.log('GRANTED');
        console.log(GRANTED);
        if(GRANTED=='authorized'){
          isGranted = true;
        }else{
          isGranted = false;
        }
      }else{
        isGranted = true;
      }
    }else{
      const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if(!check){
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'GPS 권한 필요',
            'message': '음식 사진의 위치 정보 제공을 위해 필요합니다.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          isGranted = true;
          //console.log("You can use the ACCESS_FINE_LOCATION")
        } else {
          isGranted = false;
          //console.log("ACCESS_FINE_LOCATION permission denied")
        }
      }else{
        isGranted = true;
      }
  }
  } catch (err) {
    console.warn(err)
  }
  return isGranted;
}

async function requestCameraPermission(){
  var isGranted = false;
  try {
    if(Platform.OS === 'ios' ){
      const check = await Permissions.check('camera')
      //console.log("check is one of: 'authorized', 'denied', 'restricted', or 'undetermined'");
      //console.log(check);
      if(check!='authorized'){
        //console.log('request permission');
        const GRANTED = await Permissions.request('camera');
        console.log('GRANTED');
        console.log(GRANTED);
        if(GRANTED=='authorized'){
          isGranted = true;
        }else{
          isGranted = false;
        }
      }else{
        isGranted = true;
      }
    }else{
      const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if(!check){
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            'title': '카메라 권한 필요',
            'message': '음식 사진을 찍기 위해 카메라 권한이 필요합니다.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          isGranted = true;
          //console.log("You can use the CAMERA")
        } else {
          isGranted = false;
          //console.log("CAMERA permission denied")
        }
      }else{
        isGranted = true;
      }
    }
  } catch (err) {
    console.warn(err)
  }
  return isGranted;
}

function mapStateToProps(state) {
  return {
    TIMESTAMP: state.REDUCER_CONSTANTS.timestamp,
    ACTIVE_BTN : state.REDUCER_CONSTANTS.activeFooterBtn,
    FORCE_REFRESH_MAIN : state.REDUCER_CONSTANTS.forceRefreshMain
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveFooterBtn: activeFooterBtn => {
      dispatch(ActionCreator.setActiveFooterBtn(activeFooterBtn));
    },
    forceRefreshMain: isForce => {
      dispatch(ActionCreator.forceRefreshMain(isForce));
    }
  };
}
class Footer extends React.Component {
  state = {
    //activeButton: this.props.ACTIVE_BTN
  }
  componentDidMount(){
    AdMobInterstitial.loadAd(request.build());
    AdMobInterstitial.on('onAdLoaded',
      () => console.log('AdMobInterstitial adLoaded')
    );
    AdMobInterstitial.on('onAdFailedToLoad',
      (error) => console.warn(error)
    );
    AdMobInterstitial.on('onAdOpened',
      () => console.log('AdMobInterstitial => adOpened')
    );
    AdMobInterstitial.on('onAdClosed',
      () => {
        console.log('AdMobInterstitial => adClosed');
      }
    );
    AdMobInterstitial.on('onAdLeftApplication',
      () => console.log('AdMobInterstitial => adLeftApplication')
    );

    AdMobRewarded.loadAd(request.build());
    AdMobRewarded.on('onAdLoaded',
      () => console.log('AdMobRewarded => adLoaded')
    );
    AdMobRewarded.on('onAdFailedToLoad',
      (error) => console.warn(error)
    );
    AdMobRewarded.on('onAdOpened',
      () => console.log('AdMobRewarded => adOpened')
    );
    AdMobRewarded.on('onRewardedVideoStarted',
      () => console.log('AdMobRewarded => videoStarted')
    );
    AdMobRewarded.on('onAdLeftApplication',
      () => console.log('AdMobRewarded => adLeftApplication')
    );
  }
  componentWillUnmount(){
    //AdMobRewarded.removeAllListeners();
    //AdMobInterstitial.removeAllListeners();
  }
  componentDidUpdate(){
    //this.btnChange();
  }
  /*
  btnChange = async () =>{
    if(this.props.isFocused&&this.state.activeButton!=this.props.ACTIVE_BTN){
      this.setState({activeButton:this.props.ACTIVE_BTN});
    }
  }
  */
  showInterstitial() {
    AdMobInterstitial.show();
  }
  addScreenViewCnt = async() => {
    const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SCREEN";
    var screenViewCnt = await AsyncStorage.getItem(storKey);
    screenViewCnt = Number(screenViewCnt);
    if(screenViewCnt){
      await AsyncStorage.removeItem(storKey);
    }else{
      screenViewCnt = 0;
    }
    screenViewCnt += 1;
    await AsyncStorage.setItem(storKey, screenViewCnt.toString());
  }

  compareViewCnt = async () => {
    const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SCREEN";
    var currentScreenViewCnt = await AsyncStorage.getItem(storKey);
    currentScreenViewCnt = Number(currentScreenViewCnt);
    var maxSreenViewCnt = this.props.TIMESTAMP.screenViewCnt?this.props.TIMESTAMP.screenViewCnt: 5;
    console.log(currentScreenViewCnt+"vs"+maxSreenViewCnt);
    if(currentScreenViewCnt>maxSreenViewCnt){
      const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SCREEN";
      var screenViewCnt = await AsyncStorage.getItem(storKey);
      screenViewCnt = Number(screenViewCnt);
      if(screenViewCnt){
        await AsyncStorage.removeItem(storKey);
      }
      screenViewCnt = 0;
      await AsyncStorage.setItem(storKey, screenViewCnt.toString());
      if (AdMobInterstitial.isLoaded()) {
        AdMobInterstitial.show();
      } else {
        await AdMobInterstitial.loadAd(request.build());
        AdMobInterstitial.show();
      }
    }
  }
  
  compareInbodyTimestamp = async () =>{
    //1. 인바디 타임 스탬프
    //1-1. timestamp값이 없으면 입력 
    //1-1. 혹은 일주일이 지난 값이면 초기화
    const storKey = "@"+Moment(new Date()).format('YYMMDD')+"INBODYTIMESTAMP";
    var currentInbodyTimestamp = await AsyncStorage.getItem(storKey);
    currentInbodyTimestamp = Number(currentInbodyTimestamp);
    if(!currentInbodyTimestamp || (currentInbodyTimestamp&&Math.abs(currentInbodyTimestamp-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7))){
      currentInbodyTimestamp = this.props.TIMESTAMP.timestamp;
      await AsyncStorage.setItem(storKey, currentInbodyTimestamp.toString());
    }else{
      //1-2. 값이 일주일이 지나지 않았으면 3번 넘었는지 체크해서 분기
      const inbodyStorKey = "@"+Moment(new Date()).format('YYMMDD')+"INBODY";
      var inbodyUpCnt = await AsyncStorage.getItem(inbodyStorKey);
      inbodyUpCnt = Number(inbodyUpCnt);
      console.log("FOoter.js:"+inbodyUpCnt);
      Alert.alert("인바디 촬영은 일주일 간격으로 3번씩만 찍을 수 있어요.", '기준일: '+Moment(currentInbodyTimestamp).format('YYYY-MM-DD').toString()+', 찍은 횟수: '+inbodyUpCnt);
      if(inbodyUpCnt < 3){
        this.props.navigation.navigate("TakePhotoInbody");
      }
    }
  }

  render() {
    const shadowOpt = {
      width:width,
      height:height*0.13*0.69,
      color:COLOR.grey900,
      border:1,
      radius:3,
      opacity:0.1,
      x:0,
      y:-3
    }
    return (
      <BoxShadow setting={shadowOpt}>
      <View
        width={width}
        /*borderTopColor="#e7e7ea"
        borderTopWidth={0.5}*/
        backgroundColor="#ffffff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        flex={0}
      >
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={async() => {
          //if(this.props.ACTIVE_BTN!="HOME"){
          if(this.props.navigation.state.routeName!='Main'){
            this.props.forceRefreshMain(true);
          }
          //this.props.setActiveFooterBtn("HOME")
          await this.compareViewCnt(this.addScreenViewCnt());
          this.props.navigation.navigate("Main")
        }}
        flex={1}
      >
        <View style={styles.footerIconContainer}>
            <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='Main' ? Images.Footer_img_btn_active_home: Images.Footer_img_btn_home} />
            <Image style={styles.footerText} source={this.props.navigation.state.routeName=='Main' ? Images.Footer_txt_btn_active_home: Images.Footer_txt_btn_home} />
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          //this.props.setActiveFooterBtn("PHOTO")
          requestCameraPermission().then(isGranted => {
            if(!isGranted){
              Alert.alert('카메라 권한이 없으면 찍먹의 메뉴를 이용할 수 없어요.');
            }else{
              requestGpsPermission().then(async(isGrantedGps) => {
                if(!isGrantedGps){
                  Alert.alert('GPS 권한이 없으면 찍먹의 메뉴를 이용할 수 없어요.');
                }else{
                  const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
                  var cnt = await AsyncStorage.getItem(storKey);
                  var maxCnt = this.props.TIMESTAMP.foodupcnt?this.props.TIMESTAMP.foodupcnt: 3;
                  const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
                  var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
                  viewAdCnt = Number(viewAdCnt);
                  cnt = Number(cnt);
                  console.log(cnt+"vs"+maxCnt+"+"+viewAdCnt);
                  if(cnt>=maxCnt+viewAdCnt){
                    Alert.alert(
                      '오늘 '+cnt+'번 찍먹하셨네요!',
                      '일일 찍먹 횟수가 '+maxCnt+'를 초과하면 광고를 봐주셔야 이용하실 수 있어요.',
                      [
                        {
                          text: '취소',
                          onPress: () => {/*console.log('Cancel Pressed')*/},
                          style: 'cancel',
                        },
                        {text: '광고보기', onPress: async() => {
                          AdMobRewarded.on('onRewarded',
                            async(reward) => {
                              console.log('rewarded;');
                              const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
                              var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
                              viewAdCnt = Number(viewAdCnt);
                              if(viewAdCnt){
                                await AsyncStorage.removeItem(viewAdStorKey);
                              }else{
                                viewAdCnt = 0;
                              }
                              viewAdCnt += 1;
                              await AsyncStorage.setItem(viewAdStorKey, viewAdCnt.toString());
                            }
                          );
                          AdMobRewarded.on('onAdClosed',
                            async() => {
                              console.log('adClosed');
                              const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
                              var afterViewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
                              console.log(viewAdCnt+"vs"+afterViewAdCnt);
                              if(afterViewAdCnt>viewAdCnt){
                                this.props.navigation.navigate("TakePhotoFood");
                              }else{
                                Alert.alert("광고를 끝까지 봐주셔야 해요!");
                              }
                              AdMobRewarded.loadAd(request.build());
                            }
                          );
                          if (AdMobRewarded.isLoaded()) {
                            AdMobRewarded.show();
                          } else {
                            await AdMobRewarded.loadAd(request.build());
                            AdMobRewarded.show();
                          }
                          }
                        }
                      ],
                      {cancelable: false},
                    )
                  }else{
                    this.props.navigation.navigate("TakePhotoFood");
                  }
                }
              });
            }
          });
          }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='TakePhotoFood' ? Images.Footer_img_btn_active_photo:Images.Footer_img_btn_photo} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='TakePhotoFood' ? Images.Footer_txt_btn_active_photo:Images.Footer_txt_btn_photo} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          //this.props.setActiveFooterBtn("INBODY")
          if(!requestCameraPermission()){
            Alert.alert('카메라 권한이 없으면 인바디 촬영 메뉴를 이용할 수 없어요.');
          }else{
            this.compareInbodyTimestamp();
          }
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='TakePhotoInbody' ? Images.Footer_img_btn_active_inbody:Images.Footer_img_btn_inbody} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='TakePhotoInbody' ? Images.Footer_txt_btn_active_inbody:Images.Footer_txt_btn_inbody} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          console.log('diary!!!');
          this.compareViewCnt().then(viewCnt=>{this.addScreenViewCnt(viewCnt)});
          //this.props.setActiveFooterBtn("DIARY")
          this.props.navigation.navigate("Diary")
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='Diary' ? Images.Footer_img_btn_active_diary:Images.Footer_img_btn_diary} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='Diary' ? Images.Footer_txt_btn_active_diary:Images.Footer_txt_btn_diary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(255,51,102,.1)"
        onPress={async() => {
          this.compareViewCnt().then(viewCnt=>{this.addScreenViewCnt(viewCnt)});
          //this.props.setActiveFooterBtn("GRAPH")
          this.props.navigation.navigate("Graph")
          }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='Graph' ? Images.Footer_img_btn_active_graph:Images.Footer_img_btn_graph} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='Graph' ? Images.Footer_txt_btn_active_graph:Images.Footer_txt_btn_graph} />
        </View>
      </TouchableOpacity>

      </View>
      </BoxShadow>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Footer));
