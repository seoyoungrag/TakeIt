import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  PixelRatio,
  Alert
} from "react-native";
import Images from "@assets/Images";
import { TextField } from "react-native-material-textfield";
import {
  Toolbar,
  Button,
  Checkbox
} from "react-native-material-ui";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import { GoogleSignin,statusCodes } from "react-native-google-signin";
import { Dropdown } from 'react-native-material-dropdown';

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    CODE: state.REDUCER_CODE.code
  };
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    setCode: data => {
      dispatch(ActionCreator.setCode(data));
    },
    setIsFromLogin: data => {
      dispatch(ActionCreator.setIsFromLogin(data));
    }
  };
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const { width, height } = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
class UserRegist extends Component {
  constructor(props) {
    super(props);
    this.dietGoal = 
      this.props.CODE.list.filter(
        function(item){
          if(Number(item.codeCategory)==90000){
            return true;
          }
        }).map(function(v){
            return ({key: v.code, value:v.codeValue});
          });
    USER_INFO = this.props.USER_INFO;

    this.handleBackButton = this.handleBackButton.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.saveBtnPressed = this.saveBtnPressed.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUserNm = this.onSubmitUserNm.bind(this);
    this.onSubmitPersonHeight = this.onSubmitPersonHeight.bind(this);
    this.onSubmitPersonWeight = this.onSubmitPersonWeight.bind(this);
    this.onSubmitUserEmail = this.onSubmitUserEmail.bind(this);
    this.onSubmitUserAgeRange = this.onSubmitUserAgeRange.bind(this);
    this.onSubmitPersonDietGoal = this.onSubmitPersonDietGoal.bind(this);

    this.userNmRef = this.updateRef.bind(this, "userNm");
    this.personSexRef = this.updateRef.bind(this, "personSex");
    this.personHeightRef = this.updateRef.bind(this, "personHeight");
    this.personWeightRef = this.updateRef.bind(this, "personWeight");
    this.userEmailRef = this.updateRef.bind(this, "userEmail");
    this.userAgeRangeRef = this.updateRef.bind(this, "userAgeRange");
    this.personDietGoalRef = this.updateRef.bind(this, "personDietGoal");

    this.state = {
      //사용자정보
      userNm:
        this.props.USER_INFO.userNm != undefined
          ? this.props.USER_INFO.userNm
          : "",
        userEmail:
        this.props.USER_INFO.userEmail != undefined
          ? this.props.USER_INFO.userEmail
          : "",
        personSex:
        this.props.USER_INFO.userSex != undefined
          ? this.props.USER_INFO.userSex
          : "F",
        personHeight:
        this.props.USER_INFO.userHeight != undefined
          ? String(this.props.USER_INFO.userHeight)
          : "",
        personWeight:
        this.props.USER_INFO.userWeight != undefined
          ? String(this.props.USER_INFO.userWeight)
          : "",
        userAgeRange:
        this.props.USER_INFO.userAgeRange != undefined
          ? this.state.ageRange[this.state.ageRange.findIndex(x => {return x.value == String(this.props.USER_INFO.userAgeRange);})].value
          : "20대",
        ageRange:[ 
          {
            key: '0',
            value: '10대 미만'
          }, {
            key: '10',
            value: '10대'
          }, {
            key: '20',
            value: '20대'
          }, {
            key: '30',
            value: '30대'
          }, {
            key: '40',
            value: '40대'
          }, {
            key: '50',
            value: '50대'
          }, {
            key: '60',
            value: '60대'
          }, {
            key: '70',
            value: '70대'
          }, {
            key: '80',
            value: '80대'
          }, {
            key: '90',
            value: '90대'
          }, {
            key: '100',
            value: '100대'
          }],
          personDietGoal: this.props.USER_INFO.dietGoal != undefined
              ? this.dietGoal[this.dietGoal.findIndex(x => {return x.key == this.props.USER_INFO.dietGoal})].value: "현재 체중 유지하기"
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
    ["userNm", "personSex","userAgeRange","personHeight","personWeight","userEmail","personDietGoal"]
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        //let value = this[name].value();//현재 선택되기 전의 값을 가지고 옴
        //text가 현재 선택한 값
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitUserNm() {this.personHeight.focus();}
  onSubmitPersonSex() {this.userAgeRange.focus();}
  onSubmitUserAgeRange() {this.personHeight.focus();}
  onSubmitPersonHeight() {this.personWeight.focus();}
  onSubmitPersonWeight() {}
  onSubmitPersonDietGoal() {this.userEmail.focus();}
  onSubmitUserEmail() {this.userEmail.blur();}
  
  saveBtnPressed() {
    let errors = {};
    ["userNm", "personSex","userAgeRange","personHeight","personWeight","userEmail","personDietGoal"]
    .forEach((name) => {
      let value = this[name].value();

      if (!value) {
        errors[name] = '필수 입력입니다.';
      } else {
        if ('password' === name && value.length < 6) {
          errors[name] = 'Too short';
        }
        if('userEmail' === name && !validateEmail(value)){
            errors[name] = '올바른 이메일 형식이 아닙니다. ex) contact@dwebss.co.kr';
        }
        if ('personHeight' == name || 'personWeight' == name) {
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
      }
    });

    this.setState({ errors });
    if(Object.keys(errors).length === 0){
      console.log("UserRegist: save btn pressed in userRegist.js start");
      var data = this.props.USER_INFO;
      console.log("UserRegist: before Data in userRgeist.js start--");
      console.log(JSON.stringify(data));
      console.log("UserRegist: before Data in userRgeist.js end --");
      data.userNm = this.state.userNm;
      data.userSex = this.state.personSex;
      data.userHeight = this.state.personHeight;
      data.userWeight = this.state.personWeight;
      data.userEmail = this.state.userEmail;
      data.agreePrivacy = this.state.agreePrivacy==true?"Y":"N";
      data.agreeLocation = this.state.agreeLocation==true?"Y":"N";

      let foundIndex = this.state.ageRange.findIndex(
        x => {
          return x.value == this.state.userAgeRange;
        }
      );

      data.userAgeRange = this.state.ageRange[foundIndex].key
      let foundIndexDiet = this.dietGoal.findIndex(
        x => {
          //console.warn (x.value + ','+this.state.personDietGoal);
          return x.value == this.state.personDietGoal;
        }
      );
      data.dietGoal = this.dietGoal[foundIndexDiet].key;

      var body = JSON.stringify(data);
      //console.warn(body);
      const PROPS = this.props;
      if (!data.userNm || !data.userSex || !data.userHeight || !data.userWeight || !data.userEmail) {
        //alert("미입력된 정보가 있습니다. 확인해주세요.");
      } else if(!data.agreePrivacy||data.agreePrivacy!="Y"||!data.agreeLocation||data.agreeLocation!="Y"){
        Alert.alert("미입력된 항목이 있습니다.","개인정보 및 위치정보 수집에 동의해주셔야해요.");
      } else {
        cFetch(APIS.PUT_USER_BY_EMAIL, [this.props.USER_INFO.userEmail+"/"], body, {
          responseProc: function(res) {
            console.log("UserRegist.js :"+ JSON.stringify(res));
            PROPS.setUserInfo(res);
            PROPS.setIsFromLogin(true);
            PROPS.navigation.navigate("Loading");
          },
          //입력된 회원정보가 없음.
          responseNotFound: function(res) {
            alert("신규 유저 생성 및 유저 업데이트가 실패했습니다.");
            //PROPS.navigation.navigate("Login");
            // APIS.PUT_SUER_BY_PHONE에서 사용자가 없으면 생성되어야 한다.
          }
        });
      }
      console.log("UserRegist: save btn pressed in userRegist.js end");
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillUnmount() {
    //BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  componentDidMount() {
    //BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    this.userNm && this.userNm.focus && this.userNm.focus();
  }

  render() {
    console.log("UserRegist: userRegist");
    console.log("UserRegist: "+JSON.stringify(this.props.USER_INFO));
    let { errors = {}, ...data } = this.state;
    
    const content = (
      <ImageBackground
        style={[styles.container]}
        source={Images.loginLoadingBack} //화면 배경 이미지
      >
      <View style={{position:"absolute",top:0,left:0,width:width,height:height,backgroundColor:'rgba(0,0,0,0.9)',zIndex:0}}/>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollDisabled
          style={{ width: "100%" }}
        >
          <View style={{ flex: 0 }} />

          <View
            style={{
              flex: 65,
              marginVertical: width * 0.0625,
              margin: width * 0.0625,
              alignItems: "center"
            }}
          >
          <Toolbar
              leftElement="arrow-back"
              onLeftElementPress={async ()=>{
                  try {
                    const isSignedIn = await GoogleSignin.isSignedIn();
                    if(isSignedIn){
                      await GoogleSignin.revokeAccess();
                      await GoogleSignin.signOut();
                    }
                  } catch (error) {
                    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                      console.log('SIGN_IN_REQUIRED');
                    } else {
                      console.log(error);
                    }
                  }
                this.props.navigation.navigate('Login')}}
              centerElement={""}
              style={{
                  container:{backgroundColor:"rgba(0,0,0,0)",zIndex:1,marginLeft:-(width * 0.0625) ,padding:0}}}
          />
            <View
              style={{
                width: "100%",
                alignSelf:"flex-start",
                alignItems: "center"
                /*backgroundColor: "rgba(255,255,255,.9)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,.8)"*/
              }}
            >
              <Text
                style={{
                  width: "100%",
                  color: "rgba(255,255,255,1)",
                  fontFamily: "NotoSans-Regular",
                  borderBottomWidth: 1,
                  borderColor: "rgba(255,255,255,1)",
                  fontSize: FONT_BACK_LABEL*1.5
                }}
              >
                이용자님 기본 정보를 입력해주세요.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  width: "95%"
                }}
              >
                <TextField
                  textColor="rgba(255,255,255,1)"
                  baseColor="rgba(255,255,255,1)"
                  tintColor="rgba(255,255,255,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.userNmRef}
                  value={data.userNm}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitUserNm}
                  returnKeyType="next"
                  label="이름"
                  error={errors.userNm}
                />
                <TouchableOpacity
                style={[styles.textFieldContainerStyle, { flex: 1 }]}
                  onPress={() => {
                    this.setState({
                      personSex: this.state.personSex == "M" ? "F" : "M"
                    });
                  }}
                >
                  <TextField
                    disabled={true}
                    textColor="rgba(255,255,255,1)"
                    baseColor="rgba(255,255,255,1)"
                    tintColor="rgba(255,255,255,.9)"
                    fontSize={styles.textFieldFontSize}
                    containerStyle={{width:"100%"}}
                    labelHeight={styles.textFieldLabelHeight}
                    ref={this.personSexRef}
                    value={data.personSex == "M" ? "남" : "여"}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitPersonSex}
                    returnKeyType="next"
                    label="성별"
                    error={errors.personSex}
                  />
                </TouchableOpacity>
                <Dropdown
                    textColor="rgba(255,255,255,1)"
                    baseColor="rgba(255,255,255,1)"
                    tintColor="rgba(255,255,255,.9)"
                    itemColor="rgba(255,255,255,.54)"
                    selectedItemColor="rgba(255,255,255,.87)"
                    disabledItemColor="rgba(255,255,255,.38)"
                    pickerStyle={{backgroundColor:"black", borderWidth:1, borderColor:"white"}}
                    fontSize={styles.textFieldFontSize}
                    containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                    labelHeight={styles.textFieldLabelHeight}
                    ref={this.userAgeRangeRef}
                    value={data.userAgeRange}
                    data={this.state.ageRange}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitUserAgeRange}
                    returnKeyType="next"
                    label='연령대'
                    error={errors.userAgeRange}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 5,
                  width: "95%"
                }}
              >
                <TextField
                  textColor="rgba(255,255,255,1)"
                  baseColor="rgba(255,255,255,1)"
                  tintColor="rgba(255,255,255,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personHeightRef}
                  value={data.personHeight}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonHeight}
                  returnKeyType="next"
                  label="키"
                  keyboardType='numeric'
                  title='cm단위로 입력해주세요.'
                  error={errors.personHeight}
                />
                <TextField
                  textColor="rgba(255,255,255,1)"
                  baseColor="rgba(255,255,255,1)"
                  tintColor="rgba(255,255,255,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.personWeightRef}
                  value={data.personWeight}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPersonWeight}
                  returnKeyType="next"
                  label="몸무게"
                  keyboardType='numeric'
                  title='kg단위로 입력해주세요.'
                  error={errors.personWeight}
                />
              </View>

              <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 5,
                    paddingBottom: 10,
                    width: "95%"
                  }}
                >
                  <Dropdown
                      textColor="rgba(255,255,255,1)"
                      baseColor="rgba(255,255,255,1)"
                      tintColor="rgba(255,255,255,.9)"
                      itemColor="rgba(255,255,255,.54)"
                      selectedItemColor="rgba(255,255,255,.87)"
                      disabledItemColor="rgba(255,255,255,.38)"
                      pickerStyle={{backgroundColor:"black", borderWidth:1, borderColor:"white"}}
                      fontSize={styles.textFieldFontSize}
                      containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
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
                      label="다이어트 목표"
                      title='설정화면에서 수정할 수 있어요.'
                      error={errors.personDietGoal}
                  />
                    {/**
                  <Text
                    style={styles.textText}>현재 체중 유지하기</Text>
                     */}
                </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 5,
                  paddingBottom: 10,
                  width: "95%"
                }}
              >
                <TextField
                  textColor="rgba(255,255,255,1)"
                  baseColor="rgba(255,255,255,1)"
                  tintColor="rgba(255,255,255,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  labels
                  ref={this.userEmailRef}
                  value={data.userEmail}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitUserEmail}
                  returnKeyType='done'
                  label="이메일"
                  title='ex)contact@dwebss.co.kr'
                  error={errors.userEmail}
                />
                </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <Checkbox
                      style={{
                        container:{padding:0},
                        icon:{color:"rgba(255,255,255,1)"}, 
                        label:{color:"rgba(255,255,255,1)",fontSize:FONT_BACK_LABEL*0.8, marginLeft:-10}
                      }}
                      value="Y"
                      label = "회원님의 섭식정보 분석을 위한 개인정보수집에 동의해주세요"
                      checked ={false}
                      checked={this.state.agreePrivacy}
                      onCheck={() => this.setState({ agreePrivacy: !this.state.agreePrivacy })}
                    />
                  </View>
                  <View style={{ flexDirection: 'row'}}>
                    <Checkbox
                      style={{
                        container:{padding:0},
                        icon:{color:"rgba(255,255,255,1)"}, 
                        label:{color:"rgba(255,255,255,1)",fontSize:FONT_BACK_LABEL*0.8, marginLeft:-10}
                      }}
                      value="Y"
                      label = "위치제공서비스를 위한 위치정보수집에 동의해주세요"
                      checked={this.state.agreeLocation}
                      onCheck={() => this.setState({ agreeLocation: !this.state.agreeLocation })}
                    />
                  </View>
              </View>
            <View
              style={{
                width: "100%",
                backgroundColor:"red"
              }}
            >
              <Button
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderColor: "#afa8a1",
                  borderWidth: 1,
                  borderRadius: 100,
                  container:{
                      height:height*0.08
                  }
                  
                }}
                icon="check"
                raised
                text=""
                onPress={this.saveBtnPressed}
              />
            </View>
          </View>

          <View style={{ flex: 0 }} />
        </ScrollView>
      </ImageBackground>
    );
    return content;
  }
}

let styles = {
  autocompleteContainer: {
    width: "95%",
    //height: "30%",
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)",
    paddingTop: 10,
    paddingBottom: 50
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  inputContainerStyle: {
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)"
    //backgroundColor: "blue"
  },
  container: {
    flex: 1
  },
  textFieldContainerStyle: {
    width: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
  },
  textFieldLabelStyle: {
    width: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0
  },
  textFieldFontSize: FONT_BACK_LABEL,
  textFieldLabelHeight: 20
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRegist);