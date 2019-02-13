import React, { Component } from "react";

import {
  Dimensions, View,
  Text,PixelRatio
} from "react-native";

import { connect } from "react-redux";

import Container from '@container/Container';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR } from 'react-native-material-ui';
import {BoxShadow} from 'react-native-shadow'

import Table from './Table'

import Moment from "moment";


var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

const {width, height} = Dimensions.get("window");
function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
class TakeFoodPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: this.props.navigation.getParam('food', {})
    }
  }
  componentDidMount= async() => {
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const columns = [
      {
        title: <MaterialCommunityIcons
        name="food"
        color="#000000"
        size={FONT_BACK_LABEL*1.8}
        borderWidth={0}/>,
        dataIndex: 'food.foodNm',
        isFirst: true,
        width:width*0.3,
        textLeft:true
      },
      {
        title: '칼로리',
        dataIndex: 'kilocalorie',
        lastTxt: 'kcal',
        width:width*0.135
      },
      {
        title: '단백질',
        dataIndex: 'protein',
        lastTxt: 'g',
        width:width*0.135
      },
      {
        title: '지방',
        dataIndex: 'fat',
        lastTxt: 'g',
        width:width*0.11
      },
      {
        title: '탄수화물',
        dataIndex: 'carbohydrate',
        lastTxt: 'g',
        width:width*0.135
      },
      {
        title: '당',
        dataIndex: 'sugar',
        lastTxt: 'g',
        width:width*0.082
      }
    ];

    console.log(this.state.food);
    const shadowOpt = {
      height: width-width*0.15,
      width: width-width*0.1,
      color:COLOR.grey900,
      border:2,
      opacity:0.2,
      x:1,
      y:1
    }
    const content = (
      <Container
        title={this.state.food.address}
        toolbarDisplay={true}
        navigation={this.props.navigation}>
        <View
          style={{
            flex: 1,
            flexDirection: "column"
          }}
        >
          <View style={{ flex: 1, alignContent:"center" }}>
              <View style={{flex:2, paddingTop: width*0.05, paddingLeft: width*0.05, paddingBottom:width*0.05}}>
            <BoxShadow setting={shadowOpt}>
              <View style={{height:width-width*0.15, width: width-width*0.1}}>
                <View style={{position:"absolute", height:"100%",width:"100%",zIndex:1,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                  <Text style={{
                    color:"white",
                    fontSize:FONT_BACK_LABEL*2.2,
                    textShadowRadius:10,
                    textShadowColor:'#000000',
                    textShadowOffset:{width:0, height:0},
                    textAlign:"center",
                    textAlignVertical:"center"
                    }}>&nbsp;
                    <Ionicons
                      name="ios-clock"
                      color={"#ffffff"}
                      size={FONT_BACK_LABEL*4}
                      borderWidth={0}/>
                      &nbsp;
                  </Text>
                  <Text style={{
                    color:"white",
                    fontSize:FONT_BACK_LABEL*2.2,
                    textShadowRadius:10,
                    textShadowColor:'#000000',
                    textShadowOffset:{width:0, height:0},
                    textAlign:"center",
                    textAlignVertical:"center"}}>
                    {this.state.food.registTime&&this.state.food.registTime.toString().length==13 ?
                      Moment(this.state.food.registTime).format('YYYY-MM-DD HH:mm:ss').substring(0,10)+"\n"+Moment(this.state.food.registTime).format('YYYY-MM-DD HH:mm:ss').substring(10,19)
                      :
                      this.state.food.registTime.substring(0,10)+"\n"+this.state.food.registTime.substring(10,19)}
                    </Text>
                  </View>
                    <FastImage
                                style={{height:"100%",width:"100%"}}
                                source={{
                                  uri: this.state.food.firebaseDownloadUrl,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                </View>
                </BoxShadow>
                </View>
                
            <View style={{flex:1,padding:width*0.05, justifyContent:"center", alignItems:"center"}}>
              <Table height={height/3-height*0.105} columns={columns}
              /* columnWidth={width*0.145} */
              dataSource={this.state.food.foodList} />
            </View>
          </View>
        </View>
      </Container>
    );
    return content;
  }
}

let styles = {
  button: {
    backgroundColor: "blue",
    marginBottom: 10
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeFoodPic);
