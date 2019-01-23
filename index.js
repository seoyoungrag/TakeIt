/** @format */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from '@screens/App';
import BgMessaging from './BgMessaging'

import { YellowBox } from "react-native";

YellowBox.ignoreWarnings([
    "Warning: isMounted(...) is deprecated",
    "Module RCTImageLoader",
    "Warning: Can't call setState",
    'Warning: Each child in an array or iterator should have a unique "key" prop',
    "Remote debugger is in a background tab which may cause apps to perform slowly.",
    "Warning: Encountered two children with the same key,",
    "Debugger and device times have drifted by more than 60s. Please correct this by running adb shell \"date `date +%m%d%H%M%Y.%S`\" on your debugger machine.",
    "Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).",
    "{}",
    "{message: \"Parse Error. Your app's play store page doesn't seem to have latest app version info.\", text: \"<!DOCTYPE html><html><head><meta http-equiv=\"conte…yle=\"clear:both\"></div></div></div></body></html>\"}",
    "Possible Unhandled Promise Rejection"
  ]);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundMessage",() => BgMessaging)
  