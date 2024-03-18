package com.netmerareactnativeexample;

import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {
    private static SharedPreferences sharedPreferences;

    private static String KEY_API_KEY = "apiKey";
    private static String KEY_BASE_URL = "baseUrl";

    public SharedPreferencesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        sharedPreferences = reactContext.getSharedPreferences("NetmeraPreferences", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "SharedPreferencesModule";
    }

    @ReactMethod
    public void setApiKey(String apiKey) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(KEY_API_KEY, apiKey);
        editor.apply();
    }

    @ReactMethod
    public void setBaseUrl(String url) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(KEY_BASE_URL, url);
        editor.apply();
    }

    @ReactMethod
    public void getApiKey(Promise promise) {
        promise.resolve(sharedPreferences.getString(KEY_API_KEY, ""));
    }

    @ReactMethod
    public void getBaseUrl(Promise promise) {
        promise.resolve(sharedPreferences.getString(KEY_BASE_URL, ""));
    }

    public static String getBaseUrl(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("NetmeraPreferences", Context.MODE_PRIVATE);
        return sharedPreferences.getString(KEY_BASE_URL, BuildConfig.NETMERA_PREPROD_BASE_URL);
    }

    public static String getApiKey(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("NetmeraPreferences", Context.MODE_PRIVATE);
        return sharedPreferences.getString(KEY_API_KEY, BuildConfig.NETMERA_PREPROD_API_KEY);
    }
}
