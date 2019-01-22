import React, { Component } from "react";
import { View, Easing } from "react-native";
import Menu from "./Menu";
//import Drawer from "react-native-drawer-menu-yrseo";
import CustomDrawer from "./custom";

let DrawerStyle = {
  drawerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  leftBottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  rightDrawer: {
    borderLeftWidth: 0,
    borderLeftColor: "#5b585a"
  }
};

export default class DrawerWrapped extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      disabled: !this.state.disabled
    });
  }

  openMenu = () => {
    this.drawer.openDrawer();
  };

  closeMenu = () => {
    this.drawer.closeDrawer();
  };

  render() {
    const width = (this.props.parentWidth / 5) * 2;
    const header = this.props.header;
    const footer = this.props.footer;
    const content = this.props.content;
    var rightDrawerContent = (
      <View style={DrawerStyle.drawerContent}>
        <View style={DrawerStyle.leftBottom}>
          <Menu
            parentWidth={width}
            closeDrawer={this.closeMenu}
            navigation={this.props.navigation}
          />
        </View>
      </View>
    );
    return (
      <CustomDrawer
        ref={comp => {
          this.drawer = comp;
        }}
        style={DrawerStyle.container}
        drawerWidth={width}
        rightDrawerContent={rightDrawerContent}
        type={CustomDrawer.types.Overlay}
        customStyles={{
          rightDrawer: DrawerStyle.rightDrawer
        }}
        disabled={this.state.disabled}
        drawerPosition={CustomDrawer.positions.Both}
        easingFunc={Easing.ease}
        leftDisabled={true}
        rightDisabled={
          this.props.rightDisabled ? this.props.rightDisabled : false
        }
      >
        <View style={{ flex: 1 }}>
          {/* 상단 메뉴바 시작, <Heade hambugerBtnclicked={this.openMenu}를 React.cloneElement로 작성*/}

          {this.props.header ? (
            <View flex={5}>
              {React.cloneElement(this.props.header, {
                hamburgerBtnClicked: this.openMenu
              })}
            </View>
          ) : null}

          {/* 상단 메뉴바 끝 */}
          {/* 중단 스크린 영역 시작 */}
          <View flex={87}>{content}</View>
          {/* 중단 스크린 영역 끝 */}
          {/* 하단 메뉴바 시작 */}
          {this.props.footer ? <View flex={8}>{footer}</View> : null}
          {/* 하단 메뉴바 끝 */}
        </View>
      </CustomDrawer>
    );
  }
}
