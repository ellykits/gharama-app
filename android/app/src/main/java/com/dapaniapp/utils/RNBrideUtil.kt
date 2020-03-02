package com.dapaniapp.utils

import androidx.annotation.Nullable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

object RNBrideUtil {
    fun sendEvent(reactContext: ReactContext, eventName: String, @Nullable params: WritableMap) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}