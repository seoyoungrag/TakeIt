import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import Images from "@assets/Images";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

let styles = {
  headerMenuIconContainer: {
    alignItems: "flex-end",
    paddingRight: 10
  },
  headerMenuIcon: {
    width: 15,
    resizeMode: "contain"
  },
  headerFirstIconContainer: {
    paddingLeft: 10,
    alignItems: "flex-end"
  },
  headerSecondTextContainer: {
    paddingLeft: 10
  },
  headerThirdDelimeterContainer: {
    paddingLeft: 10,
    alignItems: "flex-start"
  },
  headerFirstIcon: {
    width: 15,
    resizeMode: "contain"
  },
  headerSecondText: {
    fontSize: 10,
    color: "black",
    fontFamily: "NotoSans-Regular"
  },
  headerThirdDelimeter: {
    width: 1,
    resizeMode: "contain"
  }
};

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    EXERCISE_GOAL: state.REDUCER_EXERCISE.exerciseGoalCd
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    }
  };
}
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const USER_INFO = this.props.USER_INFO;
    const EXERCISE_GOAL = this.props.EXERCISE_GOAL;
    const isBackForTab = this.props.isBack;
    const titleForTab = this.props.title;
    const { state, goBack } = this.props.navigation;
    const params = state.params || {};
    return (
      <View flex={1}>
        {isBackForTab ? (
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            backgroundColor="#fcfcff"
            borderBottomColor="#e1e1e4"
            borderBottomWidth={1}
            flex={1}
          >
            <TouchableOpacity
              onPress={() => {
                if (state.params && state.params.callBack) {
                  state.params.callBack();
                } else {
                  goBack(params.go_back_key);
                }
              }}
              style={styles.headerFirstIconContainer}
            >
              <MaterialIcons
                name="arrow-back"
                color="#000000"
                size={22}
                borderWidth={0}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            {titleForTab ? (
              <Text style={styles.headerSecondText}>{titleForTab}</Text>
            ) : null}
          </View>
        ) : (
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#fcfcff"
            borderBottomColor="#e1e1e4"
            borderBottomWidth={1}
            flex={1}
          >
            <View style={styles.headerFirstIconContainer}>
              <Image
                style={styles.headerFirstIcon}
                source={Images.HeaderWeight}
              />
            </View>
            <View style={styles.headerSecondTextContainer}>
              <Text style={styles.headerSecondText}>
                {USER_INFO != undefined && USER_INFO.userWeight
                  ? USER_INFO.userWeight + "kg"
                  : ""}
              </Text>
            </View>
            <View style={styles.headerThirdDelimeterContainer}>
              <Image
                style={styles.headerThirdDelimeter}
                source={Images.HeaderDel}
              />
            </View>
            <View style={styles.headerFirstIconContainer}>
              <Image style={styles.headerFirstIcon} source={Images.HeaderBmi} />
            </View>
            <View style={styles.headerSecondTextContainer}>
              <Text style={styles.headerSecondText}>
                {USER_INFO != undefined &&
                USER_INFO.userWeight &&
                USER_INFO.userHeight
                  ? (
                      USER_INFO.userWeight /
                      (((USER_INFO.userHeight / 100) * USER_INFO.userHeight) /
                        100)
                    ).toFixed(1) + "bmi"
                  : ""}
              </Text>
            </View>
            <View style={styles.headerThirdDelimeterContainer}>
              <Image
                style={styles.headerThirdDelimeter}
                source={Images.HeaderDel}
              />
            </View>
            <View style={styles.headerFirstIconContainer}>
              <Image
                style={styles.headerFirstIcon}
                source={Images.HeaderGoal}
              />
            </View>
            <View style={styles.headerSecondTextContainer}>
              <Text style={styles.headerSecondText}>
                {USER_INFO != undefined &&
                USER_INFO.userGymList != undefined &&
                USER_INFO.userGymList.length > 0
                  ? EXERCISE_GOAL.filter(o => {
                      return o.code == USER_INFO.userGymList[0].userExerciseCd;
                    }).length > 0
                    ? EXERCISE_GOAL.filter(o => {
                        return (
                          o.code == USER_INFO.userGymList[0].userExerciseCd
                        );
                      })[0].codeNm
                    : ""
                  : ""}
              </Text>
            </View>
            <View style={styles.headerThirdDelimeterContainer}>
              <Image
                style={styles.headerThirdDelimeter}
                source={Images.HeaderDel}
              />
            </View>
            <View flex={2} />
            <View flex={10}>
              <View style={styles.headerMenuIconContainer}>
                <TouchableOpacity
                  style={styles.btn2}
                  onPress={this.props.hamburgerBtnClicked}
                >
                  <Image
                    style={styles.headerMenuIcon}
                    source={Images.HeaderMenuBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
