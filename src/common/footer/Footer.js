import React from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Images from "@assets/Images";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import { withNavigationFocus } from 'react-navigation';
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

function mapStateToProps(state) {
  return {
    ACTIVE_BTN : state.REDUCER_CONSTANTS.activeFooterBtn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveFooterBtn: activeFooterBtn => {
      dispatch(ActionCreator.setActiveFooterBtn(activeFooterBtn));
    },
  };
}
class Footer extends React.Component {
  state = {
    activeButton: this.props.ACTIVE_BTN
  }
  componentDidUpdate(){
    this.btnChange();
  }
  btnChange = async () =>{
    if(this.props.isFocused&&this.state.activeButton!=this.props.ACTIVE_BTN){
      this.setState({activeButton:this.props.ACTIVE_BTN});
    }
  }
  render() {
    return (
      <View
        width={width}
        borderTopColor="#e7e7ea"
        borderTopWidth={0.5}
        backgroundColor="#ffffff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        elavation={10}
        flex={1}
      >
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          this.props.setActiveFooterBtn("HOME")
          this.props.navigation.navigate("Main")
        }}
        flex={1}
      >
        <View style={styles.footerIconContainer}>
            <Image style={styles.footerIcon} source={this.state.activeButton=='HOME' ? Images.Footer_img_btn_active_home: Images.Footer_img_btn_home} />
            <Image style={styles.footerText} source={this.state.activeButton=='HOME' ? Images.Footer_txt_btn_active_home: Images.Footer_txt_btn_home} />
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          this.props.setActiveFooterBtn("PHOTO")
          this.props.navigation.navigate("TakePhotoFood")
          }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='PHOTO' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_photo} />
          <Image style={styles.footerText} source={this.state.activeButton=='PHOTO' ? Images.Footer_txt_btn_active_photo:Images.Footer_txt_btn_photo} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          this.props.setActiveFooterBtn("INBODY")
          this.props.navigation.navigate("Main")
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='INBODY' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_inbody} />
          <Image style={styles.footerText} source={this.state.activeButton=='INBODY' ? Images.Footer_txt_btn_active_inbody:Images.Footer_txt_btn_inbody} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => {
          this.props.setActiveFooterBtn("DIARY")
          this.props.navigation.navigate("Diary")
        }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='DIARY' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_diary} />
          <Image style={styles.footerText} source={this.state.activeButton=='DIARY' ? Images.Footer_txt_btn_active_diary:Images.Footer_txt_btn_diary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        underlayColor="rgba(255,51,102,.1)"
        onPress={() => {
          this.props.setActiveFooterBtn("GRAPH")
          this.props.navigation.navigate("Main")
          }}
      >
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={this.state.activeButton=='GRAPH' ? Images.Footer_img_btn_active_home:Images.Footer_img_btn_graph} />
          <Image style={styles.footerText} source={this.state.activeButton=='GRAPH' ? Images.Footer_txt_btn_active_graph:Images.Footer_txt_btn_graph} />
        </View>
      </TouchableOpacity>
      
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Footer));
