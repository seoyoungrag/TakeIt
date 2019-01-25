import React from 'react';

import { NativeModules, StatusBar, View } from 'react-native';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import Container from '@container/Container';
import MainTabNavigator from '@common/Routes';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '@redux-yrseo/reducers';

const UIManager = NativeModules.UIManager;

const uiTheme = {
  fontFamily:"NotoSans-Regular",
  palette: {
    primaryColor: COLOR.white,
    secondaryColor: COLOR.white,
    // primaryColor: COLOR.pink500,
    // accentColor: COLOR.pink500,
    // primaryTextColor: COLOR.pink500,
    // secondaryTextColor: COLOR.pink500,
    alternateTextColor: COLOR.pink500,
    // accentColor: COLOR.pink500
  },
  icon: {
    // color: COLOR.white
  },
  // drawer를 위해서 사용
  listItem: {
    primaryText: {
      color: 'black',
      fontSize: 8,
      fontFamily: 'NotoSans-Regular',
    },
    container: {
      backgroundColor: COLOR.white,
    },
    // icon: {
    //   color: "rgba(255,255,255,1)"
    // },
    // label: {
    //   color: 'rgba(255,255,255,1)',
    // },
    //각 item을 감싸는 View
    contentViewContainer: {
      backgroundColor: 'silver',
      borderWidth: 1,
    },
    // drawer메뉴의 각 메뉴 좌측 아이콘 뷰를 감싸는 뷰
    leftElementContainer: {
      alignItems: 'flex-end',
      paddingRight: 10,
    },
    // 좌측 아이콘을 감싸는 뷰
    leftElement: {
      // color: "rgba(255,255,255,1)",
      height: 8,
    },
    centerElementContainer: {
      backgroundColor: 'silver',
    },
    textViewContainer: {
      backgroundColor: 'yellow',
    },
  },
};
class App extends React.Component {
  static configureScene(route) {
    return route.animationType || Navigator.SceneConfigs.FloatFromRight;
  }
  static renderScene(route, navigator) {
    return (
      <Container>
        <route.Page route={route} navigator={navigator} />
      </Container>
    );
  }
  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  render() {
    return (
      <Provider store={createStore(reducers)}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <MainTabNavigator
            ref={nav => {
              this.navigator = nav;
            }}
          />
        </ThemeContext.Provider>
      </Provider>
    );
  }
}

export default App;
