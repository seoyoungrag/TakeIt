import React from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableHighlight
} from "react-native";
import Images from "@assets/Images";
const { width, height } = Dimensions.get("window");
let styles = {
  footerIcon: {
    height: height * 0.038,
    resizeMode: "contain"
  },
  footerIconContainer: { flex: 1, alignItems: "center" }
};

export default class Footer extends React.Component {
  render() {
    return (
      <View
        borderTopColor="#e7e7ea"
        borderTopWidth={0.5}
        backgroundColor="#ffffff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <View style={styles.footerIconContainer}>
          <TouchableHighlight
            underlayColor="rgba(0,0,0,.1)"
            onPress={() => {
              this.props.navigation.navigate("Main");
            }}
          >
            <Image style={styles.footerIcon} source={Images.FooterHomeBtn} />
          </TouchableHighlight>
        </View>
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={Images.FooterSelfieBtn} />
        </View>
        <View style={styles.footerIconContainer}>
          <Image
            style={styles.footerIcon}
            source={Images.FooterInbodyFilmBtn}
          />
        </View>
        <View style={styles.footerIconContainer}>
          <Image style={styles.footerIcon} source={Images.FooterAlarmBtn} />
        </View>
      </View>
    );
  }
}
