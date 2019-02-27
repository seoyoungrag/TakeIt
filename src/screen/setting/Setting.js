
import React, {Component} from 'react';
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
import { Button,COLOR,Checkbox } from 'react-native-material-ui';
import { Platform, Linking, PixelRatio, Text, View, StyleSheet, Dimensions, ScrollView, Alert, AsyncStorage, Switch} from "react-native"

import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import Container from '@container/Container';
import Moment from "moment";
import { TextField } from "react-native-material-textfield";
import { Dropdown } from 'react-native-material-dropdown';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import firebase from "react-native-firebase";

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
    },
    setCode: data => {
      dispatch(ActionCreator.setCode(data));
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
      this.dietGoal = this.props.CODE.list.filter(
        function(item){
          if(Number(item.codeCategory)==90000){
            return true;
          }
        }).map(function(v){
            return ({key: v.code, value:v.codeValue});
        });
      this.state ={
        analysisPushGranted: false,
        fasting8PushGranted: false,
        fasting16PushGranted: false,
        fasting24PushGranted: false,
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
          : "0",
        personMuscle:
        this.props.USER_INFO.inbodyInfo.muscle != undefined
          ? String(this.props.USER_INFO.inbodyInfo.muscle)
          : "0",
        dietGoal: this.dietGoal,
        personDietGoal: this.dietGoal&&this.dietGoal.length>0? this.dietGoal[this.dietGoal.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value : "현재 체중 유지하기"
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
    analysisPushSwitchChange = async () =>{
      var apsFinallyGranted = false;
      //기존 권한이 off에서 on으로 바뀌는 경우에만 권한을 체크하고 권한을 요청한다.
      if(!this.state.analysisPushGranted){
        apsFinallyGranted = await firebase.messaging().hasPermission();
        console.warn(apsFinallyGranted);
        if (!apsFinallyGranted) {
            //ANDROID는 requestPermission이 다시 동작하지 않는다. 설명을 보면 위험한 권한이 아니기 때문에 권한을 물어볼 필요가 없다고 한다. 즉, 기본값이 ON이며 사용자가 굳이 끈 경우 설정화면으로 이동시켜줘야 한다. 
            //https://stackoverflow.com/questions/44305206/ask-permission-for-push-notification?rq=1
            //IOS에서는 권한을 두번 물어볼 수가 없어 OS설정화면으로 이동시켜줘야 한다.
            //apsFinallyGranted = await firebase.messaging().requestPermission();
          if(Platform.OS === 'android' ){
            await Alert.alert("앱의 환경설정에서 알림 권한을 허용해주세요.","설정 > 애플리케이션 관리자 > 찍먹 - .. > 알림 > 알림 허용 [체크]");
          }else{
            await Alert.alert(
              "앱의 환경설정에서 알림 권한을 허가해 주세요.", 
              "앱 환경설정 화면으로 이동할까요?",
              [
                {text: '아니오', onPress: () =>  {alert("앱 알림 권한을 허가해 주셔야 스위치를 킬 수 있어요.");}},
                {text: '네', onPress: async () =>  { await Linking.openURL('app-settings://'); }
                }
              ]
            );
            
            
          }
          
        }
        apsFinallyGranted = await firebase.messaging().hasPermission();
        if(!apsFinallyGranted){
          return;
        }
      }
      this.setState({
        analysisPushGranted: !this.state.analysisPushGranted
      })
    }
    checkPushToken = async () => {
      const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          this.setState({
            analysisPushGranted : true
          })
          try{
            const token = await firebase.messaging().getToken()
            if (token) {
              return token;
            } else {
            }
          }catch(error){
          console.log("settings.js: have permission, but failed to get token:", error)
          };
        } else {
          try{
            console.warn("settings.js: isGranted:", error)
          const isGranted = await firebase.messaging().requestPermission();
          console.warn(isGranted);
          const token = await firebase.messaging().getToken();
          if (token) {
            return token;
          } else {
            console.log("settings.js: no token yet");
          }
          }catch (e){
            console.warn('error');
            console.warn(e);
          }
        }
    }
    componentWillMount = async() => {
      const enabled = await firebase.messaging().hasPermission();
      console.warn("settings.js: push perm check start");
      console.warn(enabled);
      var fasting8PushGranted = this.props.USER_INFO.fasting8PushYn && this.props.USER_INFO.fasting8PushYn=="Y" ? true: false;
      var fasting16PushGranted = this.props.USER_INFO.fasting16PushYn&& this.props.USER_INFO.fasting16PushYn=="Y" ? true: false;
      var fasting24PushGranted = this.props.USER_INFO.fasting24PushYn&& this.props.USER_INFO.fasting24PushYn=="Y" ? true: false;
      this.setState({
        fasting8PushGranted, fasting16PushGranted, fasting24PushGranted
      })
      const dbEnabled = this.props.USER_INFO.analysisPushYn ? this.props.USER_INFO.analysisPushYn : "Y";
        if (enabled && dbEnabled=="Y") {
          this.setState({
            analysisPushGranted : true
          })
        }else{
          //앱에 권한이 없거나, 사용자가 알림 수신을 원치 않으 경우 off상태로 보이게 함.
          this.setState({
            analysisPushGranted : false
          })
        }
      var list =this.props.CODE.list.filter(
        function(item){
          if(Number(item.codeCategory)==90000){
            return true;
          }
        }).map(function(v){
            return ({key: v.code, value:v.codeValue});
        });
      if(list && list.length>0){
        /*
        this.setState({
          dietGoal:list,
          personDietGoal: list[list.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value
        });
        */
      }else{
        var code;
        await cFetch(
          APIS.GET_CODE, [], {},
          {
            responseProc: async (res) => {
              code = res;
            }
          }
        );
        const CODE = await AsyncStorage.getItem("@CODE");
        if(CODE){
          await AsyncStorage.removeItem("@CODE");
        }
        this.props.setCode(code);
        const strCode = JSON.stringify(code);
        await AsyncStorage.setItem('@CODE', strCode )
        .then( ()=>{
          console.log('Settings.js code refresh')
        } )
        .catch( ()=>{
          console.log('settings.js error')
          console.warn(e);
        } )
        var tmplist = []
        if(code && code.list && code.list.length >0){
          tmplist = code.list.filter(
          function(item){
            if(Number(item.codeCategory)==90000){
              return true;
            }
          }).map(function(v){
              return ({key: v.code, value:v.codeValue});
          });
          this.setState({
            dietGoal:tmplist,
            personDietGoal: tmplist[tmplist.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value
          }); 
          //console.warn(tmplist);
          //console.warn(tmplist[tmplist.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value)
        }

      }
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
      if(errors && errors.length >0){
        for (let name in errors) {
            ref = this[name];
        }
        if (ref && ref.isFocused()) {
          delete errors[name];
        }
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
        if(name!='personWeight'){
          console.warn(Number(this["personWeight"].value()));
          console.warn((Number(this["personFat"].value())+Number(this["personMuscle"].value())));
          if(Number(this["personWeight"].value())<(Number(this["personFat"].value())+Number(this["personMuscle"].value()))){
            errors['personFat'] = '몸무게를 넘을 수 없어요.';
            errors['personMuscle'] = '몸무게를 넘을 수 없어요.';
          }
        }
        //personHeight,personWeight,personFat,personMuscle
      });
      this.setState({ errors });
      
      if(Object.keys(errors).length === 0){
        var analysisPushYn = this.state.analysisPushGranted == true ? "Y" : "N";
        var data = this.props.USER_INFO;
        data.analysisPushYn = analysisPushYn;
        data.fasting8PushYn = this.state.fasting8PushGranted==true?"Y":"N";
        data.fasting16PushYn = this.state.fasting16PushGranted==true?"Y":"N";
        data.fasting24PushYn = this.state.fasting24PushGranted==true?"Y":"N";
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
        let foundIndex = this.state.dietGoal.findIndex(
          x => {
            //console.warn (x.value + ','+this.state.personDietGoal);
            return x.value == this.state.personDietGoal;
          }
        );
        console.log(this.state.dietGoal);
        console.log(this.state.dietGoal[foundIndex]);
        data.dietGoal = this.state.dietGoal[foundIndex].key;
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
              console.warn("Setting.js :"+ JSON.stringify(res));
              PROPS.setUserInfo(res);
              PROPS.forceRefreshMain(true);
              isSended = true;
              Alert.alert("저장 완료",'저장이 완료되었습니다.');
              PROPS.navigation.navigate("Main");
            },
            //입력된 회원정보가 없음.
            responseNotFound: function(res) {
              Alert.alert("저장 완료","유저 업데이트가 실패했습니다.");
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
      //if(!canUpdateSetting){
      if(false){
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
      const dietGoalView = (
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
                  data={this.state.dietGoal}
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
        </View>);
      return  (
      <Container 
        title={this.props.USER_INFO.userEmail+"님의 설정"}
        toolbarDisplay={true} 
        navigation={this.props.navigation}
        footUnDisplay={true}>
          <ScrollView
            //contentContainerStyle={{ flexGrow: 1 }}
            //scrollDisabled
            //style={{ width: width,height:height*0.5 }}
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
            {dietGoalView}
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

            <View
              style={styles.group4View}>
              <Text
                style={styles.detailsText}>알림 설정</Text>
            </View>
            
            <View
              style={styles.group2View}>
              <Text
                style={styles.labelSixText}>알림수신 여부</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <Switch
                  style={styles.slideSwitch}
                  value={this.state.analysisPushGranted}
                  onValueChange={this.analysisPushSwitchChange}
                  />
              </View>
            </View>
            <View
              style={styles.group4View}>
              <Text
                style={styles.detailsText}>간헐적 단식 알림 주기 설정</Text>
            </View>
              <View
              style={styles.group2View}>
                <Checkbox
                  style={{
                    container:{padding:0},
                    icon:{color:"rgba(0,0,0,1)"}, 
                    label:{color:"rgba(0,0,0,1)",fontSize:FONT_BACK_LABEL*0.8, marginLeft:-10}
                  }}
                  value="Y"
                  label = "8시간"
                  checked={this.state.fasting8PushGranted}
                  onCheck={() => this.setState({ fasting8PushGranted: !this.state.fasting8PushGranted })}
                />
                <Checkbox
                  style={{
                    container:{padding:0},
                    icon:{color:"rgba(0,0,0,1)"}, 
                    label:{color:"rgba(0,0,0,1)",fontSize:FONT_BACK_LABEL*0.8, marginLeft:-10}
                  }}
                  value="Y"
                  label = "16시간"
                  checked={this.state.fasting16PushGranted}
                  onCheck={() => this.setState({ fasting16PushGranted: !this.state.fasting16PushGranted })}
                />
                <Checkbox
                  style={{
                    container:{padding:0},
                    icon:{color:"rgba(0,0,0,1)"}, 
                    label:{color:"rgba(0,0,0,1)",fontSize:FONT_BACK_LABEL*0.8, marginLeft:-10}
                  }}
                  value="Y"
                  label = "24시간"
                  checked={this.state.fasting24PushGranted}
                  onCheck={() => this.setState({ fasting24PushGranted: !this.state.fasting24PushGranted })}
                />
              </View>
            <View
              style={[styles.group2View,{width:"100%", justifyContent:"center", alignItems:"center"}]}>
              <Button
                style={{
                  container:{
                      height:height*0.08,
                      width: width*0.9,
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
                text="저장"
                onPress={this.saveBtnPressed}
              />
            </View>
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
      height: height,
      alignItems: "stretch", marginBottom: 10
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
      opacity: 0.6,
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
      opacity: 0.6,
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
    textFieldLabelHeight: 10,
    slideSwitch: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      marginRight: 20,
    },
  })
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Setting));