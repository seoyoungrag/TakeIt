import React from 'react';
import {
  Alert,
  AsyncStorage, 
  PermissionsAndroid,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  PixelRatio
} from 'react-native';

import PopupDialog from 'react-native-popup-dialog';
import DrawerWrapped from '@drawer';
import { connect } from 'react-redux';

import Container from '@container/Container';

import cFetch from '@common/network/CustomFetch';
import APIS from '@common/network/APIS';

import Calendar from 'react-native-calendario';

import FastImage from 'react-native-fast-image'
import { FlatGrid } from 'react-native-super-grid';
import Moment from 'moment/min/moment-with-locales';
Moment.locale('ko');

import Spinner from 'react-native-loading-spinner-overlay';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR } from 'react-native-material-ui';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions'
import firebase from "react-native-firebase";

const { width, height } = Dimensions.get('window');


async function requestStoragePermission(){
  var isGranted = false;
  try {
    if(Platform.OS === 'ios' ){
      const check = await Permissions.check('Storage')
      //console.log("check is one of: 'authorized', 'denied', 'restricted', or 'undetermined'");
      //console.log(check);
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
      }
    }else{
      const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if(!check){
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title': '갤러리 권한 필요',
            'message': '음식 사진을 올리기 위해 갤러리 권한이 필요합니다.'
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
    selectedDate: state.selectedDate,
    count: state.count,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

class Diary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      startDate: new Date(Date.now() + -7* 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 0 * 24 * 3600 * 1000),
      selectedDate: this.props.endDateForDiary,
      calendarVisible: false,
      range: {'startDate' : new Date(Date.now() + -7* 24 * 3600 * 1000),  'endDate':
        new Date(Date.now() + 0 * 24 * 3600 * 1000)},
      resultData : [],
      spinnerDiaryVisible: true,
      dataVisible: false,
    };
    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.getFoodPhotoList = this.getFoodPhotoList.bind(this);
    this.setStateRange = this.setStateRange.bind(this);
  }
  openCalendar() {
    this.setState({ calendarVisible: true });
  }
  closeCalendar() {
    this.setState({ calendarVisible: false });
  }


  //애로우 함수는 바인드 없이 사용 가능  함수가 많으면 명시를 하는게 유지보수에 편함
  // getFoodPhotoList() => {
  getFoodPhotoList() {
    const COM = this;
    COM.setState({ calendarVisible: false });
    let startDate = COM.state.range.startDate;
    let endDate =  COM.state.range.endDate;

    if(endDate==null){
      endDate = startDate;
    }

    return cFetch(
      APIS.GET_USER_FOOD_PHOTO,
      [
        //전달 값
         this.props.USER_INFO.userId,
        // 16,
        Moment(startDate).format('YYYY-MM-DD'),
        Moment(endDate).format('YYYY-MM-DD'),
      ],
      {},
      {
        responseProc: function(res) {
          COM.setState(
            {
              resultData : res,
              startDate: startDate,
              endDate: endDate,
              dataVisible:true,
              spinnerDiaryVisible:false,
            },
            function() {
            }
          );
          // setTimeout(function(){ COM.setState({spinnerDiaryVisible:false}) }, 3000);
          //  return res;
        },
        responseNotFound: function(res) {
          console.log(res);
        },
        responseError: function(e) {
          console.log(e);
        },
      }
    );
  }

  setStateRange(range) {
    this.state.range = range;
  }
  componentDidMount() {
    // this.setState ({'resultData':result.data});
    this.getFoodPhotoList();
  }
  componentWillMount() {
    // this.getFoodPhotoList();
  }
  componentWillReceiveProps() {}
  componentWillUnmount() {}

  render() {
    // const self = this;

    let selectDateTouchableWidth = (width * 2) / 5;
    const USER_INFO = this.props.USER_INFO;
    let DAY_RANGE_INFO = '';
    if(this.state.endDate==this.state.startDate){
      DAY_RANGE_INFO = Moment(this.state.startDate).format('YY.MM.DD').toString();
    }else{
      console.log('rd endDate else');
      DAY_RANGE_INFO = Moment(this.state.startDate).format('YY.MM.DD').toString() + ' ~ ' + Moment(this.state.endDate).format('YY.MM.DD').toString();
    }
    console.log('render33 start');
    console.log(DAY_RANGE_INFO);
    const content = (
      <Container
        title={DAY_RANGE_INFO}
        rightVisible={true}
        toolbarDisplay={true}
        openCalendar={this.openCalendar}
        navigation={this.props.navigation}>
        <View>
          <PopupDialog
            ref={popupDialog => {
              this.popupDialog = popupDialog;
            }}
            // dialogTitle={<DialogTitle title="날짜선택" />}
            // height={(height * 2) / 5}
            height={height}
            visible={this.state.calendarVisible}
            containerStyle={{
              // justifyContent: 'flex-start',
              zIndex: 1010,
            }}
            // actions={[
            //   <DialogButton text="OK" onPress={this.getFoodPhotoList} />,
            //   <DialogButton text="Cancel" onPress={this.closeCalendar} />,
            // ]}
            dialogStyle={
              {
                // justifyContent: 'center',
                // alignItems: 'center',
              }
            }>
            <View style={[styles.popupButton]}>
              <Text
                style={{ fontSize: 20, marginLeft: 200, right: 0,color:'#E91E63' }}
                onPress={this.getFoodPhotoList}>
                선택
              </Text>
              <Text
                style={{ fontSize: 20, marginLeft: 10, left: 20 }}
                onPress={this.closeCalendar}>
                닫기
              </Text>
            </View>
            <View style={[styles.calandar]}>
              <Calendar
                ref={calendar => {
                  this.calendar = calendar;
                }}
                startingMonth="2019-02-11"
                startDate={(Moment(this.state.startDate).format('YYYY-MM-DD'))}
                endDate={(Moment(this.state.endDate).format('YYYY-MM-DD'))}
                style={{
                  width: '200%',
                }}
                onChange={range => this.setStateRange(range)}
                // minDate="2018-04-20"
                // startDate="2018-04-30"
                // endDate="2018-05-05"
                //추후 테마 설정이 필요한 값
                // theme={{
                //   weekColumnTextStyle: {
                //     color: 'red',
                //   },
                //   weekColumnStyle: {
                //     paddingVertical: 20,
                //   },
                //   weekColumnsContainerStyle: {
                //     backgroundColor: 'lightgrey',
                //   },
                //   monthTitleStyle: {
                //     color: 'blue',
                //   },
                //   nonTouchableDayContainerStyle: {
                //     backgroundColor: 'red',
                //   },
                //   nonTouchableDayTextStyle: {
                //     color: 'green',
                //   },
                //   dayTextStyle: {
                //     color: 'blue',
                //   },
                //   activeDayContainerStyle: {
                //     backgroundColor: 'lightgrey',
                //   },
                //   activeDayTextStyle: {
                //     color: 'red',
                //   },
                // }}
              />
            </View>
          </PopupDialog>
        </View>
        <View style={[styles.parent]}>
        <ScrollView showsVerticalScrollIndicator={true} >
              {(this.state.resultData.length  > 0)  ?  this.state.resultData.map(data => {
                return (
                  <View key={data.registTime} style={[styles.child]}>
                  <TouchableHighlight onPress={()=>{this.props.navigation.navigate("DayDiary",
                   {inqueryDate:Moment(data.registD).format('YYYY-MM-DD')})}}>
                  <View style={[styles.topInfo]}>
                  <Text style={styles.day}>
                    {Moment(data.registD).format('MM.DD') }
                  </Text>
                  <Text style={styles.dayko}>
                    ({Moment(data.registD).format('ddd') })
                  </Text>
                  <Text style={styles.kcal}>
                    {data.kilocalorie} kcal
                  </Text>
                  </View>
                  </TouchableHighlight>

              <View style={[styles.bottomPhoto]}>
                <FlatGrid
                horizontal
                spacing={3}
                items={data.photoArr}
                style={styles.gridView}
                renderItem={({ item, section, index }) => (
                  <View>
                  {item.firebaseDownloadUrl!=null &&
                    <TouchableHighlight onPress=
                    {()=> this.props.navigation.navigate("Food", {food:item} )}
                    >
                    <View>
                    <View style={{
                      position:"absolute",
                      height:"100%",width:"100%",
                      zIndex:1,
                      alignItems:"center",
                      justifyContent:"center",
                      flexDirection:"row"
                      }}>
                    <Text style={{
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
                        size={FONT_BACK_LABEL*1.2}
                        borderWidth={0}/>
                        &nbsp;
                    </Text>
                    <Text style={{
                      color:"white",
                      fontSize:FONT_BACK_LABEL*1.2,
                      textShadowRadius:10,
                      textShadowColor:'#000000',
                      textShadowOffset:{width:0, height:0},
                      textAlign:"center",
                      textAlignVertical:"center"}}>
                      {Moment(item.registTime).format('HH:mm')}
                    </Text>
                    </View>
                  <FastImage
                  style=
                  { (data.photoArr.length>3) ? styles.imageStyle1:
                     styles.imageStyle2}
                    source={{
                      uri: item.firebaseDownloadUrl,
                      priority: FastImage.priority.low,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  </View>
                  </TouchableHighlight>
                }
                </View>
                  )}
              />
            
              </View>
                <View style={styles.underBottomPhoto}>
                  <TouchableOpacity onPress={()=>{
                    requestStoragePermission().then(isGranted => {
                      if(!isGranted){
                        Alert.alert('갤러리 권한이 없으면 찍먹의 메뉴를 이용할 수 없어요.');
                      }else{
                        const options = {
                          title: '찍먹할 사진을 선택해주세요.',
                          maxWidth:1280/2,maxHeight:1280/2,
                          quality: 0.5,
                          noData: true
                        };
                        ImagePicker.launchImageLibrary(options, async(image) => {
                          console.log(image);
                          if(image.didCancel||!image.uri){
                            return;
                          }
                          const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
                          var cnt = await AsyncStorage.getItem(storKey);
                          var macCnt = this.props.TIMESTAMP.foodupcnt?this.props.TIMESTAMP.foodupcnt: 3;
                          cnt = Number(cnt);
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
                  <Text style={[{
                    paddingLeft: width * 0.0225,
                    textAlignVertical:"top",
                    fontSize: FONT_BACK_LABEL*0.8,
                    fontWeight: '600',
                    color: COLOR.grey800,
                    textAlign:"left"}]}>
                    <Entypo name="folder-images" color="#000000" size={FONT_BACK_LABEL*0.8}/>&nbsp;&nbsp;갤러리에서 올리기
                  </Text>
                  </TouchableOpacity>
                </View>
            </View>
                )
                }):
                (this.state.dataVisible ==  false)  ?
                <View></View>:
                  <View style={[styles.child]}>
                  <View style={[styles.emptyInfo]}>
                    <Text style={styles.day}>
                      음식 사진을 올려주세요~
                    </Text>
                    </View>
                </View>
              }
            </ScrollView>
        </View>
        <Spinner
          visible={this.state.spinnerDiaryVisible}
          textContent={'잠시만 기다려 주세요...'}
          textStyle={{color: '#FFF'}}
        />
      </Container>
    );
    return  (
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
    COM.setState({spinnerDiaryVisible:true});
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
                COM.getFoodPhotoList();
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
  parent: {
    width: '100%',
    height: '100%',
    //아래로 내려가게 하는 기능
    flexDirection: 'column',
    padding: '1%',
    // flexWrap: 'wrap',
    flex : 1,
  },
  child: {
    width: '99%',
    // height: '25%',
    // width: width*0.95,
    height: height*0.3,
    margin: 2,
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent: 'center',
    //  flexDirection: 'row',
    //섀도우 android
    elevation: 2,
  },
  calandar: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popupButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyInfo: {
    justifyContent: 'center',
    width: width,
    // backgroundColor: '#F5FCFF',
    height: height*0.3,
  },
  topInfo: {
    // flex: 1,
    //  justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: width*0.95,
    // backgroundColor: '#F5FCFF',
    height: height*0.3*0.2
  },
  bottomPhoto: {
    // justifyContent: 'flex-end',
    flex:1,
    width: width*0.95,
    // backgroundColor: '#7F7F7F',
    height: height*0.3*0.65
  },
  underBottomPhoto: {
    width: width*0.95,
    // backgroundColor: '#9F9F9F',
    height: height*0.3*0.15
  },
  itemContainer: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.5,
    height: height*0.3*0.5,
  },
  day: {
    paddingLeft: width * 0.0225,
    fontSize: 25,
    textAlign: 'auto',
  },
  dayko: {
    paddingLeft: width * 0.0125,
    fontSize: 18,
    textAlign: 'auto',
    // marginBottom: '20%',
  },
  kcal: {
    paddingRight: width * 0.0225,
    fontSize: 18,
    marginLeft: 'auto',
  },
  gridView: {
    flex:0,
    height:"100%",
    width: width*0.95,
  },
  imageStyle1: {
    width: width*0.95*0.305,
    height: width*0.95*0.305,
  },
  imageStyle2: {
    width: width*0.95*0.323,
    height: width*0.95*0.323,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Diary);
