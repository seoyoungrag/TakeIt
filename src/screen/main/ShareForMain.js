import React, {Component} from 'react';

import {ScrollView, Dimensions, StyleSheet, Text, View, PixelRatio, TouchableOpacity} from 'react-native';
import Container from '@container/Container';
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Octicons from 'react-native-vector-icons/Octicons';
import { COLOR } from 'react-native-material-ui';

import Spinner from 'react-native-loading-spinner-overlay';
import Food from "./ShareForFood";
import ViewShot, {captureRef, captureScreen} from "react-native-view-shot";
import Images from "@assets/Images";
import Share, { ShareSheet, Button } from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";

const {width, height} = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

export default class ShareForMain extends Component {
    constructor(props){
        super(props);
        this.state = {
          isEmptyPhotos : false,
          calorie: {},
          spinnerVisible: true,
          value: {
              format: "jpg",
              quality: 0.9,
              result: "tmpfile",
              //snapshotContentContainer: true
          },
          previewSource:Images.empty,
          error: null,
          res: null,
          visible: false,
          onCaptureUri: null,
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
          }
        }
    }
    onShare = async(url) => {
        //console.warn(url);
        this.setState({spinnerVisible:false});
        RNFetchBlob.fs.readFile(url, "base64").then(data => {
            //console.warn(data);
            Share.open({
                title: "찍먹 - 다이어트 필수 사진앱",
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
      this.setState({spinnerVisible:true})
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
          spinnerVisible:false,
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
          this.setState({ error, res: null, previewSource: null, spinnerVisible:false })
        )
      );
    }
    componentWillMount(){
    }
    componentDidMount = async() => {
      this.setState({spinnerVisible:false})
    }

    render() {
      console.log("==================================================="+this.props.analysises);
      const analysisView =(
        <View style={{
          padding:10
        }}>
          <View style={{
            marginBottom:10
          }}>
          <Text style={{ fontWeight: '300' ,color:'#7a7a7a' }}>
          이 이미지는{' '}
            <Text style={{ fontWeight: '800',color:'#E91E63' }}>
            '찍먹 - 다이어트 필수 사진앱'
            </Text>
          {' '}에서 공유한 사진입니다.
          </Text>
        </View>
          <Text
            style={{
              fontFamily: 'NotoSans-Regular',
              fontSize: 12,
              color: 'black',
            }}>
            {' '}{this.props.analysises.analyComment1} {' '}
            <Text style={{ fontWeight: '600' }}>
              {this.props.analysises.recommendKcal}
            </Text>
            {this.props.analysises.analyComment2}{' '}
            <Text style={{ fontWeight: '600' }}>
              '{this.props.analysises.userGoalTxt}'
            </Text>
            {this.props.analysises.analyComment3}{' '}
            <Text style={{ fontWeight: '600',color:'#E91E63' }}>
            {this.props.analysises.goalKcal}
            </Text>
            {this.props.analysises.analyComment4}{' '}
            <Text style={{ fontWeight: '600' ,color:'blue'}}>
            {this.props.analysises.userEatKcal}
            </Text>
            {this.props.analysises.analyComment5}{' '}
              {'\n'}
              {'\n'}
              <Text style={{ fontWeight: '800' }}>
            {this.props.analysises.userComment}
              </Text>
        </Text>
      </View>
      )

        const headerView = (
        <View style={styles.headerView}>
          <View flexDirection="row" style={{padding:10, paddingTop:0}} height="100%">
            <View flex={2} style={{backgroundColor:'rgba(72,207,173,1)', paddingLeft:10, justifyContent:"center"}}><Text style={{color:"white"}}>today {this.props.calorie.stat} kcal</Text></View>
            <View flex={1} style={{backgroundColor:'rgba(255,206,84,1)', paddingRight:10, justifyContent:"center", height:"70%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+{this.props.calorie.guage}</Text></View>
          </View>
        </View>);
        const statusView = (
          <View style={styles.statusView}>
          <FlatGrid
            itemDimension={width/2.1}
            fixed
            spacing={0}
            items={this.props.intakeStatuses}
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
        const navigation = this.props.navigation;
        const photos = this.props.photos;
        const foodList = (
        <View style={styles.foodList}>
          <Text style={styles.sectionHeader}>
            <Octicons name="calendar" color="#000000" size={FONT_BACK_LABEL}/>{"  "+this.props.inqueryDate}
          </Text>
            {this.props.photos.map(function(v,i){
              //console.warn(photos.length*width);
              return (
                <Food key={i} footUnDisplay={true} toolbarDisplay={false} food={v} navigation={navigation}/>)
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
          <View style={{height: this.props.fullHeight}}>
            {this.props.inqueryDate? null: shareView}
              <ScrollView flex={1} collapsable={false} ref="full" style={[styles.container]} >
                  {analysisView}
                  {headerView}
                  {statusView}
                  {foodList}
              </ScrollView>
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
