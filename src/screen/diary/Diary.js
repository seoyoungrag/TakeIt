import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ScrollView,
  Button,
} from 'react-native';

import PopupDialog, {  DialogButton,  DialogContent, } from 'react-native-popup-dialog';
import DrawerWrapped from '@drawer';
import { connect } from 'react-redux';

import Container from '@container/Container';

import cFetch from '@common/network/CustomFetch';
import APIS from '@common/network/APIS';

import Calendar from 'react-native-calendario';

import FastImage from 'react-native-fast-image'
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import Moment from 'moment/min/moment-with-locales';
import { black } from 'ansi-colors';
Moment.locale('ko');

import Spinner from 'react-native-loading-spinner-overlay';
import Images from '../../../assets/Images';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {BoxShadow} from 'react-native-shadow';
import { COLOR } from 'react-native-material-ui';

const { width, height } = Dimensions.get('window');


function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    selectedDate: state.selectedDate,
    count: state.count,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
var FONT_BACK_LABEL   = 16;

class Diary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      // startDate: new Date(Date.now() + -7* 24 * 3600 * 1000),
      startDate: new Date(Date.now() + -30* 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 0 * 24 * 3600 * 1000),
      selectedDate: this.props.endDateForDiary,
      calendarVisible: false,
      range: {'startDate' : new Date(Date.now() + -30* 24 * 3600 * 1000),  'endDate':
        new Date(Date.now() + 0 * 24 * 3600 * 1000)},
      resultData : [],
      spinnerDiaryVisible: true,
      dataVisible: false,
    };
    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.getFoodPhotoList = this.getFoodPhotoList.bind(this);
    this.setStateRange = this.setStateRange.bind(this);
  }
  openCalendar() {
    this.setState({ calendarVisible: true });
  }
  closeCalendar() {
    this.setState({ calendarVisible: false });
  }


  //애로우 함수는 바인드 없이 사용 가능  함수가 많으면 명시를 하는게 유지보수에 편함
  // getFoodPhotoList() => {
  getFoodPhotoList() {
    const COM = this;
    COM.setState({ calendarVisible: false });
    let startDate = COM.state.range.startDate;
    let endDate =  COM.state.range.endDate;

    if(endDate==null){
      endDate = startDate;
    }

    return cFetch(
      APIS.GET_USER_FOOD_PHOTO,
      [
        //전달 값
        //  this.props.USER_INFO.userId,
        16,
        Moment(startDate).format('YYYY-MM-DD'),
        Moment(endDate).format('YYYY-MM-DD'),
      ],
      {},
      {
        responseProc: function(res) {
          COM.setState(
            {
              resultData : res,
              startDate: startDate,
              endDate: endDate,
              dataVisible:true,
              spinnerDiaryVisible:false,
            },
            function() {
            }
          );
          // setTimeout(function(){ COM.setState({spinnerDiaryVisible:false}) }, 3000);
          //  return res;
        },
        responseNotFound: function(res) {
          console.log(res);
        },
        responseError: function(e) {
          console.log(e);
        },
      }
    );
  }

  setStateRange(range) {
    this.state.range = range;
  }
  componentDidMount() {
    // this.setState ({'resultData':result.data});
    this.getFoodPhotoList();
  }
  componentWillMount() {
    // this.getFoodPhotoList();
  }
  componentWillReceiveProps() {}
  componentWillUnmount() {}

  render() {
    // const self = this;

    let selectDateTouchableWidth = (width * 2) / 5;
    const USER_INFO = this.props.USER_INFO;
    let DAY_RANGE_INFO = '';

    if(this.state.range.endDate==null){
      DAY_RANGE_INFO = Moment(this.state.range.startDate).format('YY.MM.DD').toString();
    }else{
      console.log('rd endDate else');
      DAY_RANGE_INFO = Moment(this.state.range.startDate).format('YY.MM.DD').toString() + ' ~ ' + Moment(this.state.range.endDate).format('YY.MM.DD').toString();
    }
    console.log('render33 start');
    console.log(DAY_RANGE_INFO);
    const content = (
      <Container
        title={DAY_RANGE_INFO}
        rightVisible={true}
        toolbarDisplay={true}
        openCalendar={this.openCalendar}
        navigation={this.props.navigation}>
        <View>
          <PopupDialog
            ref={popupDialog => {
              this.popupDialog = popupDialog;
            }}
            // dialogTitle={<DialogTitle title="날짜선택" />}
            // height={(height * 2) / 5}
            height={height}
            visible={this.state.calendarVisible}
            containerStyle={{
              // justifyContent: 'flex-start',
              zIndex: 1010,
            }}
            // actions={[
            //   <DialogButton text="OK" onPress={this.getFoodPhotoList} />,
            //   <DialogButton text="Cancel" onPress={this.closeCalendar} />,
            // ]}
            dialogStyle={
              {
                // justifyContent: 'center',
                // alignItems: 'center',
              }
            }>
            <View style={[styles.popupButton]}>
              <Text
                style={{ fontSize: 20, marginLeft: 200, right: 0,color:'#E91E63' }}
                onPress={this.getFoodPhotoList}>
                선택
              </Text>
              <Text
                style={{ fontSize: 20, marginLeft: 10, left: 20 }}
                onPress={this.closeCalendar}>
                닫기
              </Text>
            </View>
            <View style={[styles.calandar]}>
              <Calendar
                ref={calendar => {
                  this.calendar = calendar;
                }}
                startingMonth="2019-01-01"
                style={{
                  width: '200%',
                }}
                onChange={range => this.setStateRange(range)}
                // minDate="2018-04-20"
                // startDate="2018-04-30"
                // endDate="2018-05-05"
                //추후 테마 설정이 필요한 값
                // theme={{
                //   weekColumnTextStyle: {
                //     color: 'red',
                //   },
                //   weekColumnStyle: {
                //     paddingVertical: 20,
                //   },
                //   weekColumnsContainerStyle: {
                //     backgroundColor: 'lightgrey',
                //   },
                //   monthTitleStyle: {
                //     color: 'blue',
                //   },
                //   nonTouchableDayContainerStyle: {
                //     backgroundColor: 'red',
                //   },
                //   nonTouchableDayTextStyle: {
                //     color: 'green',
                //   },
                //   dayTextStyle: {
                //     color: 'blue',
                //   },
                //   activeDayContainerStyle: {
                //     backgroundColor: 'lightgrey',
                //   },
                //   activeDayTextStyle: {
                //     color: 'red',
                //   },
                // }}
              />
            </View>
          </PopupDialog>
        </View>
        <View style={[styles.parent]}>
        <ScrollView showsVerticalScrollIndicator={false}>
              {(this.state.resultData.length  > 0)  ?  this.state.resultData.map(data => {
                return (
                  <View key={data.registTime} style={[styles.child]}>
                  <TouchableHighlight onPress={()=>{this.props.navigation.navigate("DayDiary",
                   {inqueryDate:Moment(data.registD).format('YYYY-MM-DD')})}}>
                  <View style={[styles.topInfo]}>
                  <Text style={styles.day}>
                    {Moment(data.registD).format('DD') }
                  </Text>
                  <Text style={styles.dayko}>
                    ({Moment(data.registD).format('ddd') })
                  </Text>
                  <Text style={styles.kcal}>
                    {data.kilocalorie} kcal
                  </Text>
                  </View>
                  </TouchableHighlight>

              <View style={[styles.bottomPhoto]}>
                <FlatGrid
                horizontal
                spacing={1}
                items={data.photoArr}
                style={styles.gridView}
                renderItem={({ item, section, index }) => (
                  <View>
                  {item.firebaseDownloadUrl!=null &&
                    <TouchableHighlight onPress=
                    {()=> this.props.navigation.navigate("Food", {food:item} )}
                    >
                    <View>
                    <View style={{
                      position:"absolute",
                      height:"100%",width:"100%",
                      zIndex:1,
                      alignItems:"center",
                      justifyContent:"center",
                      flexDirection:"row"
                      }}>
                    <Text style={{
                      color:"white",
                      fontSize:FONT_BACK_LABEL*1.2,
                      textShadowRadius:10,
                      textShadowColor:'#000000',
                      textShadowOffset:{width:0, height:0},
                      textAlign:"center",
                      textAlignVertical:"center"
                      }}>&nbsp;
                      <Ionicons
                        name="ios-clock"
                        color={"#ffffff"}
                        size={FONT_BACK_LABEL*1.2}
                        borderWidth={0}/>
                        &nbsp;
                    </Text>
                    <Text style={{
                      color:"white",
                      fontSize:FONT_BACK_LABEL*1.2,
                      textShadowRadius:10,
                      textShadowColor:'#000000',
                      textShadowOffset:{width:0, height:0},
                      textAlign:"center",
                      textAlignVertical:"center"}}>
                      {Moment(item.registTime).format('HH:mm')}
                    </Text>
                    </View>
                  <FastImage
                  style={styles.imageStyle}
                    source={{
                      uri: item.firebaseDownloadUrl,
                      priority: FastImage.priority.low,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  </View>
                  </TouchableHighlight>
                }
                </View>
                  )}
              />
              </View>
            </View>
                )
                }):
                (this.state.dataVisible ==  false)  ?
                <View></View>:
                  <View style={[styles.child]}>
                  <View style={[styles.emptyInfo]}>
                    <Text style={styles.day}>
                      음식 사진을 올려주세요~
                    </Text>
                    </View>
                </View>
              }
            </ScrollView>
        </View>
        <Spinner
          visible={this.state.spinnerDiaryVisible}
          textContent={'잠시만 기다려 주세요...'}
          textStyle={{color: '#FFF'}}
        />
      </Container>
    );
    return  (
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
  parent: {
    width: '100%',
    height: '100%',
    //아래로 내려가게 하는 기능
    flexDirection: 'column',
    padding: '1%',
    // flexWrap: 'wrap',
    flex : 1,
  },
  child: {
    width: '99%',
    // height: '25%',
    // width: width*0.95,
    height: height*0.3,
    margin: 2,
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent: 'center',
    //  flexDirection: 'row',
    //섀도우 android
    elevation: 2,
  },
  calandar: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popupButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyInfo: {
    justifyContent: 'center',
    width: width,
    // backgroundColor: '#F5FCFF',
    height: height*0.3,
  },
  topInfo: {
    // flex: 1,
    //  justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: width*0.95,
    // backgroundColor: '#F5FCFF',
    height: height*0.3*0.3,
  },
  bottomPhoto: {
    // justifyContent: 'flex-end',
    flex:1,
    width: width*0.95,
    // backgroundColor: '#7F7F7F',
    height: height*0.3*0.7,
  },
  itemContainer: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.5,
    height: height*0.3*0.5,
  },
  day: {
    paddingLeft: width * 0.0225,
    fontSize: 25,
    textAlign: 'auto',
  },
  dayko: {
    paddingLeft: width * 0.0125,
    fontSize: 18,
    textAlign: 'auto',
    // marginBottom: '20%',
  },
  kcal: {
    paddingRight: width * 0.0225,
    fontSize: 18,
    marginLeft: 'auto',
  },
  gridView: {
    flex:0,
    height:"100%",
    width: width*0.95,
  },
  imageStyle: {
    width: width*0.95*0.33,
    height: width*0.95*0.33,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Diary);
