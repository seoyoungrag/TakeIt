import {
  View,
  Image,
  TouchableHighlight,
  Platform,
  Dimensions
} from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  Toolbar,COLOR
} from 'react-native-material-ui';

import Images from '@assets/Images';
import Footer from "@footer";

const {width, height} = Dimensions.get("window");
const propTypes = {
  children: PropTypes.node.isRequired,
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      rightVisible:
      this.props.rightVisible != undefined
      ? this.props.rightVisible
      : false,
    };
  }
  render() {
    const toolbarDisplay = this.props.toolbarDisplay;
    const navigation = this.props.navigation;
    const calendarBtn = (
      <TouchableHighlight onPress={this.props.openCalendar}>
        <Image style={{ width: 22, height: 20,marginRight:7 }} source={Images.CalendarBtn} />
      </TouchableHighlight>
    );

    const rightVisible = 
      this.props.rightVisible? 
      {
        rightElement:calendarBtn
        //,onRightElementPress:{this.props.openCalendar}
      } : {};
    const titleNm = this.props.title;

    return (
      <View style={{flex:1,borderColor:COLOR.grey900, borderTopWidth: Platform.OS == 'ios'? 0.5: 0,marginTop: Platform.OS == 'ios'? height>=812 || width>=812? 40:25: 0}}>
        <View style={{flex:90,backgroundColor:"#fff"}}>
          {toolbarDisplay ? (
            <Toolbar
              leftElement="arrow-back"
              onLeftElementPress={() => navigation.goBack()}
              {...rightVisible}
              centerElement={titleNm}
              style={{container: Platform.OS == 'ios'? {
                borderColor:COLOR.grey900,
                borderWidth:0.5
              }: {}}}
            />
            ):null}
          {this.props.children}
        </View>
        {this.props.footUnDisplay ? null : <Footer adMobRewarded={this.props.adMobRewarded} navigation={this.props.navigation}/>}
      </View>
    );
  }
}

Container.propTypes = propTypes;

export default Container;
