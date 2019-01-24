import {
  Animated,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  ActionButton,
  Avatar,
  ListItem,
  Toolbar,
  BottomNavigation,
  Icon,
  Button,
  COLOR,
} from 'react-native-material-ui';

import Images from '@assets/Images';
import Footer from "@footer";

const propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      searchText: '',
      active: 'home',
      moveAnimated: new Animated.Value(0),
      title: this.props.title,
    };
  }

  render() {
    const toolbarTitle = this.props.toolbarTitle;
    const toolbarDisplay = this.props.toolbarDisplay;
    const navigation = this.props.navigation;
    const calendarBtn = (
      <TouchableHighlight onPress={this.props.openCalendar}>
        <Image style={{ width: 25, height: 25 }} source={Images.CalendarBtn} />
      </TouchableHighlight>
    );

    return (
      <View style={styles.container}>
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
        {footer}
      </View>
    );
  }
}

Container.propTypes = propTypes;

export default Container;
