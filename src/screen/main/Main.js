import React, {Component} from 'react';

import {AsyncStorage, Dimensions, StyleSheet, Text, View, PixelRatio, TouchableHighlight, TouchableOpacity, Modal, ScrollView} from 'react-native';
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

const {width, height} = Dimensions.get("window");

const AdMobRewarded = firebase.admob().rewarded('ca-app-pub-3705279151918090/3468709592');
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest().addTestDevice("6F2BDD38BF3D428D623F0AFEDACB3F06").addTestDevice("A160612144C9D8EA8260E79A412D6FC0");

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
    constructor(props){
        super(props);
        this.state = {
          photos : [],
          intakeStatuses: [],
          isEmptyPhotos : false,
          calorie: {},
          spinnerVisible: false,
          guideYn: "Y",
          maxCnt : 0,
          viewAdCnt: 0
        }
    }
    componentDidMount = async() => {

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


      await this.callbackFnc();
    }

    componentWillUnmount() {
      //AdMobRewarded.removeAllListeners();
      this.notificationDisplayedListener();
      this.notificationListener();
    }
    callbackFnc = async() => {
      //this.setState({spinnerVisible:true})

      const foodStorKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
      var foodUpCnt = await AsyncStorage.getItem(foodStorKey);
      foodUpCnt = Number(foodUpCnt);
      const inbodyStorKey = "@"+Moment(new Date()).format('YYMMDD')+"INBODY";
      var inbodyUpCnt = await AsyncStorage.getItem(inbodyStorKey);
      inbodyUpCnt = Number(inbodyUpCnt);
      const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
      var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
      viewAdCnt = Number(viewAdCnt);
      var maxCnt = this.props.TIMESTAMP.foodupcnt?this.props.TIMESTAMP.foodupcnt: 3;
      const foodList = await this.getFoodDiary();
      const statuses = await this.getMainIntakestatus();
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
        calorie: statuses.calorie,
        guideYn: this.props.USER_INFO.guideYn,
        maxCnt : maxCnt,
        viewAdCnt : viewAdCnt,
        foodUpCnt: foodUpCnt,
        inbodyUpCnt: inbodyUpCnt
        //spinnerVisible: false
      });
      const COM = this;
      //await setTimeout(async()=>{ await COM.setState({spinnerVisible:false}) }, 100);
    }
    viewAd = async() =>{
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
        const content = (
          <Container navigation={this.props.navigation} adMobRewarded={AdMobRewarded}>
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
                      광고보고 충전하기
                  </Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View
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
                      <Text style={styles.profileUserEmail}>{this.props.USER_INFO.userEmail}</Text>
                      <Text style={styles.profileWiseSaying}>{WiseSaying}</Text>
                    </View>
                    <View flex={2} flexDirection="row" style={{padding:10, paddingTop:20}}>
                      <View flex={2} style={{backgroundColor:'rgb(72,207,173)', paddingLeft:10, justifyContent:"center"}}><Text style={{color:"white"}}>today {this.state.calorie.stat} kcal</Text></View>
                      <View flex={1} style={{backgroundColor:'rgb(255,206,84)', paddingRight:10, justifyContent:"center", height:"70%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+{this.state.calorie.guage}</Text></View>
                    </View>
                  </View>

                </View>

              </View>

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
              </View>

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
                    <Text style={styles.sectionHeader}><Octicons name="calendar" color="#000000" size={FONT_BACK_LABEL}/>&nbsp;&nbsp;{section.title}</Text>
                  )}
                />
              </ScrollView>
              </View>

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
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Main));