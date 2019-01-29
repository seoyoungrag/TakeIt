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

const { width, height } = Dimensions.get('window');


const data = []

// const result = {
//   code: 200,
//   message: 'SUCCESS',
//   data: [
//     {
//       registD: 1547391600000,
//       userId: 32,
//       kilocalorie: 1000,
//       photoArr: [
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//         {
//           photoId: 13,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg?alt=media&token=11f35c9c-dcf4-45fd-be32-7851615ec102',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//         },
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//         {
//           photoId: 0,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//       ],
//     },{
//       registD: 1547391600000,
//       userId: 32,
//       kilocalorie: 2000,
//       photoArr: [
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//         {
//           photoId: 13,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg?alt=media&token=11f35c9c-dcf4-45fd-be32-7851615ec102',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//         },
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//       ],
//     },
//     {
//       registD: 1547391600000,
//       userId: 32,
//       kilocalorie: 3000,
//       photoArr: [
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//         {
//           photoId: 13,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg?alt=media&token=11f35c9c-dcf4-45fd-be32-7851615ec102',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-88e23fca-8fb6-4854-9074-46a4d2db0a3d639147173.jpg',
//         },
//       ],
//     },
//     {
//       userId: 32,
//       registD: 1547650800000,
//       kilocalorie: 4000,
//       photoArr: [
//         {
//           photoId: 12,
//           firebaseStoragePath:
//             '/food_diary/32/2018-10-14/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//           firebaseDownloadUrl:
//             'https://firebasestorage.googleapis.com/v0/b/fitdairy-47176.appspot.com/o/food_diary%2F32%2F2018-10-14%2Fimage-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg?alt=media&token=d8fb27cc-e0b7-4ecc-99a4-a2179589edb8',
//           deviceLocalFilePath:
//             'file:///storage/emulated/0/Pictures/image-e14012af-ab36-4d8a-be55-297141be7149-1639699646.jpg',
//         },
//       ],
//     },
//   ],
// };

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

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
      endDate: new Date(Date.now() + -1 * 24 * 3600 * 1000),
      selectedDate: this.props.endDateForDiary,
      visible: false,
      range: {'startDate' : new Date(Date.now() + -30 * 24 * 3600 * 1000),  'endDate':
        new Date(Date.now() + -1 * 24 * 3600 * 1000)},
      resultData : [],
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
    COM = this;
    COM.setState({ visible: false });
    let startDate = COM.state.range.startDate;
    let endDate =  COM.state.range.endDate;


    if(endDate==null){
      endDate = startDate;
      console.log('endDate null');
    }else{
      console.log('endDate else');
      // endDate = COM.state.range.endDate;
    }

    return cFetch(
      APIS.GET_TEST,
      [
        //전달 값
        this.props.USER_INFO.userId,
        // 32,
        Moment(startDate).format('YYYYMMDD'),
        Moment(endDate).format('YYYYMMDD'),
      ],
      {},
      {
        responseProc: function(res) {
          // console.log(res);
          COM.setState(
            {
              resultData : res,
              startDate: startDate,
              endDate: endDate,
            },
            function() {
              console.log('comp');
              console.log(COM.state);
            }
          );
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
              {this.state.resultData.length > 0 ?  this.state.resultData.map(data => {
                return (
                  <View style={[styles.child]}>
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
                  <FastImage
                  style=
                  { (data.photoArr.length==1) ? styles.imageStyle1:
                    (data.photoArr.length==2) ? styles.imageStyle2:
                    (data.photoArr.length==3) ? styles.imageStyle3:
                    styles.imageStyle4 }
                    source={{
                      uri: item.firebaseDownloadUrl,
                      priority: FastImage.priority.low,
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />}
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
