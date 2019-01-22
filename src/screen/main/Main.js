import React, {Component} from 'react';

import {Dimensions,Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
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
class Main extends Component {
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
          <Container>
            <View style={styles.container}>
              <Text style={styles.welcome}>Welcome to React Native!</Text>
              <Text style={styles.instructions}>To get started, edit App.js</Text>
              <Text style={styles.instructions}>{instructions}</Text>
              <View style={styles.footerIconContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Diary")}
              >
                <View
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  alignSelf="flex-start"
                  felx={1}
                >
                  <Text style={{fontSize:100}}>MOVE TO DIARY</Text>
                </View>
              </TouchableOpacity>
              </View>
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
)(Main);
