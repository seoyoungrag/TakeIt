import React, { Component } from 'react';

import {
  AppRegistry,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Button,
  Animated,
  ImageBackground,
} from 'react-native';

import PopupDialog, { DialogTitle,  DialogContent } from 'react-native-popup-dialog';
import DrawerWrapped from '@drawer';
import { connect } from 'react-redux';

import Container from '@container/Container';

import cFetch from '@common/network/CustomFetch';
import APIS from '@common/network/APIS';

import Calendar from 'react-native-calendario';

import Images from '../../../assets/Images';
import ActionCreator from '@redux-yrseo/actions';

import Moment from 'moment/min/moment-with-locales';
Moment.locale('ko');

const { width, height } = Dimensions.get('window');

let interval1;

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    selectedDate: state.selectedDate,
    count: state.count,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectSlideDate: selectedDate => {
      dispatch(ActionCreator.selectSlideDate(selectedDate));
    },
    getSlideDate: () => {
      return dispatch(ActionCreator.getSlideDate());
    },
  };
}
function random() {
  let random = Math.floor(Math.random() * 101);
  random = random < 5 ? 5 : random > 95 ? 95 : random;
  return random;
}

class Log extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      clickEvent: false, //테스트용
      selectedDateTerm:
        Moment(new Date(Date.now() + -1 * 24 * 3600 * 1000)).diff(
          Moment(new Date(Date.now() + -100 * 24 * 3600 * 1000)),
          'days'
        ) + 1,
      selectedDateHpList: [],
      rWeight: 0.0,
      rFat: 0.0,
      rMuscle: 0.0,
      rCount: 0,
      rHealthPoint: 0,
      leftRatioTitle: 'BMI',
      rightRatioTitle: '체지방량',
      centerRatioTitle: '골격근량',
      //건강 분포도 그래프의 비율
      leftRatio: 0,
      rightRatio: 0,
      centerRatio: 0,
      //건강분포도표의 데이터
      userLeftInfo: new Array(),
      userCenterInfo: new Array(),
      userRightInfo: new Array(),
      // rankRatio: () => {
      //   let rankRatioCalc = Math.floor(
      //     (this.state.leftRatio +
      //       this.state.rightRatio +
      //       this.state.centerRatio) /
      //       3
      //   );
      //   rankRatioCalc = Math.ceil(rankRatioCalc / 5) * 5;
      //   rankRatioCalc =
      //     rankRatioCalc < 5 ? 5 : rankRatioCalc > 95 ? 95 : rankRatioCalc;
      //   return rankRatioCalc;
      // },
      graphCenterHeight: new Animated.Value(0),
      graphLeftHeight: new Animated.Value(0),
      graphRightHeight: new Animated.Value(0),
      startDate: new Date(Date.now() + -7* 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 0 * 24 * 3600 * 1000),
      range: {'startDate' : new Date(Date.now() + -7* 24 * 3600 * 1000),  'endDate':
        new Date(Date.now() + 0 * 24 * 3600 * 1000)},
      calendarVisible: false,
    };
    this.clickEvent = this.clickEvent.bind(this);
    this.randomRankRatio = this.randomRankRatio.bind(this);
    this.getGraphMinHeight = this.getGraphMinHeight.bind(this);
    this.getUserHealth = this.getUserHealth.bind(this);

    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.setStateRange = this.setStateRange.bind(this);
  }
  openCalendar() {
    this.setState({ calendarVisible: true });
  }
  closeCalendar() {
    this.setState({ calendarVisible: false });
  }
  setStateRange(range) {
    this.state.range = range;
  }

  //애로우 함수는 바인드 없이 사용 가능  함수가 많으면 명시를 하는게 유지보수에 편함
  // getUserHealth() => {
  getUserHealth() {
    LogComponent = this;
    console.log('getUserHealth start');
    return cFetch(
      APIS.GET_USER_HEALTH,
      [
        this.props.USER_INFO.userId,
        Moment(this.state.startDate).format('YYYYMMDD'),
        Moment(this.state.endDate).format('YYYYMMDD'),
      ],
      {},
      {
        responseProc: function(res) {
          // console.log(res);
          let rCount = 0;
          if (res.userHealthList[0].weight - res.userHealthList[1].weight < 0)
            rCount += 1;
          if (res.userHealthList[0].fat - res.userHealthList[1].fat < 0)
            rCount += 1;
          if (res.userHealthList[0].muscle - res.userHealthList[1].muscle > 0)
            rCount += 1;
          // console.log('rCOUNT : ' + rCount);
          let selectedDateHpList = [];
          for (let i = 0; i < res.userAnalyze.length; i++) {
            // console.log('rCOUNT2 : ' + res.userAnalyze[i].healthPoint);
            selectedDateHpList.push(res.userAnalyze[i].healthPoint);
          }

          // console.log('최고점수 ' + Math.max(...selectedDateHpList));

          LogComponent.setState({
            rWeight: (
              res.userHealthList[0].weight - res.userHealthList[1].weight
            ).toFixed(2),
            rFat: (
              res.userHealthList[0].fat - res.userHealthList[1].fat
            ).toFixed(2),
            rMuscle: (
              res.userHealthList[0].muscle - res.userHealthList[1].muscle
            ).toFixed(2),
            rHealthPoint: (
              Math.max(...selectedDateHpList) -
              selectedDateHpList[res.userAnalyze.length - 1]
            ).toFixed(2),
            rCount: rCount,
            leftRatio: res.userBmiPercent, //BMI %
            centerRatio: res.userMusclePercent, //골격근량 %
            rightRatio: res.userFatPercent, //체지방량 %

            userLeftInfo: res.userInfoList.userLeftInfo,
            userCenterInfo: res.userInfoList.userCenterInfo,
            userRightInfo: res.userInfoList.userRightInfo,

            selectedDateHpList: selectedDateHpList,
          });
          return res;
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

  getGraphMinHeight(ratio) {
    //디바이스 세로(height) * 디바이스 세로의 본문 영역 비율(30/34)* 본문의 그래프 영역 비율(27/100) * 입력받은 백분율(최소값30)
    //그래프가 제목을 넘기는 경우가 있으니, 그래프 영역 비율을 좀 낮추자.. 25로
    let graphAreaHeight = (((height * 30) / 34) * 25) / 100;
    //그래프가 그래프 영역 30%미만이면 글자가 안보임
    let graphMinHeight = 30;

    return (
      (graphAreaHeight * (ratio < graphMinHeight ? graphMinHeight : ratio)) /
      100
    );
  }
  componentDidMount() {
    Animated.spring(this.state.graphCenterHeight, {
      toValue: this.getGraphMinHeight(this.state.centerRatio),
      friction: 10, //효과인데 모르겟음..
      tension: 20, //모르겟음..
    }).start();
    Animated.spring(this.state.graphLeftHeight, {
      toValue: this.getGraphMinHeight(this.state.leftRatio),
      friction: 12,
      tension: 60,
    }).start();
    Animated.spring(this.state.graphRightHeight, {
      toValue: this.getGraphMinHeight(this.state.rightRatio),
      friction: 14,
      tension: 80,
    }).start();
    this.getUserHealth();
  }
  randomRankRatio() {
    this.setState({
      leftRatio: random(),
      rightRatio: random(),
      centerRatio: random(),
    });
    Animated.spring(this.state.graphCenterHeight, {
      toValue: this.getGraphMinHeight(this.state.centerRatio),
      friction: 10, //효과인데 모르겟음..
      tension: 20, //모르겟음..
    }).start();
    Animated.spring(this.state.graphLeftHeight, {
      toValue: this.getGraphMinHeight(this.state.leftRatio),
      friction: 12,
      tension: 60,
    }).start();
    Animated.spring(this.state.graphRightHeight, {
      toValue: this.getGraphMinHeight(this.state.rightRatio),
      friction: 14,
      tension: 80,
    }).start();
  }
  clickEvent() {
    this.setState(previousState => {
      return { clickEvent: !previousState.clickEvent };
    });
    if (this.state.clickEvent) {
      var lastIndex,
        arr = [this.randomRankRatio];
      interval1 = window.setInterval(function() {
        // var rand;
        // while ((rand = Math.floor(Math.random() * arr.length)) === lastIndex);
        // arr[(lastIndex = rand)]();
        arr[0]();
      }, 3000);
    } else {
      window.clearInterval(interval1);
    }
  }

  static navigationOptions = {
    title: '운동일지',
  };
  render() {
    let selectDateTouchableWidth = (width * 2) / 5;
    let { graphCenterHeight, graphLeftHeight, graphRightHeight } = this.state;


    const USER_INFO = this.props.USER_INFO;
    let color = {
      mainColor: '#f4f4f6',
      subColor: '#000000',
      borderColor: '#000000',
      selectColor: '#c4c4c4',
    };
    let DAY_RANGE_INFO = '';
    if(this.state.range.endDate==null){
      DAY_RANGE_INFO = Moment(this.state.range.startDate).format('YY.MM.DD').toString();
    }else{
      DAY_RANGE_INFO = Moment(this.state.range.startDate).format('YY.MM.DD').toString() + ' ~ ' + Moment(this.state.range.endDate).format('YY.MM.DD').toString();
    }
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
              style={{
                width: width,
              }}
              onChange={range => this.setStateRange(range)}
            />
          </View>
        </PopupDialog>
      </View>
      <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
        {/* 체중감량방식 시작 */}
        <View
          style={{
            flex: 18,
            // backgroundColor: '#fcfcff',
            paddingLeft: width * 0.0625,
            paddingRight: width * 0.0625,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'NotoSans-Regular',
              fontSize: 14,
              color: 'black',
              fontWeight: '600',
            }}>
            {this.state.rCount == 0
              ? '매우 잘 하고있습니다!'
              : this.state.rCount == 1
                ? '잘 하고있습니다!'
                : this.state.rCount == 2
                  ? '유지중입니다!'
                  : '나빠지고있어요.'}
          </Text>
          <Text
            style={{
              fontFamily: 'NotoSans-Regular',
              fontSize: 12,
              color: 'black',
            }}>
            <Text style={{ fontWeight: '600' }}>
              {this.state.selectedDateTerm}
            </Text>
            일 동안 체중은{' '}
            <Text
              style={{
                color: this.state.rWeight < 0 ? 'red' : 'blue',
                fontWeight: '600',
              }}>
              {Math.abs(this.state.rWeight)}
              kg
            </Text>{' '}
            {this.state.rWeight < 0 ? '늘었어며' : '줄었어며'} , 체지방은{' '}
            <Text
              style={{
                color: this.state.rFat < 0 ? 'red' : 'blue',
                fontWeight: '600',
              }}>
              {Math.abs(this.state.rFat)}
              kg
            </Text>{' '}
            {this.state.rFat < 0 ? '늘었고' : '줄었어고'}, 근육량은{' '}
            <Text
              style={{
                color: this.state.rMuscle < 0 ? 'red' : 'blue',
                fontWeight: '600',
              }}>
              {Math.abs(this.state.rMuscle)}
              kg
            </Text>{' '}
            {this.state.rMuscle < 0 ? '늘었어요' : '줄었어요'}.{' \n'}
            {this.state.rCount < 2
              ? '좋은 식습관과 운동습관을 유지하고 있습니다. '
              : '운동을 게을리 하신게 아닐까요? '}
          </Text>
        </View>
        {/* 체중감량방식 끝 */}
        {/* 건강 분포도 시작*/}
        <View
          style={{
            flex: 27,
          }}>
          <Text
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              zIndex: 10,
              top: 12,
              left: width * 0.0625,
              fontFamily: 'NotoSans-Regular',
              fontSize: 10,
              color: '#c0b8ae',
              fontWeight: '600',
            }}>
            건강 분포도
          </Text>
          {/* 건강 분포도 그래프 배경 시작*/}
          <ImageBackground
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
            source={Images.WorkoutLogHealthInfoGraphBack}
          />
          {/* 건강 분포도 그래프 배경  끝 */}
          {/* 건강 분포도 왼쪽 그래프 시작*/}
          <Animated.View
            style={{
              bottom: 0,
              position: 'absolute',
              width: '100%',
              minHeight: '30%',
              height: graphLeftHeight,
            }}>
            <ImageBackground
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                flexDirection: 'row',
              }}
              resizeMode="stretch"
              source={Images.WorkoutLogHealthInfoGraphSubLeft}>
              <View flex={10} />
              <View
                flex={24}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.leftRatioTitle}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.leftRatio < 15 ? 15 : this.state.leftRatio}%{' '}
                  {this.state.leftRatio < 15 ? '미만' : null}
                </Text>
              </View>
              <View flex={36} />
              <View flex={15} />
              <View flex={15} />
            </ImageBackground>
          </Animated.View>
          {/* 건강 분포도 왼쪽 그래프 끝 */}
          {/* 건강 분포도 메인 그래프 시작*/}
          <Animated.View
            style={{
              bottom: 0,
              position: 'absolute',
              width: '100%',
              minHeight: '30%',
              height: graphCenterHeight,
            }}>
            <ImageBackground
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                flexDirection: 'row',
              }}
              resizeMode="stretch"
              source={Images.WorkoutLogHealthInfoGraphMain}>
              <View flex={10} />
              <View flex={24} />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                flex={36}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.centerRatioTitle}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.centerRatio < 15 ? 15 : this.state.centerRatio}%{' '}
                  {this.state.centerRatio < 15 ? '미만' : null}
                </Text>
              </View>
              <View flex={15} />
              <View flex={15} />
            </ImageBackground>
          </Animated.View>
          {/* 건강 분포도 메인 그래프 끝 */}
          {/* 건강 분포도 오른쪽 그래프 시작*/}
          <Animated.View
            style={{
              bottom: 0,
              position: 'absolute',
              width: '100%',
              minHeight: '30%',
              height: graphRightHeight,
            }}>
            <ImageBackground
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                flexDirection: 'row',
              }}
              resizeMode="stretch"
              source={Images.WorkoutLogHealthInfoGraphSubRight}>
              <View flex={10} />
              <View flex={24} />
              <View flex={36} />
              <View
                flex={15}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.rightRatioTitle}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'NotoSans-Regular',
                    fontSize: 10,
                  }}>
                  {this.state.rightRatio < 15 ? 15 : this.state.rightRatio}%{' '}
                  {this.state.rightRatio < 15 ? '미만' : null}
                </Text>
              </View>
              <View flex={15} />
            </ImageBackground>
          </Animated.View>
          {/* 건강 분포도 오른쪽 그래프 끝 */}
        </View>
        {/* 건강 분포도 끝 */}
        {/* 건강 분포도 세부 시작 */}
        <ImageBackground
          source={Images.WorkoutLogHealthInfoDetail}
          style={{
            flex: 24,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 12,
              left: width * 0.0625,
              fontFamily: 'NotoSans-Regular',
              fontSize: 10,
              color: '#c0b8ae',
              fontWeight: '600',
            }}>
            건강 분포도 정보
          </Text>
          <View
            style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              height: '100%',
            }}>
            <View flex={14} />
            <ImageBackground
              source={Images.WorkoutLogHealthInfoDetailTitle}
              style={{
                flex: 20,
                height: '100%',
                width: width,
                flexDirection: 'row',
                paddingLeft: width * 0.0625,
                paddingRight: width * 0.0625,
              }}
              resizeMode="stretch">
              <Text style={styles.healthInfoDetailItemsText} />
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userRightInfo.percent}%
              </Text>
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  { fontWeight: '600', color: '#e9597b' },
                ]}>
                {this.state.userCenterInfo.percent}%
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userLeftInfo.percent}%
              </Text>
            </ImageBackground>
            <ImageBackground
              source={Images.WorkoutLogHealthInfoDetailRow}
              style={{
                flex: 20,
                height: '100%',
                width: width,
                flexDirection: 'row',
                paddingLeft: width * 0.0625,
                paddingRight: width * 0.0625,
              }}
              resizeMode="stretch">
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  {
                    textAlign: 'left',
                    left: 12,
                    fontWeight: '600',
                  },
                ]}>
                골격근량
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userRightInfo.muscle}
                kg
              </Text>
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  { fontWeight: '600', color: '#e9597b' },
                ]}>
                {this.state.userCenterInfo.muscle}
                kg
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userLeftInfo.muscle}
                kg
              </Text>
            </ImageBackground>
            <ImageBackground
              source={Images.WorkoutLogHealthInfoDetailRow}
              style={{
                flex: 20,
                height: '100%',
                width: width,
                flexDirection: 'row',
                paddingLeft: width * 0.0625,
                paddingRight: width * 0.0625,
              }}
              resizeMode="stretch">
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  {
                    textAlign: 'left',
                    left: 12,
                    fontWeight: '600',
                  },
                ]}>
                BMI
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userRightInfo.bmi}
              </Text>
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  { fontWeight: '600', color: '#e9597b' },
                ]}>
                {this.state.userCenterInfo.bmi}
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userLeftInfo.bmi}
              </Text>
            </ImageBackground>
            <ImageBackground
              source={Images.WorkoutLogHealthInfoDetailRow}
              style={{
                flex: 20,
                height: '100%',
                width: width,
                flexDirection: 'row',
                paddingLeft: width * 0.0625,
                paddingRight: width * 0.0625,
              }}
              resizeMode="stretch">
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  {
                    textAlign: 'left',
                    left: 12,
                    fontWeight: '600',
                  },
                ]}>
                체지방량
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userRightInfo.fat}
                kg
              </Text>
              <Text
                style={[
                  styles.healthInfoDetailItemsText,
                  { fontWeight: '600', color: '#e9597b' },
                ]}>
                {this.state.userCenterInfo.fat}
                kg
              </Text>
              <Text style={styles.healthInfoDetailItemsText}>
                {this.state.userLeftInfo.fat}
                kg
              </Text>
            </ImageBackground>
            <View flex={6} />
          </View>
        </ImageBackground>
        {/* 건강 분포도 세부 끝 */}
        {/* 분석  시작 */}
        <View
          style={{
            flex: 16,
            // backgroundColor: 'white',
            paddingLeft: width * 0.0625,
            paddingRight: width * 0.0625,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'NotoSans-Regular',
              fontSize: 14,
              color: 'black',
              fontWeight: '600',
            }}>
            분석
          </Text>
          <Text
            style={{
              fontFamily: 'NotoSans-Regular',
              fontSize: 12,
              color: 'black',
            }}>
            {this.state.selectedDateHpList.length == 1 ? (
              <Text>측정된 인바디 결과내용이 1개 입니다.</Text>
            ) : (
              <Text>
                이 기간의 첫 헬스 포인트는{' '}
                <Text style={{ fontWeight: '600' }}>
                  {this.state.selectedDateHpList[0]}점
                </Text>
                입니다.{' '}
                <Text style={{ fontWeight: '600' }}>
                  {this.state.selectedDateTerm}
                </Text>
                일 동안 최고{' '}
                <Text style={{ fontWeight: '600' }}>
                  {Math.max(...this.state.selectedDateHpList)}점
                </Text>
                , 최저{' '}
                <Text style={{ fontWeight: '600' }}>
                  {Math.min(...this.state.selectedDateHpList)}점
                </Text>
                입니다{' '}
                {this.state.rHealthPoint > 0
                  ? '이 기간동안 healthy point가 점차 증가하고 있습니다. '
                  : '이 기간동안 healthy point가 점차 감소하고 있습니다.  '}
                현재 헬시포인트 상위 {this.state.userCenterInfo.percent}
                %이며
                {this.state.userCenterInfo.percent > 80
                  ? '매우 정진하셔야됩니다. 할수있습니다!'
                  : this.state.userCenterInfo.percent > 60
                    ? '조금만 하면 대한민국 평균 몸매를 만들수 있습니다. 힘내세요!'
                    : this.state.userCenterInfo.percent > 40
                      ? '상위권입니다! 앞으로 더 정진하시면됩니다.'
                      : this.state.userCenterInfo.percent > 20
                        ? '대한민국 최상위권 몸매입니다. '
                        : '운동선수이신가요?!! 직업이 의심됩니다!'}
              </Text>
            )}
          </Text>
        </View>
        {/* 분석끝 */}
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

let styles = {
  todayListItemContainer: {
    marginLeft: width / 20,
    flex: 1,
  },
  todayListItemIcon: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: width / 20,
  },
  todayListItemMainText: {
    fontFamily: 'NotoSans-Regular',
    fontWeight: '600',
    fontSize: 18,
  },
  todayListItemSubText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 12,
  },
  healthInfoDetailItemsText: {
    fontFamily: 'NotoSans-Regular',
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 12,
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
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Log);