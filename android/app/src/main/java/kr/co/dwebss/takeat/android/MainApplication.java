package kr.co.dwebss.takeat.android;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import cl.json.RNSharePackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
//import com.reactnative.ivpusic.imagepicker.PickerPackage;// <-- crop-picker 제거
import com.oblador.vectoricons.VectorIconsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- firebase auth 관련 추가
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- firebase message 관련 추가
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // <-- firebase storage 관련 추가
import io.invertase.firebase.admob.RNFirebaseAdMobPackage; // <-- admob 제거하고 firebase admob 추가
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- react native noti 추가
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- firebase notification 관련 추가
import cl.json.ShareApplication;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage; // <-- crashlytics


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

/**
* react-native-fbsdk 관련 추가
*/
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  /**
    * react-native-fbsdk 관련 추가
    */
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  /**
    * react-native-fbsdk 관련 추가
    */
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new RNSharePackage(),
            new RNViewShotPackage(),
            new ImagePickerPackage(),
            new RNFirebaseNotificationsPackage(), //<-- fireabse notification 추가
            //new ReactNativePushNotificationPackage(), // <---- react native noti 추가
            new RNFirebaseAdMobPackage(), // <-- admob 제거하고 firebase admob 추가
            new RNCameraPackage(),
            new SvgPackage(),
            //new PickerPackage(), // <-- crop-picker 제거
            new FastImageViewPackage(),
            new RNVersionCheckPackage(),
            new RNGoogleSigninPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new RNFirebasePackage(), // <-- firebase auth 관련 추가
            new RNFirebaseAuthPackage(),
            new RNFirebaseMessagingPackage(), // <-- firebase message 관련 추가
            new RNFirebaseStoragePackage(), // <-- firebase storage 관련 추가
            new RNFirebaseCrashlyticsPackage(), // <-- firebase carshlystic
            new FBSDKPackage(mCallbackManager)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    /**
     * react-native-fbsdk 관련 추가
     */
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
  }
}
