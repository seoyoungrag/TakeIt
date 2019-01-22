import React from 'react';
import {Dimensions,Platform, StyleSheet, Text, View} from 'react-native';
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import Container from '@container/Container';

const { width, height } = Dimensions.get("window");

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });
  
  function mapStateToProps(state) {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {};
  }
class Diary extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){

    }
    componentWillReceiveProps(){

    }
    componentWillUnmount(){

    }
    render() {
        const self = this;
        
        const content = (
          <Container toolbarTitle="음식상세??" toolbarDisplay={true} navigation={this.props.navigation}>
            <View style={styles.container}>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>{instructions}</Text>
            </View>
          </Container>
          );
          return (
            <DrawerWrapped
                rightDisabled={true}
                navigation={this.props.navigation}
                content={content}
                parentWidth={width}
                />
          );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Diary);
