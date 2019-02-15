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
import Food from "@screens/food";

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
          inqueryDate: this.props.navigation.getParam('inqueryDate', {})
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
        calorie: statuses.calorie
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
            navigation={this.props.navigation}
            footUnDisplay={true}>
            <View style={styles.container}>

              <View
                style={styles.headerView}>

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
                  itemDimension={width}
                  fixed
                  spacing={0}
                  sections={[
                    {
                      title: this.state.inqueryDate,
                      data: this.state.photos,
                    }
                  ]}
                  style={styles.gridView}
                  renderItem={({ item, section, index }) => (
                    <Food footUnDisplay={true} toolbarDisplay={false} food={item} navigation={this.navigation}/>
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
          return content
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
      height: height*0.78
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