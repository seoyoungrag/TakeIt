import React, {Component} from 'react';

import {Dimensions, StyleSheet, Text, View, PixelRatio} from 'react-native';
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import Container from '@container/Container';
import FastImage from 'react-native-fast-image'
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import Moment from "moment";

const {width, height} = Dimensions.get("window");

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    WISE_SAYING: state.REDUCER_EXERCISE.wiseSaying
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
          photos : []
        }
    }
    componentDidMount(){
      this.getFoodDiary();
    }
    componentWillReceiveProps(){

    }
    componentWillUnmount(){

    }


    getFoodDiary= () => {
      
      PROPS = this.props;

      COM = this;
      cFetch(
        APIS.GET_USER_FOOD,
        [
          PROPS.USER_INFO.userId,
          "date",
          Moment(new Date()).format("YYYY-MM-DD")
        ],
        {},
        {
          responseProc: function(res) {
            console.log(res);
            COM.setState({
              photos:
                res.length > 0
                  ? res
                  : [
                      {
                        firebaseDownloadUrl:
                          "https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-6deb2ab9-8334-42c4-b38f-d889db792e42847907521.jpg?alt=media&token=f85d5f15-0cfb-4abe-ae19-9fd0501422b4",
                        registTime: 1539516118000,
                        userFoodDetail: [
                          {
                            amountDish: 1,
                            food: {
                              carbohydrate: 2.9,
                              cholesterol: 24.51,
                              fat: 5.2,
                              foodId: 4907,
                              foodNm: "촬영한 사진이 없네요.",
                              foodType: "기타",
                              kilocalorie: 122,
                              protein: 15.78,
                              saturatedFattyAcid: 0.87,
                              servingSize: 100,
                              sodium: 42,
                              sugar: 0,
                              transFattyAcids: 0
                            }
                          }
                        ]
                      }
                    ]
            });
          },
          responseNotFound: function(res) {
            //console.log(JSON.stringify(res));
          },
          responseError: function(e) {
            //console.log(JSON.stringify(res));
          }
        }
      );
    }
    render() {
        const statues = [
          { name: '탄수화물', guage: '0.1', value: '92g' },
          { name: '지방', guage: '0.85', value: '24g' },
          { name: '단백질', guage: '0.6', value: '92g'},
          { name: '당', guage: '0.3', value: '52g'}
        ];

        const WiseSaying = this.props.WISE_SAYING[
          Math.floor(Math.random() * this.props.WISE_SAYING.length)
        ].text;
        const YourImage = this.props.USER_INFO.userSnsPhoto ?(
        <FastImage
          style={styles.avatarTempImage}
          source={{
            uri: this.props.USER_INFO.userSnsPhoto,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.center}
        />
        ):null;
        const content = (
          <Container navigation={this.props.navigation}>
            <View style={styles.container}>
              <View
                style={styles.headerView}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}>
                  <View width={height*0.15} height="100%" paddingLeft={10}>
                  {YourImage}
                  </View>
                  <View flex={width-height*0.15} height="100%">
                    <View flex={3} style={{padding:10, paddingBottom:0}}>
                      <Text style={styles.profileUserEmail}>{this.props.USER_INFO.userEmail}</Text>
                      <Text style={styles.profileWiseSaying}>{WiseSaying}</Text>
                    </View>
                    <View flex={2} flexDirection="row" style={{padding:10, paddingTop:20}}>
                      <View flex={2} style={{backgroundColor:'rgb(72,207,173)', paddingLeft:10, justifyContent:"center"}}><Text style={{color:"white"}}>today 1835 kcal</Text></View>
                      <View flex={1} style={{backgroundColor:'rgb(255,206,84)', paddingRight:10, justifyContent:"center", height:"70%",alignSelf:"flex-end",alignItems:"flex-end"}}><Text style={{color:"white"}}>+526</Text></View>
                    </View>
                  </View>
                </View>
              <View style={styles.statusView}>
                <FlatGrid
                  itemDimension={width/2.1}
                  fixed
                  spacing={0}
                  items={statues}
                  style={styles.gridView}
                  renderItem={({ item, section, index }) => (
                    <View style={[styles.statusContainer, { /* backgroundColor: 'rgba(255,0,0,'+item.guage+')'*/}]}>
                      <View flexDirection="row" width={width/2-width*0.1}>
                        <View style={{flex:1, alignItems:"flex-start"}}>
                          <Text style={[styles.itemName,{color:"black"}]}>{item.name}</Text>
                        </View>
                        <View style={{flex:1, alignItems:"flex-end"}}>
                          <Text style={[styles.itemCode,{color:"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}]}>{item.value}
                          </Text>
                        </View>
                      </View>
                      <ProgressBarAnimated
                        width={width/2-width*0.1}
                        height={height*0.005}
                        value={100*item.guage}
                        backgroundColor={"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}
                        borderColor={"rgba("+(item.guage > 0.7 ? "255,0,0": item.guage > 0.4 ? "255,206,84" :"72,207,173" )+",1)"}
                      />
                    </View>
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                  )}
                />
              </View>
              <View style={styles.foodList}>
                <SectionGrid
                  itemDimension={width/2.1}
                  fixed
                  spacing={5}
                  sections={[
                    {
                      title: Moment(new Date()).format("YYYY-MM-DD"),
                      data: this.state.photos,
                    }
                  ]}
                  style={styles.gridView}
                  renderItem={({ item, section, index }) => (
                    <View style={styles.itemContainer}>
                      <View style={{position:"absolute", height:"100%",width:"100%",zIndex:1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"white",fontSize:FONT_BACK_LABEL*1.2,textShadowRadius:20,textShadowColor:'#000000',textShadowOffset:{width:0, height:0},textAlign:"center",textAlignVertical:"center"}}>
                        <Ionicons
                          name="ios-clock"
                          color="#ffffff"
                          size={FONT_BACK_LABEL*1.2}
                          borderWidth={0}/>
                          &nbsp;
                        {item.registTime}
                        </Text>
                      </View>
                    <FastImage
                      style={[styles.itemContainer,{zIndex:0}]}
                      source={{
                        uri: item.firebaseDownloadUrl,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    </View>
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}><Octicons name="calendar" color="#000000" size={FONT_BACK_LABEL}/>&nbsp;&nbsp;{section.title}</Text>
                  )}
                />
              </View>
            </View>
            {/*
            <TouchableOpacity
              onPress={() => { Alert.alert(
                      "우웃",
                      "정말 로그아웃 하시겠습니까?",
                      [
                        { text: "아니오", onPress: () => {}, style: "cancel" },
                        {
                          text: "네",
                          onPress: () => {
                            firebase
                              .auth()
                              .signOut()
                              .then(() => this.props.closeDrawer())
                              .then(() => this.props.navigation.navigate("Login"))
                              .catch(error => {});
                          }
                        }
                      ],
                      { cancelable: false }
                    )
                  ;
              }}
            >
            <Text style={{fontSize:20, color:"red"}}>로그아웃 테스트</Text>
            </TouchableOpacity>
            */}
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
      position:'absolute',
      top:0,
      left:0
    },
    headerView: {
      height: height*0.15,
      paddingTop:10,
      paddingBottom:10
    },
     avatarTempImage: {
      height: height*0.14,
      width: height*0.14,
      borderRadius: height*0.2
    },
    statusView:{
      height: height*0.10,
      backgroundColor: "#FAFAFA"
    },
    foodList: {
      backgroundColor:"#F4F2F3",
      height: height*0.57
    },profileUserEmail: {
      fontSize: FONT_BACK_LABEL*1.2,
      color:"rgba(0,0,0,1)"
    }, profileWiseSaying: {
      fontSize: FONT_BACK_LABEL*0.8
    },
    gridView: {
      flex: 1,
    },
    itemContainer: {
      height: width/2,
    },
    statusContainer: {
      justifyContent: 'center',
      alignItems:'center',
      height: (height*0.10)*0.5
    },
    itemName: {
      fontSize: FONT_BACK_LABEL*0.9,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: FONT_BACK_LABEL*0.8,
      color: '#fff',
    },
    sectionHeader: {
      flex: 1,
      textAlignVertical:"bottom",
      fontSize: FONT_BACK_LABEL,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent:'flex-end',
      color: 'black',
      padding: 10,
      paddingBottom: 0
    }
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
