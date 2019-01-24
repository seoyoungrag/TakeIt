import React from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Images from "@assets/Images";
const { height, width } = Dimensions.get("window");
let styles = {
  footerIcon: {
    height: height * 0.038,
    resizeMode: "contain"
  },
  footerText: {
    height: height * 0.019,
    resizeMode: "contain",
    marginTop:height * 0.015
  },
  footerIconContainer: { width:width/5, alignItems: "center",marginTop:height * 0.03, marginBottom: height * 0.03
}
};

export default class Footer extends React.Component {
  state = {
    activeButton: 'PHOTO'
  }
  render() {
    return (
      <View
        position="absolute"
        bottom={0}
        width={width}
        borderTopColor="#e7e7ea"
        borderTopWidth={0.5}
        backgroundColor="#ffffff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        elevation={30}
      >
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {this.setState({activeButton:"HOME"})}}
        flex={1}
      >
        <View style={styles.footerIconContainer}>
            <Image style={styles.footerIcon} source={this.state.activeButton=='HOME' ? Images.Footer_img_active_btn_home: Images.Footer_img_btn_home} />
            <Image style={styles.footerText} source={this.state.activeButton=='HOME' ? Images.Footer_txt_btn_active_home: Images.Footer_txt_btn_home} />
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {this.setState({activeButton:"PHOTO"})}}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='PHOTO' ? Images.Footer_img_btn_active_photo:Images.Footer_img_btn_photo} />
          <Image style={styles.footerText} source={this.state.activeButton=='PHOTO' ? Images.Footer_txt_btn_active_photo:Images.Footer_txt_btn_photo} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {this.setState({activeButton:"INBODY"})}}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='INBODY' ? Images.Footer_img_btn_active_inbody:Images.Footer_img_btn_inbody} />
          <Image style={styles.footerText} source={this.state.activeButton=='INBODY' ? Images.Footer_txt_btn_active_inbody:Images.Footer_txt_btn_inbody} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {this.setState({activeButton:"DIARY"})}}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='DIARY' ? Images.Footer_img_btn_active_diary:Images.Footer_img_btn_diary} />
          <Image style={styles.footerText} source={this.state.activeButton=='DIARY' ? Images.Footer_txt_btn_active_diary:Images.Footer_txt_btn_diary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {this.setState({activeButton:"GRAPH"})}}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='GRAPH' ? Images.Footer_img_btn_active_graph:Images.Footer_img_btn_graph} />
          <Image style={styles.footerText} source={this.state.activeButton=='GRAPH' ? Images.Footer_txt_btn_active_graph:Images.Footer_txt_btn_graph} />
        </View>
      </TouchableOpacity>
      
      </View>
    );
  }
}
