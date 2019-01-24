import {Animated,  View, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    Toolbar
  } from 'react-native-material-ui';
  import Footer from "@footer";

const propTypes = {
    children: PropTypes.node.isRequired,
};
let styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

class Container extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: [],
            searchText: '',
            active: 'home',
            moveAnimated: new Animated.Value(0),
        };
    }
    render() {
        const toolbarTitle = this.props.toolbarTitle;
        const toolbarDisplay = this.props.toolbarDisplay;
        const navigation = this.props.navigation;
        const footer = <Footer navigation={this.props.navigation}/>;
        return (
            <View style={styles.container}>
            {toolbarDisplay ? (
                <Toolbar
                    leftElement="arrow-back"
                    onLeftElementPress={() => navigation.goBack()}
                    centerElement={toolbarTitle}
                />
            ):null}
                {this.props.children}
                {footer}
            </View>
        );
    }
}

Container.propTypes = propTypes;

export default Container;