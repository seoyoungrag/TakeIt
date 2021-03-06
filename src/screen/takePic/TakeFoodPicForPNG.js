import React, { Component } from "react";

import { Alert, PixelRatio, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Modal} from 'react-native';

import Moment from "moment";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import firebase from "react-native-firebase";

import Container from '@container/Container';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import Camera from 'react-native-camera';

import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';

import Entypo from 'react-native-vector-icons/Entypo'
import {AsyncStorage} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { COLOR } from 'react-native-material-ui';

import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image'
import ImageResizer from 'react-native-image-resizer';


const {width, height} = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

function mapStateToProps(state) {
  return {
    TIMESTAMP: state.REDUCER_CONSTANTS.timestamp,
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forceRefreshMain: isForce => {
      dispatch(ActionCreator.forceRefreshMain(isForce));
    }
  };
}
class TakeFoodPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      image: null,
      spinnerVisible: false,
      modalVisible: false,
      pending: false,
      images: []
    };
  }
  componentDidMount() {
  }
  componentWillMount() {
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  renderImage(image) {
    var images = [{url:image.uri, width:image.width, height: image.height}];
    return (
      <View style={{flexDirection:"row",position:"absolute",width:width,height:0,top:0,left:0,backgroundColor:'rgba(0,0,0,0)',zIndex:1,padding:10}}>
        <Modal animationType="fade" hardwareAccelerated={true} visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
        
          <View style={{position:"absolute",width:width,top:0,left:0,backgroundColor:'rgba(0,0,0,0)',zIndex:1,padding:10}}>
            <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
              <Entypo name="image" color="#ffffff" size={FONT_BACK_LABEL*1.2}/>
              &nbsp; 클릭하면 창이 닫힙니다.
              </Text>
          </View>
          <ImageViewer imageUrls={images} 
              onSwipeDown={() => {
                this.setState({ modalVisible: false })
              }}
              onClick={() => {
                this.setState({ modalVisible: false })
              }}
              renderIndicator={() => {}}
              renderHeader={(curidx, allsize) => {
                return (null
                  /*
                  <View style={styles.container}>
                    <View style={styles.ViewForTitleStyle}>
                      <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
                      <Entypo name="image" color="#ffffff" size={FONT_BACK_LABEL*1.2}/>
                        클릭하면 창이 닫힙니다.
                      </Text>
                    </View>
                </View>*/
                )
              }}
              enableSwipeDown={true} />
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems:"center", position:'absolute', width:width, zIndex:10,bottom:0 }}>
                <TouchableOpacity 
                  onPress={() => this.savePicture()} 
                  style={[styles.analysis,
                      {elevation:5,shadowColor:COLOR.grey900,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2}]}>
                    <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}> 
                    먹자!
                    </Text>
                </TouchableOpacity>
              </View>
        </Modal>
        {/*}
        <TouchableOpacity style={{ alignItems: 'flex-start', flex: 1}} onPress={() => this.setState({ modalVisible: true })}>
          
            <Image
              style={{ flex: 1, height:"100%", width:"50%", resizeMode: "contain", borderColor:COLOR.grey700, borderWidth:1 }}
              source={image}
            />
        </TouchableOpacity>
        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={() => this.savePicture()} 
        style={[styles.analysis,
              {elevation:5,shadowColor:COLOR.grey900,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 2}]}>
            <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}> 
            찍먹
            </Text>
          </TouchableOpacity>
        </View>
        {*/}
      </View>
    );
  }

  renderAsset(image) {
    return this.renderImage(image);
  }
  renderEmpty() {
    return (
      <View style={{position:"absolute",width:width,top:0,left:0,backgroundColor:'rgba(0,0,0,0)',zIndex:1,padding:10}}>
        <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
        {this.state.pending ? "사진 권한이 필요합니다." : "사진을 촬영해 주세요."}
        </Text>
      </View>
    );
  }
  
  render() {
    var shouldRenderCamera = false;
    if(this.props.isFocused&&(this.props.navigation.state.routeName == "TakePhotoFood")){
      shouldRenderCamera = true;
    }
    const PendingView = () => (
      this.state.pending ?
      (<View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'black',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
          <Text style={{ fontSize: FONT_BACK_LABEL }}> 카메라 권한 승인이 필요합니다.{"\n"}아래 PHOTO 버튼을 클릭해주세요. </Text>
      </View>
      ):null
    );
    const content = (
      <Container
        title="찍고 먹기!"
        toolbarDisplay={false}
        navigation={this.props.navigation}>
        <View
          style={{
            flex: 1,
            flexDirection: "column"
          }}
        >
          <View style={styles.container}>
          {this.state.image ? this.renderAsset(this.state.image) : this.renderEmpty()}
          {shouldRenderCamera ? (
            <Camera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={styles.preview}
              captureTarget={Camera.constants.CaptureTarget.memory}
              captureQuality={Camera.constants.CaptureQuality.high}
              playSoundOnCapture={false}
              //type={RNCamera.Constants.Type.back}
              //flashMode={RNCamera.Constants.FlashMode.off}
              captureAudio={false}
              //autoFocus={true}
              //permissionDialogTitle={'카메라 사용권한이 필요합니다.'}
              //permissionDialogMessage={'음식 사진을 찍기 위해 카메라 사용 권한을 허가해 주세요.'}
            >
              {({ camera, status, recordAudioPermissionStatus }) => {
                if (status !== 'READY') return  <PendingView/>
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                      <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}> 찍고! </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePicture()} style={styles.capture}>
                      <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}> 찍고! </Text>
                    </TouchableOpacity>
                  </View>
            </Camera>
          ):null}
          </View>
          {this.state.image ? (
          <View style={{flex:1, width:width, backgroundColor:"black"}}>
            <FlatGrid
                    horizontal
                    spacing={0}
                    items={this.state.images}
                    style={{flex:0,height:"100%",width:width}}
                    renderItem={({ item, section, index }) => (
                      <TouchableOpacity style={{ height:"100%", width:100}} onPress={() => this.setState({ image:item, modalVisible: true })}>
                        <FastImage
                          style={{height:"100%",width:100}}
                          source={item}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </TouchableOpacity>
                    )}
                  />
          </View>
          ) : null}
        </View>
      <Spinner
        visible={this.state.spinnerVisible}
        textContent={'잠시만 기다려 주세요...'}
        textStyle={{color: '#FFF'}}
      />
      </Container>);
    return content;
  }
  uploadPictrue = async() =>{
    const COM = this;
    const PROPS = this.props;

    COM.setState({spinnerVisible:true});
    var dateTime = new Date();
      let image = this.state.image;
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
            await COM.setState({
              image:null,
              spinnerVisible:false,
              modalVisible: false
            })
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
                PROPS.forceRefreshMain(true);
                PROPS.navigation.navigate("Main"); 
              }, 100);
              
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
  
  }
  savePicture = async() =>{
    const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
    var cnt = await AsyncStorage.getItem(storKey);
    var macCnt = this.props.TIMESTAMP.foodupcnt||this.props.TIMESTAMP.foodupcnt==0?this.props.TIMESTAMP.foodupcnt: 3;
    cnt = Number(cnt);
    //0. 경고창 다시보기 체크되어있는지 체크
    const periodFoodUploadAlertStorKey = "@FOODUPLOADALERTPERIOD";
    var FOODUPLOADALERTPERIOD = await AsyncStorage.getItem(periodFoodUploadAlertStorKey);
    var isShowFoodUploadAlert = false;
    FOODUPLOADALERTPERIOD = Number(FOODUPLOADALERTPERIOD);
    //0-1. 저장된 적이 없거나, 저장되었는데 1주일이 넘었으면 flag는 true로
    if(!FOODUPLOADALERTPERIOD || Math.abs(FOODUPLOADALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7)){
    //if(!FOODUPLOADALERTPERIOD || Math.abs(FOODUPLOADALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60)){
      isShowFoodUploadAlert = true;
      await AsyncStorage.removeItem(periodFoodUploadAlertStorKey);
    }
    if(isShowFoodUploadAlert){
      Alert.alert(
        '현재 사진으로 등록하시겠어요?',
        '사진을 업로드하면 수정/삭제할 수 없습니다.\n일일 저장 횟수가 '+macCnt+'를 초과하면 찍먹티켓을 사용합니다. \n(금일: '+cnt+'회 저장)',
        [
          {text: '일주일간 보지않기', onPress: () => 
            {
              AsyncStorage.setItem(periodFoodUploadAlertStorKey, this.props.TIMESTAMP.timestamp.toString());
              this.uploadPictrue();
            }
          },
          {
            text: '취소',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: '저장', onPress: async() => {this.uploadPictrue()}},
        ],
        {cancelable: false},
      );
    }else{
      this.uploadPictrue();
    }
  }
  //takePicture = async function(camera) {
  takePicture = async function() {
    //console.warn("TakeFoodPic.js: takePicture");
    this.watchId = await navigator.geolocation.watchPosition(
      (position) => {
        this.setState({spinnerVisible:true});
        //console.warn("TakeFoodPic.js: "+JSON.stringify(position));
        //console.warn(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          spinnerVisible: false
        });
      },
      (error) => console.warn("TakeFoodPic.js: "+JSON.stringify(error))
    );
    console.log("TakeFoodPic.js: this.state-"+JSON.stringify(this.state));
    console.log("TakeFoodPic.js: watchId-"+this.watchId);
    this.setState({spinnerVisible:true});
    //const options = { quality: 1, width:1280/2,height:720/2, exif: true, base64: false, fixOrientation: true,
    const options = { 
      //width:1280/2,height:720/2, 
      metadata: true, audio: false
      //아래 둘다 false해야 프리뷰 나옴.
      //skipProcessing: true, 
      //doNotSave:true 
    };
    console.log('takepicture start');
    var image = null;
    if(this.camera){
      //image = await this.camera.takePictureAsync(options);

      let newWidth = 1280*3/4;
      let newHeight = 720*3/4;
      image = await this.camera.capture(options);
      //console.warn(image);
      image = await ImageResizer.createResizedImage('data:image/png;base64,'+image.data, newWidth, newWidth, "PNG", 90, 90);
      //console.warn(image);
      this.setState(prevState => ({
        image: { uri: image.uri, width: image.width, height: image.height },
        images: [...prevState.images, image],
        spinnerVisible: false
        })
      );
    }else{
      this.setState(prevState => ({
        spinnerVisible: false
        })
      );
    }
    console.log('takepicture end');
    
    
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  analysis: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(TakeFoodPic));
