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
class Diary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      startDate: new Date(Date.now() + -30 * 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 0 * 24 * 3600 * 1000),
      selectedDate: this.props.endDateForDiary,
      visible: false,
      range: {'startDate' : new Date(Date.now() + -30 * 24 * 3600 * 1000),  'endDate':
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
    this.setState({ visible: true });
  }
  closeCalendar() {
    this.setState({ visible: false });
  }


  //애로우 함수는 바인드 없이 사용 가능  함수가 많으면 명시를 하는게 유지보수에 편함
  // getFoodPhotoList() => {
  getFoodPhotoList() {
    const COM = this;
    COM.setState({ visible: false });
    let startDate = COM.state.range.startDate;
    let endDate =  COM.state.range.endDate;

    if(endDate==null){
      endDate = startDate;
    }

    return cFetch(
      APIS.GET_USER_FOOD_PHOTO,
      [
        //전달 값
         this.props.USER_INFO.userId,
        //10,
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
            visible={this.state.visible}
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
                style={{ fontSize: 20, marginLeft: 10, right: 0 }}
                onPress={this.closeCalendar}>
                Close
              </Text>
              <Text
                style={{ fontSize: 20, marginLeft: 10 }}
                onPress={this.getFoodPhotoList}>
                OK
              </Text>
            </View>
            <View style={[styles.calandar]}>
              <Calendar
                ref={calendar => {
                  this.calendar = calendar;
                }}
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
                  <View style={[styles.leftInfo]}>
                  <Text style={styles.day}>
                    {Moment(data.registD).format('DD') }
                  </Text>
                  <Text style={styles.dayko}>
                    {Moment(data.registD).format('ddd') }
                  </Text>
                  <Text style={styles.kcal}>
                    {data.kilocalorie} kcal
                  </Text>
                  </View>
                  </TouchableHighlight>
              <View style={[styles.rightPhoto]}>
                <SectionGrid
                itemDimension={width/3}
                fixed
                spacing={0}
                sections={[
                  {
                    title: 'Today - 2019.01.21',
                    data: data.photoArr.slice(0, 4),
                  },
                ]}
                style={styles.gridView}
                renderItem={({ item, section, index }) => (
                  <View>
                  {item.firebaseDownloadUrl!=null &&
                    <TouchableHighlight onPress=
                    {()=> {
                      (index==3) ?
                      this.props.navigation.navigate("DayDiary", {inqueryDate:Moment(data.registD).format('YYYY-MM-DD')})
                      :
                      this.props.navigation.navigate("Food", {food:item} )
                    }}
                    >
                  <FastImage
                  style=
                  { (data.photoArr.length==1) ? styles.imageStyle1:
                    (data.photoArr.length==2) ? styles.imageStyle2:
                    (data.photoArr.length==3) ? styles.imageStyle3:
                    styles.imageStyle4 }
                    source={ (index!=3) ?
                      {
                      uri: item.firebaseDownloadUrl,
                      priority: FastImage.priority.low,
                    }: Images.DiaryMore
                  }
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  </TouchableHighlight>
                }
                  </View>

                  )}
                // renderSectionHeader={({ section }) => (
                //   <Text style={styles.sectionHeader}>{section.title}</Text>
                // )}
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
     flexDirection: 'row',
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
  leftInfo: {
    justifyContent: 'center',
    width: width*0.25,
    // backgroundColor: '#F5FCFF',
    height: height*0.3,
  },
  rightPhoto: {
    justifyContent: 'flex-end',
    width: width*0.70,
    // backgroundColor: '#7F7F7F',
    height: height*0.3,
  },
  itemContainer: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.5,
    height: height*0.3*0.5,
  },
  day: {
    fontSize: 25,
    textAlign: 'center',

  },
  dayko: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: '20%',
  },
  kcal: {
    fontSize: 12,
    textAlign: 'center',
  },
  gridView: {
    flex: 1,
    // backgroundColor: '#7F7F7F',
  },
  imageStyle4: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.5,
    height: height*0.3*0.5,
  },
  imageStyle3: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.493,
    height: height*0.3*0.5,
    // width: '50%',
    // height: '50%',
  },
  imageStyle2: {
    // justifyContent: 'flex-end',
    width: width*0.70*0.5,
    height: height*0.3,
  },
  imageStyle1: {
    // justifyContent: 'flex-end',
    width: width*0.70,
    height: height*0.3,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Diary);
