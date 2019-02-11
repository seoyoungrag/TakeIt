import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  View
} from 'react-native';
 
import Images from "@assets/Images";

import Swiper from 'react-native-swiper';
import { COLOR } from 'react-native-material-ui';
const {width, height} = Dimensions.get("window");
 
var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  text: {
    color: '#fff',
    fontSize: FONT_BACK_LABEL,
    fontWeight: 'bold',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginBottom: height*1/10
  }
})


export default class Guide extends Component {
  render(){
    return (
      <Swiper paginationStyle={{color:"red"}} showsButtons={true} loop={false} activeDotColor="red"
      prevButton={<Text style={[styles.text,{fontSize:FONT_BACK_LABEL*3, color:"red"}]}>‹</Text>}
      nextButton={<Text style={[styles.text,{fontSize:FONT_BACK_LABEL*3,color:"red"}]}>›</Text>}>
        <ImageBackground
          source={Images.guide1}
          style={[styles.slide1,{height:height}]}
          resizeMode="stretch"
        />
        <ImageBackground
          source={Images.guide2}
          style={[styles.slide1,{height:height}]}
          resizeMode="stretch"
        />
        <ImageBackground
          source={Images.guide3}
          style={[styles.slide1,{height:height}]}
          resizeMode="stretch"
        />
        <ImageBackground
          source={Images.guide4}
          style={[styles.slide1,{height:height}]}
          resizeMode="stretch"
        />
        <ImageBackground
          source={Images.guide5}
          style={[styles.slide1,{height:height}]}
          resizeMode="stretch"
        >
        <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'flex-end', alignItems:"flex-end" }}>
          <TouchableOpacity onPress={() => this.props.onCompleteGuide()} style={[styles.capture]}>
            <Text style={[styles.text,{fontSize:FONT_BACK_LABEL*3,color:COLOR.pink500}]}> 찍먹 시작! </Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>
      </Swiper>
    );
  }
}