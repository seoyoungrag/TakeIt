import React, {Component} from 'react';

import {Linking,BackAndroid,PermissionsAndroid, Platform, AsyncStorage, Dimensions, StyleSheet, Text, View, PixelRatio, TouchableHighlight, TouchableOpacity, Modal, ScrollView, Alert,BackHandler} from 'react-native';
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import Container from '@container/Container';
import FastImage from 'react-native-fast-image'
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {BoxShadow} from 'react-native-shadow'
import { COLOR } from 'react-native-material-ui';

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import Moment from "moment";

import { withNavigationFocus } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Guide from '../guide/Guide'
import Images from "@assets/Images";
import firebase from 'react-native-firebase';
import PTRView from "react-native-pull-to-refresh";
import ImagePicker from 'react-native-image-picker';
import ShareForMain from './ShareForMain';
import PopupDialog from 'react-native-popup-dialog';
import RatingRequestor from 'react-native-rating-requestor';
import VersionCheck from "react-native-version-check";

const RatingOptions =  {
  title: "찍먹 - 다이어트 필수 사진앱",
  message: "찍먹앱을 평가해주세요.",
  actionLabels: {
    decline: "평가 안함",
    delay: "나중에 하기",
    accept: '지금 하기'
  },
  shouldBoldLastButton: true,
  //storeAppName: {string},
  //storeCountry: {string},
  timingFunction: function(currentCount){
    return currentCount > 1 && (Math.log(currentCount) / Math.log(3)).toFixed(5) % 1 == 0;
  }
}
const RatingTracker = new RatingRequestor(  Platform.select({
  ios: '1453367654',
  android: 'kr.co.dwebss.takeat.android',
}),RatingOptions);


const {width, height} = Dimensions.get("window");

const AdMobRewarded = firebase.admob().rewarded('ca-app-pub-3705279151918090/3468709592');
const AdRequest = firebase.admob.AdRequest;
//const request = new AdRequest().addTestDevice("6F2BDD38BF3D428D623F0AFEDACB3F06").addTestDevice("A160612144C9D8EA8260E79A412D6FC0");
const request = new AdRequest();

async function requestStoragePermission(){
  var isGranted = false;
  try {
    if(Platform.OS === 'ios' ){
      /*
      const check = await Permissions.check('Storage')
      if(check!='authorized'){
        //console.log('request permission');
        const GRANTED = await Permissions.request('Storage');
        console.log('GRANTED');
        console.log(GRANTED);
        if(GRANTED=='authorized'){
          isGranted = true;
        }else{
          isGranted = false;
        }
      }else{
        isGranted = true;
      }*/
      isGranted = true;
    }else{
      const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if(!check){
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title': '앨범 권한 필요',
            'message': '음식 사진을 올리기 위해 앨범 권한이 필요합니다.'
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
    USER_INFO: state.REDUCER_USER.user,
    WISE_SAYING: state.REDUCER_EXERCISE.wiseSaying,
    FORCE_REFRESH_MAIN : state.REDUCER_CONSTANTS.forceRefreshMain
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTimestamp: timestamp => {
      dispatch(ActionCreator.setTimestamp(timestamp));
    },
    setAdmobRewarded: ad => {
      dispatch(ActionCreator.setAdmobRewarded(ad));
    },
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    forceRefreshMain: isForce => {
      dispatch(ActionCreator.forceRefreshMain(isForce));
    }
  };
}

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

class Main extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

    constructor(props){
        super(props);
        this.state = {
          photos : [],
          intakeStatuses: [],
          userFastingInfo: {},
          isEmptyPhotos : false,
          calorie: {},
          spinnerVisible: false,
          guideYn: "Y",
          maxCnt : 0,
          viewAdCnt: 0,
          notificationId: "",
          DayDiaryVisible: false,
          analysises:{
            userEatKcal:0,
            userGoalTxt:"",
            recommendKcal:0,
            percent:0,
            goalKcal:0,
            userComment:"",
            analyComment1:"",
            analyComment2:"",
            analyComment3:"",
            analyComment4:"",
            analyComment5:"",
          },
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
          BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }
    componentWillMount(){
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

  versionCheck = async() => {
    let url = await VersionCheck.getStoreUrl();
    Alert.alert(
      "업데이트가 필요합니다.",
      "업데이트를 하지 않으면 앱을 정상적으로 이용할 수 없습니다.\n업데이트를 시작 하시겠습니까?",
      [
        {
          text: "아니오",
          onPress: () => {
            BackAndroid.exitApp();},
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
  

    componentDidMount = async() => {
      if (__DEV__) {
      
      }else{
        VersionCheck.needUpdate().then(async res => {
          if (res && res.isNeeded) {
            this.versionCheck();
            return;
          } else {

          }
        });
      }
      //RatingTracker.showRatingDialog();

      await firebase.messaging().hasPermission()
      .then(async(enabled) => {
        if (enabled) {
          console.log('User enabled authorised firebase.messaging');
        } else {
          await firebase.messaging().requestPermission()
          .then(() => {
            console.log('User has authorised firebase.messaging');
          })
          .catch(error => {
            console.log('User has rejected permissions firebase.messaging');
            console.log(error);
          });
        }
      });
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
          this.setState({
            viewAdCnt:viewAdCnt
          })
        }
      );
      AdMobRewarded.on('onAdClosed',
        async() => {
          console.log('adClosed');
          const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
          var afterViewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
          afterViewAdCnt = Number(afterViewAdCnt);
          if(!afterViewAdCnt){
            afterViewAdCnt=0;
          }
          console.log(this.state.viewAdCnt+"vs"+afterViewAdCnt);
          if(afterViewAdCnt>this.state.viewAdCnt){
          }else{
          }
          AdMobRewarded.loadAd(request.build());
        }
      );

        this.props.setAdmobRewarded(AdMobRewarded);
      await this.callbackFnc();
    }

    onBackButtonPressAndroid = () => {
      BackHandler.exitApp();
    };

    componentWillReceiveProps(nextProps) {
      //console.warn(this.state.notificationId);
      //console.warn(nextProps.navigation.state.params);
      if(nextProps.navigation.state&&nextProps.navigation.state.params&&nextProps.navigation.state.params.notificationId){
        //console.warn(this.state.notificationId!=nextProps.navigation.state.params.notificationId);
        if(this.state.notificationId!=nextProps.navigation.state.params.notificationId){
          this.setState({notificationId:nextProps.navigation.state.params.notificationId});
          this.callbackFnc();
        }
        //COM.props.forceRefreshMain(false);
        //this.callbackFnc();
      }
    }
    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
      //AdMobRewarded.removeAllListeners();
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

    callbackFnc = async() => {
      if(Number(this.props.USER_INFO.authCd)==400004){
        Alert.alert(
          "블랙리스트 사용자입니다.",
          "관리자에게 문의해주세요.\ncontact@dwebss.co.kr",
          [
            {
              text: "확인",
              onPress: () => {
                BackAndroid.exitApp();
              }
            }
          ],
          { cancelable: false }
        );
      }else{
        //this.setState({spinnerVisible:true})
        await this.getSystemTimestamp();
        const foodStorKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
        var foodUpCnt = await AsyncStorage.getItem(foodStorKey);
        foodUpCnt = Number(foodUpCnt);
        const inbodyStorKey = "@"+Moment(new Date()).format('YYMMDD')+"INBODY";
        var inbodyUpCnt = await AsyncStorage.getItem(inbodyStorKey);
        inbodyUpCnt = Number(inbodyUpCnt);
        const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
        var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
        viewAdCnt = Number(viewAdCnt);
        var maxCnt = this.props.TIMESTAMP.foodupcnt||this.props.TIMESTAMP.foodupcnt==0?this.props.TIMESTAMP.foodupcnt: 3;
        const foodList = await this.getFoodDiary();
        const statuses = await this.getMainIntakestatus();
        const analysis = await this.getAnalysisDiary();
        await this.setState({
          photos:
          foodList.length > 0
              ? foodList
              : [
                  {
                    firebaseDownloadUrl:"",
                    registTime: "촬영한 사진이 없네요."
                  }
                ],
          isEmptyPhotos: !foodList.length > 0 ,
          intakeStatuses: statuses.intakeStats,
          userFastingInfo: statuses.userFastingInfo, 
          calorie: statuses.calorie,
          guideYn: this.props.USER_INFO.guideYn,
          maxCnt : maxCnt,
          viewAdCnt : viewAdCnt,
          foodUpCnt: foodUpCnt,
          inbodyUpCnt: inbodyUpCnt,
          analysises :analysis,
          //spinnerVisible: false
        });
        if(foodList.length>0){
          RatingTracker.handlePositiveEvent(function(didAppear, userDecision) {
            if (didAppear) {
              switch(userDecision)
              {
                case 'decline': 
                //console.warn('User declined to rate'); 
                break;
                case 'delay'  : 
                //console.warn('User delayed rating, will be asked later'); 
                break;
                case 'accept' : 
                //console.warn('User accepted invitation to rate, redirected to app store'); 
                break;
              }
            } else {
              //console.warn('Request popup did not pop up. May appear on future positive events.');
            } 
          });
        }
        const COM = this;
        //await setTimeout(async()=>{ await COM.setState({spinnerVisible:false}) }, 100);
      }
    }
    viewAd = async() =>{

      const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
      var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
      viewAdCnt = Number(viewAdCnt);
      if(!viewAdCnt){
        viewAdCnt = 0;
      }
      var maxViewAdCnt = this.props.TIMESTAMP.maxadviewcnt||this.props.TIMESTAMP.maxadviewcnt==0?this.props.TIMESTAMP.maxadviewcnt: 10;
      console.warn(this.props.TIMESTAMP);
      console.warn(viewAdCnt + ' vs '+maxViewAdCnt);
      if(viewAdCnt >= maxViewAdCnt){
        alert('광고보기는 하루 '+maxViewAdCnt+'회만 가능해요.');
        return;
      }

      if (AdMobRewarded.isLoaded()) {
        AdMobRewarded.show();
      } else {
        await AdMobRewarded.loadAd(request.build());
        AdMobRewarded.show();
      }
    }

    getMainIntakestatus = async () => {
      var rtn;
      await cFetch(
        APIS.GET_MAIN_INTAKESTATUS, [ this.props.USER_INFO.userId, "date", Moment(new Date()).format("YYYY-MM-DD") ], {},
        {
          responseProc: async (res) => {
            //console.log("Main.js(getMainIntakestatus): "+JSON.stringify(res));
            rtn=res;
          }
        }
      );
      return rtn;
    }

    getFoodDiary = async () => {
      var rtn;
      await cFetch(
        APIS.GET_USER_FOOD, [ this.props.USER_INFO.userId, "date", Moment(new Date()).format("YYYY-MM-DD") ], {},
        {
          responseProc: async (res) => {
            //console.log("Main.js(getFOodDiary): "+JSON.stringify(res));
            rtn=res;
          }
        }
      );
      return rtn;
    }
    getAnalysisDiary = async () => {
      var rtn;
      await cFetch(
        APIS.GET_ANALYSIS_DIARY, [ this.props.USER_INFO.userId, "date", Moment(new Date()).format("YYYY-MM-DD") ], {},
        {
          responseProc: async (res) => {
            console.log("Main.js(getFOodDiary): "+JSON.stringify(res));
            rtn=res;
          }
        }
      );
      return rtn;
    }
    render() {
      COM = this;
      setTimeout(function(){
        if(COM.props.isFocused&&COM.props.FORCE_REFRESH_MAIN){
          COM.props.forceRefreshMain(false);
          COM.callbackFnc();
        }
      }, 100);
        const WiseSaying = this.props.WISE_SAYING[ Math.floor(Math.random() * this.props.WISE_SAYING.length) ].text;
        const profileShadowOpt = {
          width: height*0.14,
          height: height*0.14,
          color:COLOR.grey900,
          border:2,
          //radius:height*0.07,
          opacity:0.2,
          x:1,
          y:1
        }
        const YourImage = (
          <BoxShadow setting={profileShadowOpt}>
            <FastImage
              style={styles.avatarTempImage}
              source={this.props.USER_INFO.userSnsPhoto&&this.props.USER_INFO.userSnsPhoto.length>0 ?{
                uri: this.props.USER_INFO.userSnsPhoto,
                priority: FastImage.priority.normal
              }: Images.emptySnsProfile}
              resizeMode={FastImage.resizeMode.contain}
            />
          </BoxShadow>
        );
        const shadowOpt = {
          width:width/2.1 *(this.state.isEmptyPhotos? 2:1),
          height:width/2 *(this.state.isEmptyPhotos? 2:1),
          color:COLOR.grey900,
          border:2,
          radius:0,
          opacity:0.1,
          x:3,
          y:3
        }
        PROPS = this.props;
        var curTime = new Date();
        var lastFoodTime = new Date(this.state.userFastingInfo.lastFoodTime);
        var gapHour = Math.abs(((curTime.getTime()-lastFoodTime.getTime())/(60*60*1000)).toFixed(0));
        var gapMinutes = curTime.getMinutes()-lastFoodTime.getMinutes();
        if(gapMinutes < 0){
          gapMinutes = gapMinutes+60;
        }
        var timeGapText = "";
        if(this.state.userFastingInfo && this.state.userFastingInfo.lastFoodTime ){
          timeGapText = "찍먹하신지 ";
          if(gapHour == 0){
            timeGapText=timeGapText+gapMinutes+"분이 지났어요.";
          }else if(gapHour >= 24){
            timeGapText=timeGapText+"24시간 이상 지났어요.";
          }else{
            timeGapText=timeGapText+gapHour +"시간 "+gapMinutes+"분이 지났어요.";
          }
        }else{
          timeGapText = "찍먹!하시면 찍먹한 경과 시간을 알려드릴께요.";
        }
        const headerView = (<View
          style={styles.headerView}>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}>

            <View width={height*0.15} height="100%" paddingLeft={10}>
            {YourImage}
            </View>

            <View flex={width-height*0.15} height="100%">
              <View flex={3} style={{padding:10, paddingBottom:0}}>
                <Text style={styles.profileUserEmail}>{timeGapText}</Text>
                <Text style={styles.profileWiseSaying}>{WiseSaying}</Text>
              </View>
              <View flex={2} flexDirection="row" style={{padding:10, paddingTop:20}}>
                <View flex={2} style={{backgroundColor:'rgb(72,207,173)', paddingLeft:10, justifyContent:"center"}}><Text style={{color:"white"}}>today {this.state.calorie.stat} kcal</Text></View>
                <View flex={1} style={{backgroundColor:'rgb(255,206,84)', paddingRight:10, justifyContent:"center", height:"70%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+{this.state.calorie.guage}</Text></View>
              </View>
            </View>

          </View>

        </View>);
        const statusView = (
          <View style={styles.statusView}>
            <FlatGrid
              itemDimension={width/2.1}
              fixed
              spacing={0}
              items={this.state.intakeStatuses}
              style={styles.gridView}
              renderItem={({ item, section, index }) => (
                <View style={[styles.statusContainer, { /* backgroundColor: 'rgba(255,0,0,'+item.guage+')'*/}]}>
                  <View flexDirection="row" width={width/2-width*0.1}>
                    <View style={{flex:1, alignItems:"flex-start"}}>
                      <Text style={[styles.itemName,{color:COLOR.grey800}]}>{item.name}</Text>
                    </View>
                    <View style={{flex:1, alignItems:"flex-end"}}>
                      <Text style={[styles.itemCode,{color:"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}]}>{item.stat}g
                      </Text>
                    </View>
                  </View>
                  <ProgressBarAnimated
                    width={width/2-width*0.1}
                    height={height*0.005}
                    value={100*item.guage}
                    backgroundColor={"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}
                    borderColor={"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",0.1)"}
                  />
                </View>
              )}
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
              )}
            />
          </View>);

          const foodList = (
            <View style={styles.foodList}>
            <ScrollView contentContainerStyle={[styles.foodListScroll]}>
              <SectionGrid
                itemDimension={width/2.1 *(this.state.isEmptyPhotos? 2:1)}
                fixed
                spacing={5}
                sections={[
                  {
                    title: Moment(new Date()).format("YYYY-MM-DD"),
                    data: this.state.photos,
                  }
                ]}
                style={styles.gridView}
                renderItem={({ item, section, index }) => (

                  <TouchableHighlight onPress={()=>
                    {this.state.isEmptyPhotos?
                      null:
                      this.props.navigation.navigate("Food", {
                        food: item
                        })
                      }}>
                  <BoxShadow setting={shadowOpt}>
                  <View style={{height:width/2*(this.state.isEmptyPhotos? 2:1)}}>
                    <View style={{
                      position:"absolute",
                      height:"100%",width:"100%",
                      zIndex:1,
                      alignItems:"center",
                      justifyContent:"center",
                      flexDirection:"row"
                      }}>
                      {item.firebaseDownloadUrl !="" ?
                      (<Text style={{
                          color:"white",
                          fontSize:FONT_BACK_LABEL*1.2,
                          textShadowRadius:10,
                          textShadowColor:'#000000',
                          textShadowOffset:{width:0, height:0},
                          textAlign:"center",
                          textAlignVertical:"center"
                          }}>&nbsp;
                          <Ionicons
                            name="ios-clock"
                            color={"#ffffff"}
                            size={FONT_BACK_LABEL*2}
                            borderWidth={0}/>
                            &nbsp;
                        </Text>
                      ):null}
                        {item.firebaseDownloadUrl !="" ?
                        (<Text style={{
                          color:"white",
                          fontSize:FONT_BACK_LABEL*1.2,
                          textShadowRadius:10,
                          textShadowColor:'#000000',
                          textShadowOffset:{width:0, height:0},
                          textAlign:"center",
                          textAlignVertical:"center"}}>
                          {item.registTime.substring(0,10)}{"\n"}{item.registTime.substring(10,19)}
                        </Text> )
                        : null}
                    </View>
                    <View style={{
                      position:"absolute",
                      height:"100%",width:"100%",
                      zIndex:1,
                      alignItems:"flex-start",
                      justifyContent:"flex-end",
                      flexDirection:"row",
                      paddingTop:5,
                      }}>
                      {item.firebaseDownloadUrl !="" ?
                      (
                        <TouchableHighlight onPress={()=>
                          {Alert.alert(
                              "찍먹 삭제",
                              "삭제하시면 복구할 수 없어요. 정말 삭제하시겠어요?",
                              [
                                { text: "아니오", onPress: () => {}, style: "cancel" },
                                {
                                  text: "네",
                                  onPress: () => {
                                      const COMP = this;
                                      cFetch(APIS.DELETE_PHOTO, [], JSON.stringify(item), {
                                        responseProc: function(res) {
                                          COMP.callbackFnc();
                                        },
                                        responseNotFound: function(res) {
                                          console.log("포토 삭제 에러 시작");
                                          console.log(res);
                                          console.log("포토 삭제 에러 끝");
                                        }
                                      });
                                  }
                                }
                              ],
                              { cancelable: false }
                            )
                          ;
                          }}>
                          <Text style={{
                              color:"white",
                              fontSize:FONT_BACK_LABEL*1.2,
                              textShadowRadius:10,
                              textShadowColor:'#000000',
                              textShadowOffset:{width:0, height:0},
                              textAlign:"center",
                              textAlignVertical:"center"
                              }}>
                              &nbsp;
                              <Entypo
                                name="trash"
                                color={"#ffffff"}
                                size={FONT_BACK_LABEL*1.2}
                                borderWidth={0}/>
                                &nbsp;
                            </Text>
                            </TouchableHighlight>
                      ):null}
                    </View>
                    <FastImage
                      style={{height:width/2*(this.state.isEmptyPhotos? 2:1)}}
                      source={item.firebaseDownloadUrl !="" ?{
                        uri: item.firebaseDownloadUrl,
                        priority: FastImage.priority.normal,
                      }: Images.empty}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  </BoxShadow>
                  </TouchableHighlight>
                )}
                renderSectionHeader={({ section }) => (
                  <View flex={1} width="100%" flexDirection="row">
                    <Text style={styles.sectionHeader}>
                      <Octicons name="calendar" color="#000000" size={FONT_BACK_LABEL}/>&nbsp;&nbsp;{section.title}
                    </Text>

                    <TouchableOpacity onPress={async()=>{
                                      const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
                                      var cnt = await AsyncStorage.getItem(storKey);
                                      var macCnt = this.props.TIMESTAMP.foodupcnt||this.props.TIMESTAMP.foodupcnt==0?this.props.TIMESTAMP.foodupcnt: 3;
                                      cnt = Number(cnt);
                                      if(!cnt){
                                        cnt=0;
                                      }
                                      const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
                                      var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
                                      viewAdCnt = Number(viewAdCnt);
                                      if(!viewAdCnt){
                                        viewAdCnt=0;
                                      }
                                      if(cnt>=macCnt+viewAdCnt){
                                        Alert.alert(
                                          '티켓을 충전해주세요.',
                                          '일일 저장 횟수가 '+macCnt+'를 초과했어요. 상단의 광고를 보시고 티켓을 충전해주세요.'
                                          )
                                          return false;
                                      }
                                      requestStoragePermission().then(isGranted => {
                                        if(!isGranted){
                                          Alert.alert('앨범 권한이 없으면 찍먹의 메뉴를 이용할 수 없어요.');
                                        }else{
                                          const options = {
                                            title: '찍먹할 사진을 선택해주세요.',
                                            maxWidth:1280,maxHeight:1280,
                                            quality: 0.9,
                                            noData: true
                                          };
                                          ImagePicker.launchImageLibrary(options, async(image) => {
                                            console.log(image);
                                            if(image.didCancel||!image.uri){
                                              return;
                                            }
                                          //0. 경고창 다시보기 체크되어있는지 체크
                                          const periodFoodUpMainAlertStorKey = "@FOODUPMAINALERTPERIOD";
                                          var FOODUPMAINALERTPERIOD = await AsyncStorage.getItem(periodFoodUpMainAlertStorKey);
                                          var isShowFoodUpMainAlert = false;
                                          FOODUPMAINALERTPERIOD = Number(FOODUPMAINALERTPERIOD);
                                          //0-1. 저장된 적이 없거나, 저장되었는데 1주일이 넘었으면 flag는 true로
                                          if(!FOODUPMAINALERTPERIOD || Math.abs(FOODUPMAINALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7)){
                                          //if(!FOODUPLOADALERTPERIOD || Math.abs(FOODUPLOADALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60)){
                                            isShowFoodUpMainAlert = true;
                                            await AsyncStorage.removeItem(periodFoodUpMainAlertStorKey);
                                          }
                                          if(isShowFoodUpMainAlert){
                                            Alert.alert(
                                              '선택한 사진을 등록하시겠어요?',
                                              '사진을 업로드하면 수정/삭제할 수 없습니다.\n일일 저장 횟수가 '+macCnt+'를 초과하면 찍먹티켓을 사용합니다. \n(금일: '+cnt+'회 저장)',
                                              [
                                                {text: '일주일간 보지않기', onPress: () =>
                                                  {
                                                    AsyncStorage.setItem(periodFoodUpMainAlertStorKey, this.props.TIMESTAMP.timestamp.toString());
                                                    this.uploadPictrue(image);
                                                  }
                                                },
                                                {
                                                  text: '취소',
                                                  onPress: () => console.log('Cancel Pressed'),
                                                  style: 'cancel',
                                                },
                                                {text: '저장', onPress: async() => {this.uploadPictrue(image)}},
                                              ],
                                              {cancelable: false},
                                            );
                                        }else{
                                          this.uploadPictrue(image);
                                        }
                                    });
                                  }
                                });
                    }}>
                      <Text style={[styles.sectionHeader,{textAlign:"right"}]}><Entypo name="folder-images" color="#000000" size={FONT_BACK_LABEL}/>&nbsp;&nbsp;앨범</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      /*this.props.navigation.navigate('Snapshot', {
                        headerView:headerView, statusView:statusView, foodList:foodList})
                        */
                       if(!this.state.isEmptyPhotos){
                        this.props.navigation.navigate("DayDiary", {inqueryDate:Moment(new Date()).format('YYYY-MM-DD')})
                        }else{
                          Alert.alert(
                            '등록한 사진이 없네요.',
                            '적어도 한장 이상의 사진을 등록해주세요.'
                            )
                            return false;
                        }
                      /*
                       this.setState({DayDiaryVisible:true, spinnerVisible:true})
                       //this.setState({DayDiaryVisible:true})
                        setTimeout(async ()=>{
                          console.warn(this.refs);
                          try{
                            await this.refs.daydiary.snapshot("full");
                          }catch(e){
                            console.warn(e);
                          }
                          this.setState({DayDiaryVisible:false, spinnerVisible:false})
                        }, 100);
                      }}
                      */
                      }}
                    >
                    <Text style={[styles.sectionHeader,{textAlign:"right"}]}><Entypo name="share" color="#000000" size={FONT_BACK_LABEL}/> &nbsp;&nbsp;공유하기 </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </ScrollView>
            </View>);
            const popupDialog =(

          <PopupDialog
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          height={height}
          visible={this.state.DayDiaryVisible}
          containerStyle={{
            zIndex: 1010,
          }}
          dialogStyle={{}}
          >
          <ShareForMain ref="daydiary" navigation={this.props.navigation} inqueryDate={Moment(new Date()).format("YYYY-MM-DD")}  analysises={this.state.analysises} calorie={this.state.calorie} intakeStatuses={this.state.intakeStatuses} photos={this.state.photos} />
          </PopupDialog>
            )
        const content = (
          <Container navigation={this.props.navigation} adMobRewarded={AdMobRewarded}>
          <PTRView
            style={{ width: "100%", height: "100%" }}
            onRefresh={this.callbackFnc}
          >
            <Modal animationType="fade" hardwareAccelerated={true} visible={this.state.guideYn=="N"} transparent={true} onRequestClose={() => {}}>
              <Guide onCompleteGuide={()=>{
                var copy = this.props.USER_INFO.constructor()

                for (var attr in this.props.USER_INFO) {
                  if (this.props.USER_INFO.hasOwnProperty(attr)) {
                    copy[attr] = this.props.USER_INFO[attr];
                  }
                }
                copy.guideYn="Y"

                var body = JSON.stringify(copy);
                cFetch(APIS.PUT_USER_BY_EMAIL, [copy.userEmail+"/"], body, {
                  responseProc: function(res) {
                    console.log(res);
                    PROPS.setUserInfo(res);
                  },
                  responseNotFound: function(res) {
                    console.log(res);
                  }
                });
                this.props.setUserInfo(copy);
                this.setState({
                  guideYn:"Y"
                  })
                }
              }/>
            </Modal>
            <View style={styles.container}>
              {popupDialog}
              <View style={{flex:5, flexDirection:"row", padding:10, borderBottomColor:COLOR.grey900, borderBottomWidth:0.5}}>

                <View style={[styles.seeAdBtn,{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignSelf:"center",borderWidth:0 }]}>
                  <Text style={{color:COLOR.pink500, fontSize:FONT_BACK_LABEL*0.9}}>
                  <MaterialCommunityIcons
                      name="ticket"
                      color={COLOR.pink500}
                      size={FONT_BACK_LABEL*0.9}/>
                      &nbsp;
                      찍먹티켓
                    <Text>
                      &nbsp;&nbsp;{this.state.maxCnt-this.state.foodUpCnt<0 ? 0 : this.state.maxCnt-this.state.foodUpCnt || 0}
                    </Text>
                    <Text>
                      {/*일일임계횟수에서 차감한 후에, 광고보기 횟수에서 차감한다,
                      1. 차감횟수가 일일횟수보다 큰 경우, 광고보기 횟수에서 차감횟수-일일임계횟수를 빼야한다.
                      1-1. 0보다 작을 수 있을까? 없다.
                      2. 차감횟수가 일일횟수보다 작 은경우, 광고보기 횟수는 변함 없다.*/ }
                      &nbsp;+
                        {
                        this.state.maxCnt-this.state.foodUpCnt<0?
                        this.state.viewAdCnt-(this.state.foodUpCnt-this.state.maxCnt) || 0 : this.state.viewAdCnt
                        }
                    </Text>
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignSelf:"center" }}>
                  <TouchableOpacity onPress={() => this.viewAd()} style={[styles.seeAdBtn,{/*elevation:5*/}]}>
                  <Text style={{color:COLOR.pink500, fontSize:FONT_BACK_LABEL*0.9}}>
                    <MaterialCommunityIcons
                      name="television-classic"
                      color={COLOR.pink500}
                      size={FONT_BACK_LABEL*0.9}/>
                      &nbsp;
                      티켓 충전
                  </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Setting')} style={[styles.seePreferBtn,{/*elevation:5*/}]}>
                  <Text style={{color:COLOR.pink500, fontSize:FONT_BACK_LABEL*0.9}}>
                    <MaterialCommunityIcons
                      name="settings-outline"
                      color={COLOR.pink500}
                      size={FONT_BACK_LABEL*1.2}/>
                  </Text>
                  </TouchableOpacity>
                </View>

              </View>
              {headerView}
              {statusView}
              {foodList}
            {/*
            <TouchableOpacity
              onPress={() => { Alert.alert(
                      "우웃",
                      "정말 로그아웃 하시겠습니까?",
                      [
                        { text: "아니오", onPress: () => {}, style: "cancel" },
                        {
                          text: "네",
                          onPress: () => {
                            firebase
                              .auth()
                              .signOut()
                              .then(() => this.props.closeDrawer())
                              .then(() => this.props.navigation.navigate("Login"))
                              .catch(error => {});
                          }
                        }
                      ],
                      { cancelable: false }
                    )
                  ;
              }}
            >
            <Text style={{fontSize:20, color:"red"}}>로그아웃 테스트</Text>
            </TouchableOpacity>
            */}
            </View>
            <Spinner
              visible={this.state.spinnerVisible}
              textContent={'잠시만 기다려 주세요...'}
              textStyle={{color: '#FFF'}}
            />
            </PTRView>
          </Container>
          );
          return (
            <DrawerWrapped
                rightDisabled={true}
                navigation={this.props.navigation}
                content={content}
                parentWidth={width}
                />
          );
    }

  uploadPictrue = async(image) =>{
    const COM = this;
    const PROPS = this.props;
    console.warn(image);
    COM.setState({spinnerVisible:true});
    var dateTime = new Date();
      //console.log("TakeInbodyPic.js: "+JSON.stringify(image));

      firebase
        .storage()
        .ref("/food_diary/" + PROPS.USER_INFO.userId + "/" + Moment(dateTime).format("YYYY-MM-DD") + "/" + image.uri.substr(image.uri.lastIndexOf("/") + 1) )
        .putFile(image.uri)
        .then(async(uploadedFile) => {
          console.log(uploadedFile);
          if (uploadedFile.state == "success") {
            var data = {};
            data.userId = PROPS.USER_INFO.userId;
            data.registD = Moment(dateTime).format("YYYY-MM-DD");
            data.registTime = Moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            data.firebaseStoragePath = uploadedFile.ref;
            data.firebaseDownloadUrl = uploadedFile.downloadURL;
            data.deviceLocalFilePath = image.uri;
            data.xCoordinate = COM.state.longitude;
            data.yCoordinate = COM.state.latitude;
            var body = JSON.stringify(data);
            var isSended = false;
            await cFetch(APIS.POST_USER_FOOD, [], body, {
              responseProc: async(res) => {
                isSended = true;
                //console.log("TakeInbodyPic.js(responseProc): "+JSON.stringify(res));
              },
              responseNotFound: function(res) {
                console.log("TakeInbodyPic.js(responseNotFound): "+JSON.stringify(res));
              },
              responseError: function(e) {
                console.log("TakeInbodyPic.js(responseError): "+JSON.stringify(res));
              }
            });
            await COM.setState({
              spinnerVisible:false
            })
            if(isSended){
              const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
              var foodUpCnt = await AsyncStorage.getItem(storKey);
              foodUpCnt = Number(foodUpCnt);
              if(foodUpCnt){
                await AsyncStorage.removeItem(storKey);
              }else{
                foodUpCnt = 0;
              }
              foodUpCnt += 1;
              await AsyncStorage.setItem(storKey, foodUpCnt.toString());
              //0. 경고창 다시보기 체크되어있는지 체크
              const periodUploadConfirmAlertStorKey = "@UPLOADCONFIRMALERTPERIOD";
              var UPLOADCONFIRMALERTPERIOD = await AsyncStorage.getItem(periodUploadConfirmAlertStorKey);
              var isShowConfirmAlert = false;
              UPLOADCONFIRMALERTPERIOD = Number(UPLOADCONFIRMALERTPERIOD);
              //0-1. 저장된 적이 없거나, 저장되었는데 1주일이 넘었으면 flag는 true로
              if(!UPLOADCONFIRMALERTPERIOD || Math.abs(UPLOADCONFIRMALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7)){
              //if(!UPLOADCONFIRMALERTPERIOD || Math.abs(UPLOADCONFIRMALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60)){
                isShowConfirmAlert = true;
                await AsyncStorage.removeItem(periodUploadConfirmAlertStorKey);
              }
              if(isShowConfirmAlert){
                Alert.alert('분석이 끝나면 알림을 보내드릴게요.','잠시 후에 확인해주세요.',
                [
                  {text: '일주일간 보지않기', onPress: () =>
                    {
                      AsyncStorage.setItem(periodUploadConfirmAlertStorKey, this.props.TIMESTAMP.timestamp.toString());
                    }
                  },
                  {
                    text: '확인',
                    onPress: () => console.log('Cancel Pressed')
                  }],
                  { cancelable: false });
                }
              setTimeout(function(){
                COM.callbackFnc();
              }, 100);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });

  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width
    },
    headerView: {
      flex:16,
      paddingTop:20,
      paddingBottom:20,
      //backgroundColor: "blue"
    },
     avatarTempImage: {
      height: "100%",
      width: "100%",
      borderRadius: 0
    },
    statusView:{
      flex: 14,
      backgroundColor: "#FAFAFA"
    },
    foodList: {
      backgroundColor:"#F8F4F6",
      flex: 65
    },
    foodListScroll: {
      height: "100%",
      backgroundColor:"#F8F4F6",
      flexGrow: 1,
      justifyContent: 'space-between'
    },
    profileUserEmail: {
      fontSize: FONT_BACK_LABEL*1.2,
      color:"rgba(0,0,0,1)"
    },
    profileWiseSaying: {
      fontSize: FONT_BACK_LABEL*0.8
    },
    gridView: {
      flex: 0,
    },
    statusContainer: {
      justifyContent: 'center',
      alignItems:'center',
      height: (height*0.10)*0.5
    },
    itemName: {
      fontSize: FONT_BACK_LABEL*0.9,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: FONT_BACK_LABEL*0.8,
      color: '#fff',
    },
    sectionHeader: {
      flex: 1,
      textAlignVertical:"bottom",
      fontSize: FONT_BACK_LABEL,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent:'flex-end',
      color: COLOR.grey800,
      padding: 10,
      paddingBottom: 15
    },
    seeAdBtn: {
      flex: 0,
      alignSelf: 'center',
      padding:5,
      borderColor:COLOR.pink500,
      borderWidth:1
    },
    seePreferBtn: {
      flex: 0,
      alignSelf: 'center',
      padding:5,
      paddingRight:0
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Main));