
import React, {Component} from 'react';
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
import { Button,COLOR } from 'react-native-material-ui';
import { PixelRatio, Text, View, StyleSheet, Dimensions, ScrollView, Alert, AsyncStorage} from "react-native"

import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import Container from '@container/Container';
import Moment from "moment";
import { TextField } from "react-native-material-textfield";
import { Dropdown } from 'react-native-material-dropdown';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

const {width, height} = Dimensions.get("window");
function mapStateToProps(state) {
  return {
    TIMESTAMP: state.REDUCER_CONSTANTS.timestamp,
    USER_INFO: state.REDUCER_USER.user,
    CODE: state.REDUCER_CODE.code
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
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
class Setting extends Component {
    constructor(props){
      super(props)
      this.dietGoal = 
        this.props.CODE.list.filter(
          function(item){
            if(Number(item.codeCategory)==90000){
              return true;
            }
          }).map(function(v){
              return ({key: v.code, value:v.codeValue});
            });
      this.state ={
        personHeight:
        this.props.USER_INFO.inbodyInfo.height != undefined
          ? String(this.props.USER_INFO.inbodyInfo.height)
          : this.props.USER_INFO.userHeight? String(this.props.USER_INFO.userHeight):"",
        personWeight:
        this.props.USER_INFO.inbodyInfo.weight != undefined
          ? String(this.props.USER_INFO.inbodyInfo.weight)
          : this.props.USER_INFO.userWeight? String(this.props.USER_INFO.userWeight):"",
        personFat:
        this.props.USER_INFO.inbodyInfo.fat != undefined
          ? String(this.props.USER_INFO.inbodyInfo.fat)
          : "",
        personMuscle:
        this.props.USER_INFO.inbodyInfo.muscle != undefined
          ? String(this.props.USER_INFO.inbodyInfo.muscle)
          : "",
        personDietGoal: this.props.USER_INFO.dietGoal != undefined
            ? this.dietGoal[this.dietGoal.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value: "현재 체중 유지하기"
      }
      this.handleBackButton = this.handleBackButton.bind(this);
      this.onFocus = this.onFocus.bind(this);
      this.saveBtnPressed = this.saveBtnPressed.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this.onSubmitPersonHeight = this.onSubmitPersonHeight.bind(this);
      this.onSubmitPersonWeight = this.onSubmitPersonWeight.bind(this);
      this.onSubmitPersonFat = this.onSubmitPersonFat.bind(this);
      this.onSubmitPersonMuscle = this.onSubmitPersonMuscle.bind(this);
      this.onSubmitPersonDietGoal = this.onSubmitPersonDietGoal.bind(this);


      this.personHeightRef = this.updateRef.bind(this, "personHeight");
      this.personWeightRef = this.updateRef.bind(this, "personWeight");
      this.personFatRef = this.updateRef.bind(this, "personFat");
      this.personMuscleRef = this.updateRef.bind(this, "personMuscle");
      this.personDietGoalRef = this.updateRef.bind(this, "personDietGoal");

/*
      [
        {
          key: 900001,
          value: "체중 증가"
        },
        {
          key: 900002,
          value: "느린 체중 증가"
        },
        {
          key: 900003,
          value: "현재 체중 유지"
        },
        {
          key: 900004,
          value: "느린 체중 감소"
        },
        {
          key: 900005,
          value: "체중 감소"
        },
      ];
      */
    }

    handleBackButton() {
      return true;
    }

    canUpdateSetting = async () => {
      const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SETTINGUPDATECNT";
      var settingUpdateCnt = await AsyncStorage.getItem(storKey);
      settingUpdateCnt = Number(settingUpdateCnt);
      if(!settingUpdateCnt){
        settingUpdateCnt = 0;
        await AsyncStorage.setItem(storKey, settingUpdateCnt.toString());
      }
      var maxSettingUpCnt = this.props.TIMESTAMP.settingupcnt||this.props.TIMESTAMP.settingupcnt==0?this.props.TIMESTAMP.settingupcnt: 3;
      //console.warn(settingUpdateCnt+"vs"+maxSettingUpCnt);
      if(settingUpdateCnt>=maxSettingUpCnt){
        return false;
      }else{
        return true;
      }
    }

    onFocus() {
      let { errors = {} } = this.state;
      let ref = null;
      for (let name in errors) {
          ref = this[name];
      }
      if (ref && ref.isFocused()) {
        delete errors[name];
      }

      this.setState({ errors });
    }

    onChangeText(text) {
      ["personHeight","personWeight","personFat","personMuscle","personDietGoal"]
        .map(name => ({ name, ref: this[name] }))
        .forEach(({ name, ref }) => {
          //let value = this[name].value();//현재 선택되기 전의 값을 가지고 옴
          //text가 현재 선택한 값
          if (ref.isFocused()) {
            this.setState({ [name]: text });
          }
        });
    }

    onSubmitPersonHeight() {this.personWeight.focus();}
    onSubmitPersonWeight() {this.personMuscle.focus();}
    onSubmitPersonFat() {this.personFat.blur();}
    onSubmitPersonMuscle() {this.personFat.focus();}
    onSubmitPersonDietGoal() {this.personHeight.focus();}


    updateSetting = async() => {

      let errors = {};
      ["personHeight","personWeight","personFat","personMuscle","personDietGoal"]
      .forEach((name) => {
        let value = this[name].value();
        
        if (!value) {
          errors[name] = '필수 입력입니다.';
        }
        if(name!='personDietGoal'){
          if(isNumeric(value)){
            //console.warn(name +','+value);
            var numberRegExp = /^\d{1,3}$/;
            var decimalRegExp = /^\d+(\.\d{1,2})?$/;
            //console.warn(numberRegExp.test(Number(value).toFixed(0))); // false
            //console.warn(decimalRegExp.test(value)); // false
            if(!numberRegExp.test(Number(value).toFixed(0)) || !decimalRegExp.test(value)){
              errors[name] = '정수 3, 소수는 2자리까지만 가능해요.';
            }
          }else{
            errors[name] = '숫자만 입력해주세요.';
          }
        }
        //personHeight,personWeight,personFat,personMuscle
      });

      this.setState({ errors });
      
      if(Object.keys(errors).length === 0){
        var data = this.props.USER_INFO;
        console.log("Setting: before post Data in Setting.js start--");
        console.log(data);
        console.log("Setting: before post Data in Setting.js end --");
        if(!data.inbodyInfo){
          data.inbodyInfo ={};
        }
        data.inbodyInfo.height = this.state.personHeight;
        data.inbodyInfo.weight = this.state.personWeight;
        data.inbodyInfo.fat = this.state.personFat;
        data.inbodyInfo.muscle = this.state.personMuscle;
        let foundIndex = this.dietGoal.findIndex(
          x => {
            //console.warn (x.value + ','+this.state.personDietGoal);
            return x.value == this.state.personDietGoal;
          }
        );
        console.log(this.dietGoal);
        console.log(this.dietGoal[foundIndex]);
        data.dietGoal = this.dietGoal[foundIndex].key;
        console.log("Setting: after post Data in Setting.js start--");
        console.log(data);
        console.log("Setting: after post Data in Setting.js end --");

        var body = JSON.stringify(data);
        const PROPS = this.props;
        if (!data.inbodyInfo.height || !data.inbodyInfo.weight || !data.inbodyInfo.fat || !data.inbodyInfo.muscle || !data.dietGoal) {
          //alert("미입력된 정보가 있습니다. 확인해주세요.");
        } else {
          var isSended = false;
          await cFetch(APIS.PUT_USER_SETTING_BY_EMAIL, [this.props.USER_INFO.userEmail+"/"], body, {
            responseProc: function(res) {
              console.log("Setting.js :"+ JSON.stringify(res));
              PROPS.setUserInfo(res);
              PROPS.forceRefreshMain(true);
              isSended = true;
              alert('저장이 완료되었습니다.');
              //PROPS.navigation.navigate("Main");
            },
            //입력된 회원정보가 없음.
            responseNotFound: function(res) {
              alert("유저 업데이트가 실패했습니다.");
              //PROPS.navigation.navigate("Login");
              // APIS.PUT_SUER_BY_PHONE에서 사용자가 없으면 생성되어야 한다.
            }
          });
        }
        if(isSended){
          const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SETTINGUPDATECNT";
          var settingUpdateCnt = await AsyncStorage.getItem(storKey);
          settingUpdateCnt = Number(settingUpdateCnt);
          if(settingUpdateCnt){
            await AsyncStorage.removeItem(storKey);
          }else{
            settingUpdateCnt = 0;
          }
          settingUpdateCnt += 1;
          await AsyncStorage.setItem(storKey, settingUpdateCnt.toString());
        }
        console.log("Setting.js: save btn pressed in Setting.js end");
    }
    }

    saveBtnPressed = async() => {
      var maxSettingUpCnt = this.props.TIMESTAMP.settingupcnt||this.props.TIMESTAMP.settingupcnt==0?this.props.TIMESTAMP.settingupcnt: 3;
      
      var canUpdateSetting = await this.canUpdateSetting();
      //console.warn(canUpdateSetting);
      if(!canUpdateSetting){
        Alert.alert("업로드 횟수를 초과하였습니다.","인바디입력은 하루 "+maxSettingUpCnt+"회만 가능합니다.");
        return false;
      }
      
      //0. 경고창 다시보기 체크되어있는지 체크
      const periodUpdateSettingAlertStorKey = "@UPDATESETTINGALERTPERIOD";
      var UPDATESETTINGALERTPERIOD = await AsyncStorage.getItem(periodUpdateSettingAlertStorKey);
      var isShowConfirmAlert = false;
      UPDATESETTINGALERTPERIOD = Number(UPDATESETTINGALERTPERIOD);
      //0-1. 저장된 적이 없거나, 저장되었는데 1주일이 넘었으면 flag는 true로
      if(!UPDATESETTINGALERTPERIOD || Math.abs(UPDATESETTINGALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7)){
        isShowConfirmAlert = true;
        await AsyncStorage.removeItem(periodUpdateSettingAlertStorKey);
      }
      const storKey = "@"+Moment(new Date()).format('YYMMDD')+"SETTINGUPDATECNT";
      var settingUpdateCnt = await AsyncStorage.getItem(storKey);
      settingUpdateCnt = Number(settingUpdateCnt);
      if(isShowConfirmAlert){
        Alert.alert('저장하시겠습니까?','인바디 입력은 하루 '+maxSettingUpCnt+'회 가능합니다.\n현재: '+(settingUpdateCnt? String(settingUpdateCnt): '0')+'회',
        [
          {text: '일주일간 보지않기', onPress: () => 
            {
              AsyncStorage.setItem(periodUpdateSettingAlertStorKey, this.props.TIMESTAMP.timestamp.toString());
              this.updateSetting();
            }
          },
          {
            text: '취소',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: () => this.updateSetting()
          }],
          { cancelable: false });
        }else{
          this.updateSetting();
        }
    }

    updateRef(name, ref) {
      this[name] = ref;
    }

    
    componentDidMount() {
    
      this.props.navigation.setParams({
        onGroupPressed: this.onGroupPressed,
      })
    }
    onSlideValueChanged = () => {
    
    }
  
    onGroupPressed = () => {
    
      this.props.navigation.goBack()
    }

    render() {
      let { errors = {}, ...data } = this.state;
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
      return  (
      <Container 
        title={this.props.USER_INFO.userEmail+"님의 설정"}
        toolbarDisplay={true} 
        navigation={this.props.navigation}
        footUnDisplay={true}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollDisabled
            style={{ width: "100%" }}
          >
          {/**
        <View
          style={styles.profileSettingsView}>
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
         */}
          <View
            style={styles.informationView}>
            <View
              style={styles.group7View}>
              <Text
                style={styles.detailsText}>목표설정</Text>
            </View>
            <View
              style={styles.group6View}>
              <View
                style={styles.uiSettingsCellView}>
                <Text
                  style={styles.labelText}>다이어트 목표</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}>
                  <Dropdown
                      textColor={COLOR.pink500}
                      baseColor={COLOR.pink500}
                      tintColor={COLOR.pink900}
                      itemColor={COLOR.pink500}
                      selectedItemColor={COLOR.pink800}
                      disabledItemColor={COLOR.pink300}
                      pickerStyle={{backgroundColor:"white", borderWidth:1, borderColor:"silver"}}
                      fontSize={styles.textFieldFontSize}
                      containerStyle={[styles.textFieldContainerStyle]}
                      labelHeight={styles.textFieldLabelHeight}
                      ref={this.personDietGoalRef}
                      value={data.personDietGoal}
                      data={this.dietGoal}
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitPersonDietGoal}
                      returnKeyType="next"
                      label=''
                      error={errors.personDietGoal}
                  />
                    {/**
                  <Text
                    style={styles.textText}>현재 체중 유지하기</Text>
                     */}
                </View>
              </View>
            </View>

            <View
              style={styles.group4View}>
              <Text
                style={styles.informationText}>인바디 수치 입력</Text>
            </View>
            <View
              style={styles.group3View}>
              <Text
                style={styles.labelThreeText}>키</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                
                <TextField
                  textColor={COLOR.pink500}
                  baseColor={COLOR.pink500}
                  tintColor={COLOR.pink900}
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personHeightRef}
                  value={data.personHeight}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonHeight}
                  returnKeyType="next"
                  label=""
                  keyboardType='numeric'
                  //title='cm단위로 입력해주세요.'
                  error={errors.personHeight}
                />
                <Text
                  style={styles.textThreeText}><Text style={{color:COLOR.pink500}}>cm</Text></Text>
              </View>
            </View>
            <View
              style={styles.group3View}>
              <Text
                style={styles.labelThreeText}>몸무게</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <TextField
                  textColor={COLOR.pink500}
                  baseColor={COLOR.pink500}
                  tintColor={COLOR.pink900}
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personWeightRef}
                  value={data.personWeight}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonWeight}
                  returnKeyType="next"
                  label=""
                  keyboardType='numeric'
                  //title='kg단위로 입력해주세요.'
                  error={errors.personWeight}
                />
                <Text
                  style={styles.textThreeText}><Text style={{color:COLOR.pink500}}>kg</Text></Text>
              </View>
            </View>
            <View
              style={styles.group2View}>
              <Text
                style={styles.labelSixText}>근육량</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <TextField
                  textColor={COLOR.pink500}
                  baseColor={COLOR.pink500}
                  tintColor={COLOR.pink900}
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personMuscleRef}
                  value={data.personMuscle}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonMuscle}
                  returnKeyType="next"
                  keyboardType='numeric'
                  label=""
                  error={errors.personMuscle}
                />
                <Text
                  style={styles.textThreeText}><Text style={{color:COLOR.pink500}}>kg</Text></Text>
              </View>
            </View>
            <View
              style={styles.group2View}>
              <Text
                style={styles.labelSixText}>체지방량</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <TextField
                  textColor={COLOR.pink500}
                  baseColor={COLOR.pink500}
                  tintColor={COLOR.pink900}
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personFatRef}
                  value={data.personFat}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonFat}
                  returnKeyType='done'
                  keyboardType='numeric'
                  label=""
                  error={errors.personFat}
                />
                <Text
                  style={styles.textThreeText}><Text style={{color:COLOR.pink500}}>kg</Text></Text>
              </View>
            </View>
            {/**
            <View
              style={styles.groupView}>
              <Text
                style={styles.labelFourText}>로그인 중</Text>
              <Text
                style={styles.labelFiveText}>{this.props.USER_INFO.userEmail}</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <Text
                  style={styles.textFourText}>로그아웃</Text>
              </View>
            </View>
             */}
          </View>
            <View
              style={{
                width: "100%"
              }}
            >
              <Button
                style={{
                  container:{
                      height:height*0.08,
                      marginLeft:10, marginRight:10,
                      marginTop:20,
                      //backgroundColor: "rgba(0,0,0,0.1)",
                      borderColor: COLOR.pink500,
                      borderWidth: 1,
                      //borderRadius: 100,
                  },
                  text:{color:COLOR.pink500}
                }}
                icon="check"
                raised
                text=""
                onPress={this.saveBtnPressed}
              />
            </View>
          </ScrollView>
        {/*</View>*/}
        </Container>)
    }
  }
  
  const styles = StyleSheet.create({
    navigationBarItem: {
    },
    navigationBarItemIcon: {
      tintColor: 'rgb(255, 255, 255)',
    },
    headerLeftContainer: {
      flexDirection: "row",
      marginLeft: 8,
    },
    navigationBarGradient: {
      flex: 1,
    },
    profileSettingsView: {
      backgroundColor: 'rgb(243, 242, 243)',
      flex: 1,
      alignItems: "stretch",
    },
    avatarTempImage: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      resizeMode: "stretch",
      marginTop: 88,
      alignSelf: "center",
      width: 92,
      height: 92,
    },
    informationView: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginTop: 19,
      height: 380,
      alignItems: "stretch",
    },
    group7View: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginLeft: 20,
      alignSelf: "flex-start",
      width: "100%",
      height: 15,
      justifyContent: "center",
      alignItems: "stretch",
    },
    detailsText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      opacity: 0.4,
      color: 'rgb(0, 0, 0)',
      fontFamily: ".AppleSystemUIFont",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: -0.07,
    },
    group6View: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginTop: 10,
      height: 60,
      justifyContent: "center",
      alignItems: "stretch",
    },
    uiSettingsCellView: {
      backgroundColor: 'rgb(255, 255, 255)',
      height: 60,
      flexDirection: "row",
      alignItems: "center",
    },
    labelText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 20,
    },
    textText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(217, 103, 110)',
      fontFamily: "Lato-Bold",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "bold",
      textAlign: "right",
      letterSpacing: 0,
      marginRight: 14,
    },
    path2Image: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      resizeMode: "center",
      marginRight: 19,
      width: 7,
      height: 13,
    },
    group5View: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      height: 60,
      justifyContent: "center",
      alignItems: "stretch",
    },
    uiSettingsCellTwoView: {
      backgroundColor: 'rgb(255, 255, 255)',
      height: 60,
      flexDirection: "row",
      alignItems: "center",
    },
    labelTwoText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 20,
    },
    textTwoText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(217, 103, 110)',
      fontFamily: "Lato-Bold",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "bold",
      textAlign: "right",
      letterSpacing: 0,
      marginRight: 14,
    },
    path2TwoImage: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      resizeMode: "center",
      marginRight: 19,
      width: 7,
      height: 13,
    },
    group4View: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginLeft: 20,
      marginTop: 30,
      alignSelf: "flex-start",
      width: "100%",
      height: 15,
      justifyContent: "center",
      alignItems: "stretch",
    },
    informationText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      opacity: 0.4,
      color: 'rgb(0, 0, 0)',
      fontFamily: ".AppleSystemUIFont",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: -0.07,
    },
    group3View: {
      backgroundColor: 'rgb(255, 255, 255)',
      marginTop: 10,
      height: 60,
      flexDirection: "row",
      alignItems: "center",
    },
    labelThreeText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 20,
    },
    textThreeText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(217, 103, 110)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "right",
      letterSpacing: 0,
      marginRight: 20,
    },
    group2View: {
      backgroundColor: 'rgb(255, 255, 255)',
      height: 60,
      flexDirection: "row",
      alignItems: "center",
    },
    labelSixText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 20,
    },
    slideSwitch: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginRight: 20,
    },
    groupView: {
      backgroundColor: 'rgb(255, 255, 255)',
      height: 60,
      flexDirection: "row",
      alignItems: "center",
    },
    labelFourText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      opacity: 0.4,
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 20,
    },
    labelFiveText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(4, 11, 22)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      letterSpacing: 0,
      marginLeft: 10,
    },
    textFourText: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      color: 'rgb(217, 103, 110)',
      fontFamily: "Lato-Regular",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "right",
      letterSpacing: 0,
      marginRight: 20,
    },
    textFieldContainerStyle: {
      width: 200,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
    },
    textFieldLabelStyle: {
      width: 100,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0
    },
    textFieldFontSize: FONT_BACK_LABEL,
    textFieldLabelHeight: 10
  })
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Setting));