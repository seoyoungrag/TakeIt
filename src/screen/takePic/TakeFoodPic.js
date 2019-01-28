import React, { Component } from "react";

import { Alert,ImageBackground, PixelRatio, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';

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
      spinnerVisible: false
    };
  }
  componentDidMount= async() => {
    await requestCameraPermission();
    console.log("TakeFoodPic.js: componentDidMount");
    this.watchId = await navigator.geolocation.watchPosition(
      (position) => {
        console.log("TakeFoodPic.js: "+JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
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
    return (
      <View
        style={{ flex: 0.48, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
      <Image
        style={{ flex: 1, height:"100%", resizeMode: "center" }}
        source={image}
      />
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
              flashMode={RNCamera.Constants.FlashMode.on}
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
  
  savePicture(){
    Alert.alert(
      '사진을 저장합니다.',
      '사진을 업로드하면 수정/삭제할 수 없습니다.',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: '저장', onPress: () => {
          const COM = this;
          const PROPS = this.props;
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
                    responseProc: function(res) {
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
    const options = { quality: 0.5, base64: true };
    const image = await camera.takePictureAsync(options);
    this.setState({
      image: { uri: image.uri, width: image.width, height: image.height }
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
