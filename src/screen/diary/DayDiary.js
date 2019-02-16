import React, {Component} from 'react';

import {ScrollView, Dimensions, StyleSheet, Text, View, PixelRatio, TouchableOpacity} from 'react-native';
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import Container from '@container/Container';
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Octicons from 'react-native-vector-icons/Octicons';
import { COLOR } from 'react-native-material-ui';

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import { withNavigationFocus } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Food from "@screens/food";
import ViewShot, {captureRef, captureScreen} from "react-native-view-shot";
import Images from "@assets/Images";
import Share, { ShareSheet, Button } from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";

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
          //spinnerVisible: true,
          inqueryDate: {},
          value: {
              format: "jpg",
              quality: 0.5,
              result: "tmpfile",
              snapshotContentContainer: true
          },
          previewSource:Images.empty,
          error: null,
          res: null,
          visible: false,
          onCaptureUri: null,
          inqueryDate: this.props.navigation.getParam('inqueryDate', {}),
          userEatKcal:0,
          userGoalTxt:"",
          recommendKcal:0,
          percent:0,
          goalKcal:0,
        }
    }
    onShare = async(url) => {
        this.setState({spinnerVisible:false});
        console.warn(url);
        RNFetchBlob.fs.readFile(url, "base64").then(data => {
            console.warn(data);
            Share.open({
                title: "찍먹",
                url: "data:image/png;base64," + data,
                showAppsToView: true
            });
        });
    }
    onCancel() {
      console.log("CANCEL");
      this.setState({ visible: false });
    }
    onCapture = (uri) =>{
      console.log("do something with ", uri);
      this.setState({onCaptureUri: uri});
    }
    snapshot = (refname) =>
    {
      captureRef(this.refs[refname], this.state.value)
      /*
    (refname
      ? captureRef(this.refs[refname], this.state.value)
      : captureScreen(this.state.value)
    )*/
      .then(res => {
        const data = new FormData();
        let filelocation =
          this.state.value.result === "base64"
            ? "data:image/" + this.state.value.format + ";base64," + res
            : res;
        this.onShare(filelocation);
        this.setState({
          spinnerVisible:true,
          error: null,
          res,
          previewSource: {
            uri:
              this.state.value.result === "base64"
                ? "data:image/" + thㅔis.state.value.format + ";base64," + res
                : res
          }
        });
      })
      .catch(
        error => (
          console.warn(error),
          this.setState({ error, res: null, previewSource: null })
        )
      );
    }
    componentWillMount(){
      this.setState({
        inqueryDate:this.props.navigation.getParam('inqueryDate', {})?this.props.navigation.getParam('inqueryDate', {}): this.props.inqueryDate
      })
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
        const analysisView =(
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
          {this.state.userComment}
            </Text>
        </Text>
        </View>
      {/* 분석  끝 */}
        )
        const headerView = (
        <View style={styles.headerView}>
          <View flexDirection="row" style={{padding:10, paddingTop:20}} height="100%">
            <View flex={2} style={{backgroundColor:'rgba(72,207,173,1)', paddingLeft:10, justifyContent:"center"}}><Text style={{color:"white"}}>today {this.state.calorie.stat} kcal</Text></View>
            <View flex={1} style={{backgroundColor:'rgba(255,206,84,1)', paddingRight:10, justifyContent:"center", height:"70%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+{this.state.calorie.guage}</Text></View>
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
          />
        </View>
        )
        const foodList = (
        <View style={styles.foodList}>
          {this.state.inqueryDate? (
          <Text style={styles.sectionHeader}>
            <Octicons name="calendar" color="#000000" size={FONT_BACK_LABEL}/>{"  "+this.state.inqueryDate}
          </Text>
          ):null}
            {this.state.photos.map(function(v,i){
              return (
                <Food key={i} footUnDisplay={true} toolbarDisplay={false} food={v} navigation={this.navigation}/>)
            })}
        </View>
        )
        const shareView = (
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems:"center", position:'absolute', width:width, zIndex:10,bottom:0 }}>
            <TouchableOpacity
              onPress={() => this.snapshot("full")
              //this.onShare(this.state.onCaptureUri)
              }
              style={[styles.analysis,
                  {elevation:5,shadowColor:COLOR.grey900,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2}]}>
                <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}>
                공유하기
                </Text>
            </TouchableOpacity>
          </View>
          );
        const content = (
          <View flex={1}>
            {this.props.inqueryDate? null: shareView}
            <Container
              toolbarDisplay={false}
              navigation={this.props.navigation}
              footUnDisplay={true}>
              <ScrollView flex={1} collapsable={false} ref="full" style={styles.container}>
                  {analysisView}
                  {headerView}
                  {statusView}
                  {foodList}
              </ScrollView>
            </Container>
              <Spinner
                visible={this.state.spinnerVisible}
                textContent={'잠시만 기다려 주세요...'}
                textStyle={{color: '#FFF'}}
              />
          </View>
          );
          return content
    }
}


const styles = StyleSheet.create({
    analysis: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
    container: {
      flex: 1,
      width: width,backgroundColor:'white'
    },
    headerView: {
      flex:8,
      paddingTop:5,
      paddingBottom:5
    },
    statusView:{
      flex: 14,
      backgroundColor: "#FAFAFA"
    },
    foodList: {
      backgroundColor:"#F8F4F6",
      flex: 65
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
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(DayDiary));