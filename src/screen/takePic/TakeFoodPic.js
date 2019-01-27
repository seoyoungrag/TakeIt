import React, { Component } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from "react-native";

import Moment from "moment";

import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

import firebase from "react-native-firebase";

import Container from '@container/Container';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";
import { PermissionsAndroid } from 'react-native';

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
      images: null
    };
    this.checkResult = this.checkResult.bind(this);
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
  
  checkResult() {
    fetch(`${API}/films/`)
      .then(res2 => res2.json())
      .then(json => {
        console.log(json);
      });
  }
  pickSingleWithCamera(cropping) {
    const PROPS = this.props;
    var dateTime = new Date();
    ImagePicker.openCamera({
      cropping: cropping,
      width: 826, //cropping 했을때만 의미 있음.
      height: 1169, //cropping 했을때만 의미 있음.
      includeExif: true,
      showCropGuidelines: false,
      compressImageQuality: 0.2,
      cropperToolbarTitle:
        "사각형안에 결과지가 모두 포함되도록 이미지를 확대/축소해주세요."
    })
      .then(image => {
        console.log(image)
        firebase
          .storage()
          .ref(
            "/food_diary/" +
              PROPS.USER_INFO.userId +
              "/" +
              Moment(dateTime).format("YYYY-MM-DD") +
              "/" +
              image.path.substr(image.path.lastIndexOf("/") + 1)
          )
          .putFile(image.path)
          .then(uploadedFile => {
            console.log(uploadedFile);
            if (uploadedFile.state == "success") {
              var data = {};
              data.userId = PROPS.USER_INFO.userId;
              data.registD = Moment(dateTime).format("YYYY-MM-DD");
              data.registTime = Moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
              data.firebaseStoragePath = uploadedFile.ref;
              data.firebaseDownloadUrl = uploadedFile.downloadURL;
              data.deviceLocalFilePath = image.path;
              data.xCoordinate = this.state.latitude
              data.yCoordinate = this.state.longitude;
              var body = JSON.stringify(data);
              cFetch(APIS.POST_USER_FOOD, [], body, {
                responseProc: function(res) {
                  console.log(JSON.stringify(res));
                },
                responseNotFound: function(res) {
                  console.log(JSON.stringify(res));
                },
                responseError: function(e) {
                  console.log(JSON.stringify(res));
                }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.setState({
          image: { uri: image.path, width: image.width, height: image.height },
          images: null
        });
      })
      .catch(e => alert(e));
  }

  renderImage(image) {
    return (
      <Image
        style={{ width: 300, height: 300, resizeMode: "contain" }}
        source={image}
      />
    );
  }

  renderAsset(image) {
    return this.renderImage(image);
  }
  render() {
    const content = (
      <Container
        title="음식사진찍기"
        toolbarDisplay={true}
        navigation={this.props.navigation}>
        <View
          style={{
            flex: 1,
            flexDirection: "column"
          }}
        >
          <View style={{ flex: 1, alignContent:"center" }}>
            <View style={{flex:2}}>
              <ScrollView>
                {this.state.image ? this.renderAsset(this.state.image) : null}
                {this.state.images
                  ? this.state.images.map(i => (
                      <View key={i.uri}>{this.renderAsset(i)}</View>
                    ))
                  : null}
              </ScrollView>
            </View>
            <View style={{flex:1}}>
              <TouchableOpacity
                onPress={() => this.checkResult()}
                style={styles.button}
              >
                <Text style={styles.text}>변환결과확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.pickSingleWithCamera(false)}
                style={styles.button}
              >
                <Text style={styles.text}>음식 찍기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
    return content;
  }
}

let styles = {
  button: {
    backgroundColor: "blue",
    marginBottom: 10
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeFoodPic);
