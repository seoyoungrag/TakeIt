/**
 * @providesModule routes_yrseo
 * RN 0.56~ 동작안함
 */
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Text } from 'react-native';

import Loading from '@screens/login/Loading';
import Login from '@screens/login';
import Main from '@screens/main';
import Diary from '@screens/diary';
import DayDiary from '@screens/diary/DayDiary';
import TakePhotoFood from '@screens/takePic';
import TakePhotoInbody from '@screens/takePic/TakeInbodyPic';
import UserRegist from '@screens/regist';
import Food from '@screens/food';
import Graph from '@screens/graph';
import Setting from '@screens/setting/Setting';
import Snapshot from '@common/snapshot';

const RootStack = createStackNavigator(
  {
    Snapshot:{
      screen: Snapshot,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Setting: {
      screen: Setting,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    RefreshMain: {
      screen: Main,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Loading: {
      screen: Loading,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Regist: {
      screen: UserRegist,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Main: {
      screen: Main,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Diary: {
      screen: Diary,
      navigationOptions: ({ navigation }) => ({
        header: <Text style={{ fontSize: 100 }}>DIARY</Text>,
      }),
    },
    TakePhotoFood: {
      screen: TakePhotoFood,
      navigationOptions: ({ navigation }) => ({
        header: <Text style={{ fontSize: 100 }}>TAKE A PIC</Text>,
      }),
    },
    TakePhotoInbody: {
      screen: TakePhotoInbody,
      navigationOptions: ({ navigation }) => ({
        header: <Text style={{ fontSize: 100 }}>TAKE A PIC</Text>,
      }),
    },
    Food: {
      screen: Food,
      navigationOptions: ({ navigation }) => ({
        header: <Text style={{ fontSize: 100 }}>TAKE A PIC</Text>,
      }),
    },
    DayDiary: {
      screen: DayDiary,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    Graph: {
      screen: Graph,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    }
  },
  {
    headerMode: 'none',
    //최초에 라우트 되는  screen
    initialRouteName: 'Loading',
  }
);
const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
