import React from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert, PermissionsAndroid, AsyncStorage
} from "react-native";
import Images from "@assets/Images";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
import {BoxShadow} from 'react-native-shadow'
import { COLOR } from 'react-native-material-ui';
import { AdMobRewarded } from 'react-native-admob'
import Moment from "moment";
const { height, width } = Dimensions.get("window");
let styles = {
  footerIcon: {
    height: height * 0.038,
    resizeMode: "contain"
  },
  footerText: {
    height: height * 0.019,
    resizeMode: "contain",
    marginTop:height * 0.015
  },
  footerIconContainer: { width:width/5, alignItems: "center",marginTop:height * 0.03, marginBottom: height * 0.03
}
};

async function requestGpsPermission() {
  var isGranted = false;
  try {
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
        console.log("You can use the ACCESS_FINE_LOCATION")
      } else {
        isGranted = false;
        console.log("ACCESS_FINE_LOCATION permission denied")
      }
    }else{
      isGranted = true;
    }
  } catch (err) {
    console.warn(err)
  }
  return isGranted;
}

async function requestCameraPermission(){
  var isGranted = false;
  try {
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
        console.log("You can use the CAMERA")
      } else {
        isGranted = false;
        console.log("CAMERA permission denied")
      }
    }else{
      isGranted = true;
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
    AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
    AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');


    AdMobRewarded.addEventListener('adLoaded',
      () => console.log('AdMobRewarded => adLoaded')
    );
    AdMobRewarded.addEventListener('adFailedToLoad',
      (error) => console.warn(error)
    );
    AdMobRewarded.addEventListener('adOpened',
      () => console.log('AdMobRewarded => adOpened')
    );
    AdMobRewarded.addEventListener('videoStarted',
      () => console.log('AdMobRewarded => videoStarted')
    );
    AdMobRewarded.addEventListener('adLeftApplication',
      () => console.log('AdMobRewarded => adLeftApplication')
    );

    AdMobRewarded.requestAd().catch(error => console.warn(error));
  }
  componentWillUnmount(){
    AdMobRewarded.removeAllListeners();
  }
  componentDidUpdate(){
    //this.btnChange();
  }
  btnChange = async () =>{
    if(this.props.isFocused&&this.state.activeButton!=this.props.ACTIVE_BTN){
      this.setState({activeButton:this.props.ACTIVE_BTN});
    }
  }
  render() {
    const shadowOpt = {
      width:width,
      height:height*0.13,
      color:COLOR.grey900,
      border:2,
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
        flex={1}
      >
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          //if(this.props.ACTIVE_BTN!="HOME"){
          if(this.props.navigation.state.routeName!='Main'){
            this.props.forceRefreshMain(true);
          } 
          //this.props.setActiveFooterBtn("HOME")
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
                          AdMobRewarded.addEventListener('rewarded',
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
                          AdMobRewarded.addEventListener('adClosed',
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
                              AdMobRewarded.requestAd().catch(error => console.warn(error));
                            }
                          );
                          await AdMobRewarded.showAd().catch(error => console.warn(error));
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
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='TakePhotoFood' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_photo} />
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
            this.props.navigation.navigate("TakePhotoInbody")
          }
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='TakePhotoInbody' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_inbody} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='TakePhotoInbody' ? Images.Footer_txt_btn_active_inbody:Images.Footer_txt_btn_inbody} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          //this.props.setActiveFooterBtn("DIARY")
          this.props.navigation.navigate("Diary")
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='Diary' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_diary} />
          <Image style={styles.footerText} source={this.props.navigation.state.routeName=='Diary' ? Images.Footer_txt_btn_active_diary:Images.Footer_txt_btn_diary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(255,51,102,.1)"
        onPress={() => {
          //this.props.setActiveFooterBtn("GRAPH")
          this.props.navigation.navigate("Main")
          }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.props.navigation.state.routeName=='Graph' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_graph} />
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
