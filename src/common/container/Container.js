import {
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  Toolbar
} from 'react-native-material-ui';

import Images from '@assets/Images';
import Footer from "@footer";
import firebase from 'react-native-firebase';

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
    const footer = this.props.footUnDisplay ? null: <Footer adMobRewarded={this.props.adMobRewarded} navigation={this.props.navigation}/>;
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
      <View style={{flex:1}}>
        <View style={{flex:90,backgroundColor:"#fff"}}>
          {toolbarDisplay ? (
            <Toolbar
              leftElement="arrow-back"
              onLeftElementPress={() => navigation.goBack()}
              {...rightVisible}
              centerElement={titleNm}
            />
            ):null}
          {this.props.children}
        </View>
          <View style ={{flex:9, backgroundColor:"#fff"}}>
          {footer}
          </View>
      </View>
    );
  }
}

Container.propTypes = propTypes;

export default Container;
