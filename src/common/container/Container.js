import {Animated,  View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    ActionButton,
    Avatar,
    ListItem,
    Toolbar,
    BottomNavigation,
    Icon,
    Button, COLOR
  } from 'react-native-material-ui';

const propTypes = {
    children: PropTypes.node.isRequired,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        const navigation = this.props.navigation
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
                <BottomNavigation
                    active={this.state.active}
                    hidden={false}
                    style={{ container: { position: 'absolute', bottom: 0, left: 0, right: 0 } }}
                >
                    <BottomNavigation.Action
                        key="HOME"
                        icon={<Icon name="home" />}
                        label="HOME"
                        onPress={() => this.setState({ active: 'HOME' })}
                    />
                    <BottomNavigation.Action
                        key="PHOTO"
                        icon="photo"
                        label="PHOTO"
                        onPress={() => this.setState({ active: 'PHOTO' })}
                    />
                    <BottomNavigation.Action
                        key="INBODY"
                        icon="photo"
                        label="INBODY"
                        onPress={() => this.setState({ active: 'INBODY' })}
                    />
                    <BottomNavigation.Action
                        key="DIARY"
                        icon="book"
                        label="DIARY"
                        onPress={() => this.setState({ active: 'DIARY' })}
                    />
                    <BottomNavigation.Action
                        key="GRAPH"
                        icon="book"
                        label="GRAPH"
                        onPress={() => this.setState({ active: 'GRAPH' })}
                    />
                </BottomNavigation>
            </View>
        );
    }
}

Container.propTypes = propTypes;

export default Container;