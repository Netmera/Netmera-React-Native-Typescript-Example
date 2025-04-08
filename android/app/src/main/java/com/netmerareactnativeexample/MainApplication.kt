package com.netmerareactnativeexample

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.netmera.reactnativesdk.RNNetmera
import com.netmera.reactnativesdk.RNNetmeraConfiguration

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages.toMutableList()
            packages.add(SharedPreferencesPackage())
            return packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }

        override val isNewArchEnabled: Boolean
            get() = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

        override val isHermesEnabled: Boolean
            get() = BuildConfig.IS_HERMES_ENABLED
    }

    override val reactNativeHost: ReactNativeHost
        get() = mReactNativeHost

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load()
        }

        val netmeraConfiguration = RNNetmeraConfiguration.Builder()
            .firebaseSenderId(BuildConfig.FIREBASE_SENDER_ID)
            .huaweiSenderId(BuildConfig.HMS_SENDER_ID)
            .apiKey(SharedPreferencesModule.getApiKey(this))
            .baseUrl(SharedPreferencesModule.getBaseUrl(this))
            .logging(true) // This is for enabling Netmera logs.
            .build(this)

        RNNetmera.initNetmera(netmeraConfiguration)
    }
}
