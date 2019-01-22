/**
 * @providesModule routes_yrseo
 * RN 0.56~ 동작안함
 */
import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Text } from 'react-native';

import Main from "@screens/main";
import Diary from "@screens/diary";

const RootStack = createStackNavigator(
    {
      Main: {
        screen:Main,
        navigationOptions:({navigation}) => ({
          header: null
        })
      },
      Diary: {
        screen:Diary,
        navigationOptions:({navigation}) => ({
          header: <Text style={{fontSize:100}}>DIARY</Text>
        })
      }
    },
    {
      headerMode: "none",
      initialRouteName: "Main"
    }
  );
  const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;