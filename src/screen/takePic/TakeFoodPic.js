import React, { Component } from "react";

import { Alert,ImageBackground, PixelRatio, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Modal} from 'react-native';

import Moment from "moment";

import { connect } from "react-redux";

import firebase from "react-native-firebase";

import Container from '@container/Container';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import Images from "@assets/Images";

import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';

import Entypo from 'react-native-vector-icons/Entypo'
import {AsyncStorage} from 'react-native';
import { AdMobRewarded, AdMobInterstitial } from 'react-native-admob'


const {width, height} = Dimensions.get("window");

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);
async function requestCameraPermission() {
  try {
    const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if(!check){
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'GPS 권한 필요',
          'message': '사진의 위치 정보 제공을 위해 필요합니다. '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the ACCESS_FINE_LOCATION")
      } else {
        console.log("ACCESS_FINE_LOCATION permission denied")
      }
    }
  } catch (err) {
    console.warn(err)
  }
}

function mapStateToProps(state) {
  return {
    TIMESTAMP: state.REDUCER_CONSTANTS.timestamp,
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {};
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
      modalVisible: false
    };
  }
  componentDidMount= async() => {
    await requestCameraPermission();
    console.log("TakeFoodPic.js: componentDidMount");
    this.watchId = await navigator.geolocation.watchPosition(
      (position) => {
        this.setState({spinnerVisible:true});
        console.log("TakeFoodPic.js: "+JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          spinnerVisible: false
        });
      },
      (error) => console.log("TakeFoodPic.js: "+JSON.stringify(error))
    );
    console.log("TakeFoodPic.js: this.state-"+JSON.stringify(this.state));
    console.log("TakeFoodPic.js: watchId-"+this.watchId);
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  
  renderImage(image) {
    var images = [{url:image.uri, width:image.width, height: image.height}];
    return (
      <View
        style={{ flex: 0.48, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
      <Modal animationType="fade" hardwareAccelerated={true} visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
        <ImageViewer imageUrls={images} 
            onSwipeDown={() => {
              this.setState({ modalVisible: false })
            }}
            onClick={() => {
              this.setState({ modalVisible: false })
            }}
            renderIndicator={() => {}}
            renderHeader={(curidx, allsize) => {
              return (
                <View style={styles.container}>
                  <View style={styles.ViewForTitleStyle}>
                    <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
                    <Entypo name="image" color="#ffffff" size={FONT_BACK_LABEL*1.2}/>
                      클릭하면 창이 닫힙니다.
                    </Text>
                  </View>
              </View>
              )
            }}
            enableSwipeDown={true} />
      </Modal>
      <TouchableOpacity style={{ flex: 1}} onPress={() => this.setState({ modalVisible: true })}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height:'100%', backgroundColor:'rgba(0,0,0,0)'}}>
          <Image
            style={{ flex: 1, height:"100%", resizeMode: "center" }}
            source={image}
          />
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1}} onPress={() => this.savePicture()}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height:'100%', backgroundColor:'rgba(0,0,0,0.9)'}}>
          <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
          사진 저장
          </Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }

  renderAsset(image) {
    return this.renderImage(image);
  }
  renderEmpty() {
    return (
      <ImageBackground
        style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        source={Images.loginLoadingBack}
      >
      <View style={{position:"absolute",width:width,height:height,top:0,left:0,backgroundColor:'rgba(0,0,0,0.9)',zIndex:0}}/>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0}}}>
        사진을 촬영해 주세요.
        </Text>
      </View>
      </ImageBackground>
    );
  }

  render() {
    const content = (
      <Container
        title="찍고 먹기!"
        toolbarDisplay={true}
        navigation={this.props.navigation}>
        <View
          style={{
            flex: 1,
            flexDirection: "column"
          }}
        >
          <View style={{flex:1}}>
              {this.state.image ? this.renderAsset(this.state.image) : this.renderEmpty()}
          </View>
            
          <View style={styles.container}>
            <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              captureAudio={false}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
            >
              {({ camera, status, recordAudioPermissionStatus }) => {
                if (status !== 'READY') return <PendingView />;
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> 찍고 먹기! </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>
          </View>
        </View>
      <Spinner
        visible={this.state.spinnerVisible}
        textContent={'잠시만 기다려 주세요...'}
        textStyle={{color: '#FFF'}}
      />
      </Container>);
    return content;
  }
  
  savePicture = async() =>{
    const storKey = "@"+Moment(new Date()).format('YYMMDD')+"FOOD";
    var cnt = await AsyncStorage.getItem(storKey);
    var macCnt = this.props.TIMESTAMP.foodupcnt?this.props.TIMESTAMP.foodupcnt: 3;
    cnt = Number(cnt);
    Alert.alert(
      '사진을 저장합니다.',
      '사진을 업로드하면 수정/삭제할 수 없습니다.\n일일 저장 횟수가 '+macCnt+'를 초과하면 광고가 표시됩니다. \n(금일: '+cnt+'회 저장)',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: '저장', onPress: async() => {
            /*
            AdMobRewarded.addEventListener('rewarded',
            (reward) => console.log('AdMobRewarded => rewarded', reward)
            ); 
            AdMobRewarded.addEventListener('adLoaded',
              () => console.log('AdMobRewarded => adLoaded')
            );
            AdMobRewarded.addEventListener('adFailedToLoad',
              (error) => console.warn(error)
            );
            AdMobRewarded.addEventListener('adOpened',
              () => console.log('AdMobRewarded => adOpened')
            );
            AdMobRewarded.addEventListener('videoStarted',
              () => console.log('AdMobRewarded => videoStarted')
            );
            AdMobRewarded.addEventListener('adClosed',
              () => {
                console.log('AdMobRewarded => adClosed');
                AdMobRewarded.requestAd().catch(error => console.warn(error));
              }
            );
            AdMobRewarded.addEventListener('adLeftApplication',
              () => console.log('AdMobRewarded => adLeftApplication')
            );
            */
           /*
            AdMobInterstitial.addEventListener('adLoaded',
              () => console.log('AdMobInterstitial => adLoaded')
            );
            AdMobInterstitial.addEventListener('adFailedToLoad',
              (error) => console.warn(error)
            );
            AdMobInterstitial.addEventListener('adOpened',
              () => console.log('AdMobInterstitial => adOpened')
            );
            AdMobInterstitial.addEventListener('adClosed',
              () => {
                console.log('AdMobInterstitial => adClosed');
                AdMobInterstitial.requestAd().catch(error => console.warn(error));
              }
            );
            AdMobInterstitial.addEventListener('adLeftApplication',
              () => console.log('AdMobInterstitial => adLeftApplication')
            );
            */
          const COM = this;
          const PROPS = this.props;
          if(cnt>(macCnt)){
            /*
            AdMobRewarded.setAdUnitID('ca-app-pub-6534444030498662/2869848332');
            AdMobRewarded.requestAd()
            .then(
              async() => {
                AdMobRewarded.showAd()
                const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
                var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
                viewAdCnt = Number(viewAdCnt);
                if(viewAdCnt){
                  await AsyncStorage.removeItem(viewAdStorKey);
                }else{
                  viewAdCnt = 0;
                }
                foodUpCnt += 1;
                await AsyncStorage.setItem(viewAdStorKey, viewAdCnt.toString());
              }
              )
            .catch(error => console.warn(error));
            */
            /* 전면광고는 신청 후 몇일 걸린다고 하여, 일단 리워드 광고를 보여준다. 20190130 */
            AdMobInterstitial.setAdUnitID('ca-app-pub-6534444030498662/9104331615');
            AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
            AdMobInterstitial.requestAd().then( async() => {
              const viewAdStorKey = "@"+Moment(new Date()).format('YYMMDD')+"viewAD";
              var viewAdCnt = await AsyncStorage.getItem(viewAdStorKey);
              viewAdCnt = Number(viewAdCnt);
              if(viewAdCnt){
                await AsyncStorage.removeItem(viewAdStorKey);
              }else{
                viewAdCnt = 0;
              }
              foodUpCnt += 1;
              await AsyncStorage.setItem(viewAdStorKey, viewAdCnt.toString());
            })
            AdMobInterstitial.showAd();

          }
          
          COM.setState({spinnerVisible:true});
          var dateTime = new Date();
            let image = this.state.image;
            console.log("TakeInbodyPic.js: "+JSON.stringify(image));
            firebase
              .storage()
              .ref("/food_diary/" + PROPS.USER_INFO.userId + "/" + Moment(dateTime).format("YYYY-MM-DD") + "/" + image.uri.substr(image.uri.lastIndexOf("/") + 1) )
              .putFile(image.uri)
              .then(uploadedFile => {
                console.log(uploadedFile);
                if (uploadedFile.state == "success") {
                  var data = {};
                  data.userId = PROPS.USER_INFO.userId;
                  data.registD = Moment(dateTime).format("YYYY-MM-DD");
                  data.registTime = Moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                  data.firebaseStoragePath = uploadedFile.ref;
                  data.firebaseDownloadUrl = uploadedFile.downloadURL;
                  data.deviceLocalFilePath = image.uri;
                  var body = JSON.stringify(data);
                  cFetch(APIS.POST_USER_FOOD, [], body, {
                    responseProc: async(res) => {
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
                      Alert.alert('사진을 저장했습니다.');
                      COM.setState({
                        image:null,
                        spinnerVisible:false
                      })
                      console.log("TakeInbodyPic.js(responseProc): "+JSON.stringify(res));
                    },
                    responseNotFound: function(res) {
                      console.log("TakeInbodyPic.js(responseNotFound): "+JSON.stringify(res));
                    },
                    responseError: function(e) {
                      console.log("TakeInbodyPic.js(responseError): "+JSON.stringify(res));
                    }
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
        }},
      ],
      {cancelable: false},
    );
  }
  takePicture = async function(camera) {
    this.setState({spinnerVisible:true});
    const options = { quality: 0.5, exif: false, base64: false, fixOrientation: true  };
    const image = await camera.takePictureAsync(options);
    this.setState({
      image: { uri: image.uri, width: image.width, height: image.height },
      spinnerVisible: false
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
)(TakeFoodPic);
