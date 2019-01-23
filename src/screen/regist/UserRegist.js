import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ImageBackground,
  Slider,
  Picker,
  BackHandler,
  StyleSheet,
  PixelRatio
} from "react-native";
import Images from "@assets/Images";
import { TextField } from "react-native-material-textfield";
import {
  COLOR,
  ThemeProvider,
  Checkbox,
  Toolbar,
  Button
} from "react-native-material-ui";

import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user
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
    setCodeCategory: data => {
      dispatch(ActionCreator.setCodeCategory(data));
    }
  };
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
const { width, height } = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
class UserRegist extends Component {
  constructor(props) {
    super(props);
    USER_INFO = this.props.USER_INFO;

    this.handleBackButton = this.handleBackButton.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.saveBtnPressed = this.saveBtnPressed.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUserNm = this.onSubmitUserNm.bind(this);
    this.onSubmitPersonHeight = this.onSubmitPersonHeight.bind(this);
    this.onSubmitPersonWeight = this.onSubmitPersonWeight.bind(this);
    this.onSubmitUserEmail = this.onSubmitUserEmail.bind(this);

    this.userNmRef = this.updateRef.bind(this, "userNm");
    this.personSexRef = this.updateRef.bind(this, "personSex");
    this.personHeightRef = this.updateRef.bind(this, "personHeight");
    this.personWeightRef = this.updateRef.bind(this, "personWeight");
    this.userEmailRef = this.updateRef.bind(this, "userEmail");

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
          : ""
    };
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
    ["userNm", "personSex","personHeight","personWeight","userEmail"]
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitUserNm() {this.personHeight.focus();}
  onSubmitPersonSex() {this.personHeight.focus();}
  onSubmitPersonHeight() {this.personWeight.focus();}
  onSubmitPersonWeight() {this.userEmail.focus();}
  onSubmitUserEmail() {this.userEmail.blur();}
  
  saveBtnPressed() {
    let errors = {};
    ["userNm", "personSex","personHeight","personWeight","userEmail"]
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
      }
    });

    this.setState({ errors });
    console.log("save btn pressed in userRegist.js start");
    var data = this.props.USER_INFO;
    console.log("before Data in userRgeist.js start--");
    console.log(JSON.stringify(data));
    console.log("before Data in userRgeist.js end --");
    data.userNm = this.state.userNm;
    data.userSex = this.state.personSex;
    data.userHeight = this.state.personHeight;
    data.userWeight = this.state.personWeight;
    data.userEmail = this.state.userEmail;

    var body = JSON.stringify(data);
    const PROPS = this.props;
    const COM = this;
    if (!data.userNm || !data.userSex || !data.userHeight || !data.userWeight || !data.userEmail) {
      //alert("미입력된 정보가 있습니다. 확인해주세요.");
    } else {
      cFetch(APIS.PUT_USER_BY_EMAIL, [this.props.USER_INFO.userEmail], body, {
        responseProc: function(res) {
          PROPS.setUserInfo(res);
          console.log(PROPS.navigation.state.params);
          if (
            PROPS.navigation.state.params &&
            PROPS.navigation.state.params.refreshFnc
          ) {
            console.log("refreshFnc in PushSetup.js");
            PROPS.navigation.state.params.refreshFnc();
          }
          PROPS.navigation.navigate("Loading");
        },
        //입력된 회원정보가 없음.
        responseNotFound: function(res) {
          alert("신규 유저 생성 및 유저 업데이트가 실패했습니다.");
          PROPS.navigation.navigate("Login");
          // APIS.PUT_SUER_BY_PHONE에서 사용자가 없으면 생성되어야 한다.
        }
      });
    }
    console.log("save btn pressed in userRegist.js end");
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
    const COM = this;
    this.userNm.focus();
  }

  render() {
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
              onLeftElementPress={()=>{this.props.navigation.navigate('Login')}}
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
                  blurOnSubmit={true}
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
    paddingTop: 0
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