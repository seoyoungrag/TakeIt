import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Alert
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";
import Accordion from "react-native-collapsible/Accordion";

import firebase from "react-native-firebase";

const CONTENT = [
  {
    icon: "account-box",
    title: "회원정보변경",
    disabled: true,
    goto: "Regist"
  },

  {
    icon: "accessibility",
    title: "메인",
    disabled: true,
    goto: "Main"
  },
  {
    icon: "content-paste",
    title: "OT리포트",
    disabled: true,
    goto: "OT"
  },
  {
    icon: "subtitles",
    title: "다이어리",
    disabled: true,
    goto: "UserDiaryOneday"
  },
  {
    icon: "poll",
    title: "운동일지",
    disabled: true,
    goto: "Log"
  },
  {
    icon: "poll",
    title: "사진전송테스트",
    disabled: true,
    goto: "TakePic"
  },
  {
    icon: "poll",
    title: "파노라마",
    disabled: true,
    goto: "Panorama"
  },
  {
    icon: "poll",
    title: "음식일지",
    disabled: true,
    goto: "FoodDiary"
  },
  {
    icon: "poll",
    title: "로그아웃",
    disabled: true,
    goto: "Panorama"
  }
];

const SELECTORS = [
  {
    title: "First",
    value: 0
  },
  {
    title: "Third",
    value: 2
  },
  {
    title: "None",
    value: false
  }
];

let styles = {
  // 메뉴바 배경색
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#ffffff"
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "300",
    marginBottom: 20
  },
  //각 메뉴의 컨테이너(VIEW)
  header: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffffff"
  },
  //각 메뉴의 텍스트
  headerText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "NotoSans-Regular",
    color: "#fafafa"
  },
  content: {
    backgroundColor: "#000"
  },
  active: {
    backgroundColor: "#555555"
  },
  inactive: {
    backgroundColor: "#aaaaaa"
  },
  selectors: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  selector: {
    backgroundColor: "#F5FCFF"
  },
  activeSelector: {
    fontWeight: "bold"
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: "500"
  },
  hide: {
    flex: 0,
    height: 0,
    zIndex: -1
  }
};
export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSection: false,
      collapsed: true
    };
    this._clickBtn = this._clickBtn.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderContent = this._renderContent.bind(this);
  }

  _toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  _setSection(section) {
    if (!(typeof section === "number" && CONTENT[section].disabled)) {
      this.setState({ activeSection: section });
    }
  }
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {section.goto !== undefined ? (
          <TouchableOpacity
            onPress={() => {
              section.title == "로그아웃"
                ? Alert.alert(
                    "로그아웃",
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
                : this._clickBtn(section.goto);
            }}
          >
            <View
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              alignSelf="flex-start"
            >
              {section.icon !== "" ? (
                <MaterialIcons
                  name={section.icon}
                  color="#ffffff"
                  size={22}
                  borderWidth={0}
                  style={{ marginRight: 10 }}
                />
              ) : null}
              <Text style={styles.headerText}>{section.title}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            alignSelf="flex-start"
          >
            {section.icon !== "" ? (
              <MaterialIcons
                name={section.icon}
                color="#ffffff"
                size={22}
                borderWidth={0}
                style={{ marginRight: 10 }}
              />
            ) : null}
            <Text style={styles.headerText}>{section.title}</Text>
          </View>
        )}
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    if (section.content !== undefined) {
      return (
        <Animatable.View
          duration={400}
          style={[
            styles.content,
            {
              borderWidth: 1,
              borderTopWidth: 0
            },
            isActive
              ? { backgroundColor: "#000000" }
              : { backgroundColor: "#555555" }
          ]}
          transition="backgroundColor"
        >
          {section.content.map(selector => (
            <TouchableHighlight
              key={selector.title}
              onPress={() => {
                selector.title == "로그아웃"
                  ? firebase
                      .auth()
                      .signOut()
                      .then(() => alert("logout"))
                      .then(() => this.props.navigation.navigate("Loading"))
                      .catch(error => {})
                  : this._clickBtn(selector.goto);
              }}
            >
              <Animatable.Text
                animation={isActive ? "bounceIn" : undefined}
                style={{ color: "#ffffff" }}
              >
                {selector.title}
              </Animatable.Text>
            </TouchableHighlight>
          ))}

        </Animatable.View>
      );
    }
  }

  _clickBtn(target) {
    this.props.closeDrawer();
    this.props.navigation.navigate(target);
  }

  static navigationOptions = {
    title: "메뉴"
  };
  render() {
    const navigation = this.props.navigation;
    const width = this.props.parentWidth;
    return (
      <View style={styles.container}>
        <Accordion
          navigation={this.props.navigation}
          activeSection={this.state.activeSection}
          activeSections={[0]}
          sections={CONTENT}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          duration={400}
          onChange={this._setSection.bind(this)}
        />
      </View>
    );
  }
}
