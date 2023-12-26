package com.netmeratsexample;

import com.facebook.soloader.SoLoader;
import com.netmera.reactnativesdk.RNNetmera;
import com.netmera.reactnativesdk.RNNetmeraConfiguration;
import com.netmeratsexample.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };


        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };
  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);

      RNNetmeraConfiguration netmeraConfiguration = new RNNetmeraConfiguration.Builder()
              .firebaseSenderId(BuildConfig.FIREBASE_SENDER_ID) // Replace this with your own FIREBASE SENDER ID.
              .apiKey(BuildConfig.NETMERA_API_KEY) // Replace this with your own NETMERA API KEY.
              .huaweiSenderId(BuildConfig.HMS_SENDER_ID) // Replace this with your own HMS SENDER ID.
              .logging(true)
              .build(this);
      RNNetmera.initNetmera(netmeraConfiguration);
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
          }
          ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
