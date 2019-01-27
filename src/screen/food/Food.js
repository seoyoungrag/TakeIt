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
  }
  componentDidMount= async() => {
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const content = (
      <Container
        title="서울시 강남구 신사동"
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
            </View>
            <View style={{flex:1}}>
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
