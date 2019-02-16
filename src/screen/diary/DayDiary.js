import React, {Component} from 'react';

import {Dimensions, StyleSheet, Text, View, PixelRatio, TouchableHighlight, Modal} from 'react-native';
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import Container from '@container/Container';
import FastImage from 'react-native-fast-image'
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {BoxShadow} from 'react-native-shadow'
import { COLOR } from 'react-native-material-ui';

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import Moment from "moment";

import { withNavigationFocus } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

const {width, height} = Dimensions.get("window");

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    WISE_SAYING: state.REDUCER_EXERCISE.wiseSaying,
    FORCE_REFRESH_MAIN : state.REDUCER_CONSTANTS.forceRefreshMain
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forceRefreshMain: isForce => {
      dispatch(ActionCreator.forceRefreshMain(isForce));
    }
  };
}

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

class DayDiary extends Component {
    constructor(props){
        super(props);
        this.state = {
          photos : [],
          intakeStatuses: [],
          isEmptyPhotos : false,
          calorie: {},
          spinnerVisible: true,
          inqueryDate: this.props.navigation.getParam('inqueryDate', {}),
          userEatKcal:0,
          userGoalTxt:"",
          recommendKcal:0,
          percent:0,
          goalKcal:0,
        }
    }
    componentDidMount = async() => {
      await this.callbackFnc();
    }
    callbackFnc = async() => {
      const foodList = await this.getFoodDiary();
      const statuses = await this.getMainIntakestatus();
      this.setState({
        photos:
        foodList.length > 0
            ? foodList
            : [
                {
                  firebaseDownloadUrl:"https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-6deb2ab9-8334-42c4-b38f-d889db792e42847907521.jpg?alt=media&token=f85d5f15-0cfb-4abe-ae19-9fd0501422b4",
                  registTime: "촬영한 사진이 없네요."
                }
              ],
        isEmptyPhotos: !foodList.length > 0 ,
        intakeStatuses: statuses.intakeStats,
        calorie: statuses.calorie,

        userEatKcal:statuses.userEatKcal,
        userGoalTxt:statuses.userGoalTxt,
        recommendKcal:statuses.recommendKcal,
        percent:statuses.percent,
        goalKcal:statuses.goalKcal,
        //spinnerVisible: false
      });
      COM = this;
      setTimeout(function(){ COM.setState({spinnerVisible:false}) }, 1500);
    }
    getMainIntakestatus = async () => {
      var rtn;
      await cFetch(
        APIS.GET_MAIN_INTAKESTATUS, [ this.props.USER_INFO.userId, "date", this.state.inqueryDate ], {},
        {
          responseProc: async (res) => {
            console.log("Main.js(getMainIntakestatus): "+JSON.stringify(res));
            rtn=res;
          }
        }
      );
      return rtn;
    }

    getFoodDiary = async () => {
      var rtn;
      await cFetch(
        APIS.GET_USER_FOOD, [ this.props.USER_INFO.userId, "date", this.state.inqueryDate ], {},
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
      if(this.props.isFocused&&this.props.FORCE_REFRESH_MAIN){
        this.props.forceRefreshMain(false);
        this.callbackFnc();
      }
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
        const content = (
          <Container
            toolbarDisplay={true}
            navigation={this.props.navigation}>
            <View style={styles.container}>

              <View
                style={styles.headerView}>



        {/* 분석  시작 */}
                <View style={{marginTop:70}}>
                <Text
                  style={{
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 12,
                    color: 'black',
                  }}>
                  {' '}너의 권장칼로리는 {' '}
                <Text style={{ fontWeight: '600' }}>
                  {this.state.recommendKcal}칼로리
                </Text>
                인데 현재 너는{' '}
                <Text style={{ fontWeight: '600' }}>
                  '{this.state.userGoalTxt}'
                </Text>
                이라는 목표를 가지고 있어. 이 목표를 이루려면{' '}
                <Text style={{ fontWeight: '600',color:'#E91E63' }}>
                {this.state.goalKcal}칼로리
                </Text>
                를 먹어야해. 그런데 너는 오늘{' '}
                <Text style={{ fontWeight: '600' ,color:'blue'}}>
                {this.state.userEatKcal}칼로리
                </Text>
                를 먹었어.{' '}
                  {'\n'}
                  <Text style={{ fontWeight: '800' }}>
                {this.state.percent > 100 && this.props.USER_INFO.dietGoalCd >900003
                  ? '니 뱃살을 보고도 슬픈감정이 안생긴다면 넌 싸이코패스야'
                  : this.state.percent > 15 && this.props.USER_INFO.dietGoalCd >900003
                    ? ' 너무 먹는거아니야? 당장 밥에서 그 손 떼! 그 한숟갈 더먹는다고 매우 행복하냐 이 돼지야!'
                    : this.state.percent > 0 && this.props.USER_INFO.dietGoalCd >900003
                      ? ' 잘하고있어 조금더 힘내자구!'
                      : this.state.percent > -10 && this.props.USER_INFO.dietGoalCd >900003
                        ? ' 잘하고있는데 너무 적게 먹는거 같아 너무 급한거아닐까?'
                        : this.props.USER_INFO.dietGoalCd >900003
                        ?' 너무 급하게 빼면 더 악효과가 일어나 조금 더 먹을 필요가 있어':''}
                    </Text>
                    <Text style={{ fontWeight: '800' }}>
                    {this.state.percent > 100 && this.props.USER_INFO.dietGoalCd ==900003
                      ? '니 뱃살을 보고도 슬픈감정이 안생긴다면 넌 싸이코패스야'
                      : this.state.percent > 15 && this.props.USER_INFO.dietGoalCd ==900003
                        ? ' 너무 먹는거아니야? 당장 밥에서 그 손 떼! 그 한숟갈 더먹는다고 매우 행복하냐 이 돼지야!'
                        : this.state.percent > 0 && this.props.USER_INFO.dietGoalCd ==900003
                          ? ' 잘하고있어 조금더 힘내자구!'
                          : this.state.percent > -100 && this.props.USER_INFO.dietGoalCd ==900003
                            ? ' 이러다가 더 멸치가 되겠어 한끼에 6끼씩 먹어보는건 어때?'
                            : this.props.USER_INFO.dietGoalCd ==900003
                           ?' 어디서 멸치냄새가 나지않아? 거울을 보면 그 정체를 알수있을거야 좀 먹자!!':''}
                      </Text>
                    <Text style={{ fontWeight: '800' }}>
                    {this.state.percent > 100 && this.props.USER_INFO.dietGoalCd <900003
                      ? '니 뱃살을 보고도 슬픈감정이 안생긴다면 넌 싸이코패스야'
                      : this.state.percent > 15 && this.props.USER_INFO.dietGoalCd <900003
                        ? ' 너무 급하게 찌면 더 악효과가 일어나 조금 덜 먹을 필요가 있어'
                        : this.state.percent > 0 && this.props.USER_INFO.dietGoalCd <900003
                          ? ' 잘하고있어 조금더 힘내자구!'
                          : this.state.percent > -100&& this.props.USER_INFO.dietGoalCd <900003
                            ? ' 이러다가 더 멸치가 되겠어 한끼에 6끼씩 먹어보는건 어때?'
                            : this.props.USER_INFO.dietGoalCd <900003
                            ?' 어디서 멸치냄새가 나지않아? 거울을 보면 그 정체를 알수있을거야 좀 먹자!!':''}
                      </Text>
              </Text>
              </View>

        {/* 분석  끝 */}


                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}>
                  <View flex={3} style={{height:height*0.14}}>
                  </View>
                  <View flex={width-height*0.15} height="100%">
                    <View flex={2} flexDirection="row" style={{padding:10, paddingTop:20}}>
                      <View flex={2} style={{backgroundColor:'rgb(72,207,173)', paddingLeft:10, justifyContent:"flex-end",alignSelf:"flex-end",alignItems:"flex-start"}}><Text style={{color:"white"}}>today {this.state.calorie.stat} kcal</Text></View>
                      <View flex={1} style={{backgroundColor:'rgb(255,206,84)', paddingRight:10, justifyContent:"flex-end", height:"40%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+{this.state.calorie.guage}</Text></View>
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
                          <Text style={[styles.itemName,{color:"black"}]}>{item.name}</Text>
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
                        borderColor={"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}
                      />
                    </View>
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                  )}
                />
              </View>

              <View style={styles.foodList}>
                <SectionGrid
                  itemDimension={width/2.1 *(this.state.isEmptyPhotos? 2:1)}
                  fixed
                  spacing={5}
                  sections={[
                    {
                      title: this.state.inqueryDate,
                      data: this.state.photos,
                    }
                  ]}
                  style={styles.gridView}
                  renderItem={({ item, section, index }) => (

                    <TouchableHighlight onPress={()=>{this.props.navigation.navigate("Food", {
                      food: item
                    })}}>
                    <BoxShadow setting={shadowOpt}>
                    <View style={{height:width/2*(this.state.isEmptyPhotos? 2:1)}}>
                      <View style={{position:"absolute", height:"100%",width:"100%",zIndex:1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0},textAlign:"center",textAlignVertical:"center"}}>
                        <Ionicons
                          name="ios-clock"
                          color="#ffffff"
                          size={FONT_BACK_LABEL*1.2}
                          borderWidth={0}/>
                          &nbsp;
                        {item.registTime}
                        </Text>
                      </View>
                      <FastImage
                        style={{height:width/2*(this.state.isEmptyPhotos? 2:1)}}
                        source={{
                          uri: item.firebaseDownloadUrl,
                          priority: FastImage.priority.normal,
                        }}
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
              </View>

            </View>
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
      position:'absolute',
      top:0,
      left:0,
      width: width
    },
    headerView: {
      height: height*0.15,
      paddingTop:10,
      paddingBottom:10
    },
     avatarTempImage: {
      height: height*0.14,
      width: height*0.14,
      borderRadius: height*0.2
    },
    statusView:{
      height: height*0.10,
      backgroundColor: "#FAFAFA"
    },
    foodList: {
      backgroundColor:"#F4F2F3",
      height: height*0.58
    },profileUserEmail: {
      fontSize: FONT_BACK_LABEL*1.2,
      color:"rgba(0,0,0,1)"
    }, profileWiseSaying: {
      fontSize: FONT_BACK_LABEL*0.8
    },
    gridView: {
      flex: 1,
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
      color: 'black',
      padding: 10,
      paddingBottom: 0
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(DayDiary));