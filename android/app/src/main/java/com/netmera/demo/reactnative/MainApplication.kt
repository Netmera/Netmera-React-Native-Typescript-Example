package com.netmera.demo.reactnative

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

import com.netmera.demo.reactnative.config.NetmeraConfigProvider
import com.netmera.reactnativesdk.RNNetmera
import com.netmera.reactnativesdk.RNNetmeraConfiguration

class MainApplication : Application(), ReactApplication {

    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // add(MyReactNativePackage())
                },
        )
    }

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)

        val (apiKey, baseUrl) = NetmeraConfigProvider.configFromPreferences(this)

        val netmeraConfiguration = RNNetmeraConfiguration.Builder()
            .firebaseSenderId(BuildConfig.FIREBASE_SENDER_ID)
            .huaweiSenderId(BuildConfig.HMS_SENDER_ID)
            .apiKey(apiKey)
            .baseUrl(baseUrl)
            .logging(true)
            .build(this)

        RNNetmera.initNetmera(netmeraConfiguration)
    }
}
