import {
  Animated,
  View,
  Image,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  Toolbar
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
    };
  }

  render() {
    const toolbarDisplay = this.props.toolbarDisplay;
    const navigation = this.props.navigation;
    const footer = <Footer navigation={this.props.navigation}/>;
    const calendarBtn = (
      <TouchableHighlight onPress={this.props.openCalendar}>
        <Image style={{ width: 25, height: 25 }} source={Images.CalendarBtn} />
      </TouchableHighlight>
    );

    return (
      <View style={{flex:1}}>
        <View style={{flex:86}}>
          {toolbarDisplay ? (
            <Toolbar
              leftElement="arrow-back"
              onLeftElementPress={() => navigation.goBack()}
              rightElement={calendarBtn}
              //onRightElementPress={this.props.openCalendar}
              centerElement={this.state.title}
            />
          ) : null}
          {this.props.children}
        </View>
          <View style ={{flex:13}}>
          {footer}
          </View>
      </View>
    );
  }
}

Container.propTypes = propTypes;

export default Container;
