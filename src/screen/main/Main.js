import React, {Component} from 'react';

import {Alert, Dimensions,Platform, StyleSheet, Text, View, TouchableOpacity, PixelRatio} from 'react-native';
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import Container from '@container/Container';
import FastImage from 'react-native-fast-image'
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
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
    }
    componentDidMount(){

    }
    componentWillReceiveProps(){

    }
    componentWillUnmount(){

    }
    render() {
        const items = [
          { id: 'TURQUOISE', url: 'https://patch.com/img/cdn20/users/790386/20180525/063909/styles/T800x600/public/processed_images/shutterstock_337714676-1527287683-3245.jpg?width=720' },
          { id: 'EMERALD', url: 'http://www.brcn.go.kr/prog/tour_restaurant/tour/sub04_03/restaurantImage_down.do?rstrntCode=157' },
          { id: 'PETER RIVER', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/09/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EA%B0%80%EC%9E%A5%EC%8A%AC%ED%94%88%EC%9D%8C%EC%8B%9D2.jpg' },
          { id: 'AMETHYST', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/09/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EA%B0%80%EC%9E%A5%EC%8A%AC%ED%94%88%EC%9D%8C%EC%8B%9D3.jpg' },
          { id: 'WET ASPHALT', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/09/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EA%B0%80%EC%9E%A5%EC%8A%AC%ED%94%88%EC%9D%8C%EC%8B%9D4.jpg' },
          { id: 'GREEN SEA', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/09/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EA%B0%80%EC%9E%A5%EC%8A%AC%ED%94%88%EC%9D%8C%EC%8B%9D8.jpg' },
          { id: 'NEPHRITIS', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/11/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EC%9D%8C%EC%8B%9D%EC%8A%A4%ED%86%A0%EB%A6%AC2.jpg' },
          { id: 'BELIZE HOLE', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/11/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EC%9D%8C%EC%8B%9D%EC%8A%A4%ED%86%A0%EB%A6%AC6.jpg' },
          { id: 'WISTERIA', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/11/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EC%9D%8C%EC%8B%9D%EC%8A%A4%ED%86%A0%EB%A6%AC4.jpg' },
          { id: 'MIDNIGHT BLUE', url: 'https://news.samsung.com/kr/wp-content/uploads/2015/11/%ED%88%AC%EB%AA%A8%EB%A1%9C%EC%9A%B0%EC%97%90%EC%84%B8%EC%9D%B4%EC%9D%8C%EC%8B%9D%EC%8A%A4%ED%86%A0%EB%A6%AC3.jpg' }
        ];
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
          <Container>
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
                          <Text style={[styles.itemCode,{color:"rgba(0,0,0,"+item.guage+")"}]}>{item.value}
                          </Text>
                        </View>
                      </View>
                      <ProgressBarAnimated
                        width={width/2-width*0.1}
                        height={height*0.005}
                        value={100*item.guage}
                        backgroundColor={"rgba(255,0,0,"+item.guage+")"}
                        borderColor={"rgba(255,0,0,1)"}
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
                      title: 'Today - 2019.01.21',
                      data: items.slice(0, 6),
                    }
                  ]}
                  style={styles.gridView}
                  renderItem={({ item, section, index }) => (
                    <FastImage
                      style={styles.itemContainer}
                      source={{
                        uri: item.url,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
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
      height: height*0.62
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
      justifyContent: 'flex-end',
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
      fontSize: FONT_BACK_LABEL,
      fontWeight: '600',
      alignItems: 'center',
      color: 'black',
      padding: 10,
      paddingBottom: 0
    }
  });
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
