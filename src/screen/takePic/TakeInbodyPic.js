import React, { Component } from 'react';
import { Modal, Alert, PixelRatio, Dimensions, StyleSheet, Text, TouchableOpacity, View, AsyncStorage, Platform, NativeModules} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import Container from '@container/Container';
import firebase from "react-native-firebase";
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import Moment from "moment";
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';

import Entypo from 'react-native-vector-icons/Entypo'
import { withNavigationFocus } from 'react-navigation';
import { COLOR } from 'react-native-material-ui';

import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image'

const {width, height} = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

function mapStateToProps(state) {
  return {
    TIMESTAMP: state.REDUCER_CONSTANTS.timestamp,
    AdMobRewarded: state.REDUCER_CONSTANTS.adMobRewarded,
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
class TakeInbodyPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      spinnerVisible: false,
      modalVisible: false,
      pending: false,
      images: []
    };
    this.uploadPictureInactive = false;
  }
  componentDidMount = async() => {
    //console.warn(this.props.AdMobRewarded);
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
              return null
            }}
            enableSwipeDown={true} />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems:"center", position:'absolute', width:width, zIndex:10,bottom:0 }}>
              <TouchableOpacity 
                onPress={() => {
                  console.log(this.uploadPictureInactive);
                  if(!this.uploadPictureInactive) {
                    this.uploadPictureInactive = true;
                    this.savePicture();
                  } 
                }}
                style={[styles.analysis,
                    {elevation:5,shadowColor:COLOR.grey900,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2}]}>
                  <Text style={{ fontSize: FONT_BACK_LABEL,color:COLOR.pink500 }}> 
                    분석해드릴까요?
                  </Text>
              </TouchableOpacity>
            </View>
        </Modal>
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
    if(this.props.isFocused&&(this.props.navigation.state.routeName == "TakePhotoInbody")){
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
        title="인바디 사진 찍기!"
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
            <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              captureAudio={false}
              //autoFocus={true}
              autoFocusPointOfInterest = {{
                x: 0.5,
                y: 0.5
              }}
              permissionDialogTitle={'카메라 사용권한이 필요합니다.'}
              permissionDialogMessage={'음식 사진을 찍기 위해 카메라 사용 권한을 허가해 주세요.'}
            >
            {({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return  <PendingView/>
              return (
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                    <Text style={{ fontSize: FONT_BACK_LABEL }}> 인바디 측정지 찍기 </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            </RNCamera>
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
    var dateTimezoneOffset = dateTime.getTimezoneOffset();
    var deviceLocale = "";
    if(Platform.OS === 'android'){
      deviceLocale = NativeModules.I18nManager.localeIdentifier;
    }else{
      deviceLocale = NativeModules.SettingsManager.settings.AppleLocale;
    }
      let image = this.state.image;
      //console.log("TakeInbodyPic.js: "+JSON.stringify(image));
      firebase
        .storage()
        .ref("/inbody/" + PROPS.USER_INFO.userId + "/" + Moment(dateTime).format("YYYY-MM-DD") + "/" + image.uri.substr(image.uri.lastIndexOf("/") + 1) )
        .putFile(image.uri)
        .then(async(uploadedFile) => {
          console.log(uploadedFile);
          if (uploadedFile.state == "success") {
            var data = {};
            data.userId = PROPS.USER_INFO.userId;
            data.registD = Moment(dateTime).format("YYYY-MM-DD");
            data.registTime = Moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            data.registTimezoneOffset = dateTimezoneOffset;
            data.registDeviceLocale = deviceLocale;
            data.firebaseStoragePath = uploadedFile.ref;
            data.firebaseDownloadUrl = uploadedFile.downloadURL;
            data.deviceLocalFilePath = image.uri;
            var body = JSON.stringify(data);
            var isSended = false;
            await cFetch(APIS.POST_USER_INBODY, [], body, {
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
              //1. 인바디타임스탬프를 가져온다.
              const itStorKey = "@INBODYTIMESTAMP";
              var currentInbodyTimestamp = await AsyncStorage.getItem(itStorKey);
              currentInbodyTimestamp = Number(currentInbodyTimestamp);
              //2. 인바디타임스탬프값이 없는 경우
              if(!currentInbodyTimestamp){
                currentInbodyTimestamp = this.props.TIMESTAMP.timestamp;
                await AsyncStorage.setItem(itStorKey, currentInbodyTimestamp.toString());
              }
              //3. 인바디타임스탬프 기준 인바디 카운트를 가져와서 증가시킨다.
              const storKey = "@"+Moment(currentInbodyTimestamp).format('YYMMDD')+"INBODY";
              var inbodyUpCnt = await AsyncStorage.getItem(storKey);
              inbodyUpCnt = Number(inbodyUpCnt);
              if(inbodyUpCnt){
                await AsyncStorage.removeItem(storKey);
              }else{
                inbodyUpCnt = 0;
              }
              inbodyUpCnt += 1;
              await AsyncStorage.setItem(storKey, inbodyUpCnt.toString());
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
  savePicture =async()=>{
    //0. 경고창 다시보기 체크되어있는지 체크
    const periodInbodyUploadAlertStorKey = "@INBODYUPLOADALERTPERIOD";
    var INBODYUPLOADALERTPERIOD = await AsyncStorage.getItem(periodInbodyUploadAlertStorKey);
    var isShowInbodyUploadAlert = false;
    INBODYUPLOADALERTPERIOD = Number(INBODYUPLOADALERTPERIOD);
    //0-1. 저장된 적이 없거나, 저장되었는데 1주일이 넘었으면 flag는 true로
    if(!INBODYUPLOADALERTPERIOD || Math.abs(INBODYUPLOADALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60*60*24*7)){
    //if(!INBODYUPLOADALERTPERIOD || Math.abs(INBODYUPLOADALERTPERIOD-Number(this.props.TIMESTAMP.timestamp))>(1000*60)){
      isShowInbodyUploadAlert = true;
      await AsyncStorage.removeItem(periodInbodyUploadAlertStorKey);
    }
    if(isShowInbodyUploadAlert){
    Alert.alert(
      '사진을 저장합니다.',
      '사진을 업로드하면 수정/삭제할 수 없습니다.',
      [
        {text: '일주일간 보지않기', onPress: async() => 
          {
            await AsyncStorage.setItem(periodInbodyUploadAlertStorKey, this.props.TIMESTAMP.timestamp.toString());
            await this.uploadPictrue();
          }
        },
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: '저장', onPress: async() => {await this.uploadPictrue()}},
      ],
      {cancelable: false},
    );
    }else{
      await this.uploadPictrue();
    }
  }
  takePicture = async function(camera) {
    this.setState({spinnerVisible:true});
    const options = { quality: 0.9, width:1280,height:1280, exif: true, base64: false, fixOrientation: true};
    const image = await camera.takePictureAsync(options);
    this.setState(prevState => ({
      image: { uri: image.uri, width: image.width, height: image.height },
      images: [...prevState.images, image],
      spinnerVisible: false
      })
    );
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
    alignItems: 'center'
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
)(withNavigationFocus(TakeInbodyPic));
