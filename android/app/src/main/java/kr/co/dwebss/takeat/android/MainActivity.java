package kr.co.dwebss.takeat.android;

/**
* react-native-fbsdk 관련 추가
*/
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
/* react-native-gesture-handler related react-navigation added by yrseo start */
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
/* react-native-gesture-handler related react-navigation added by yrseo end */

public class MainActivity extends ReactActivity {

    /**
     * react-native-fbsdk 관련 추가
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TakeIt";
    }

    /**
     * react-native-gesture-handler related react-navigation added by yrseo end 
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
