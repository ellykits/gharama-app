package com.dapaniapp.screens.expense

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class ExpenseDetailsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ExpenseDetailsModule"

    @ReactMethod
    fun displayExpenseDetails(readableMap: ReadableMap) {
        ExpenseDetailsActivity.reactContext = reactContext
        currentActivity?.startActivityForResult(
            Intent(currentActivity, ExpenseDetailsActivity::class.java).apply {
                Arguments.toBundle(readableMap)?.let { putExtras(it) }
            }, IMAGE_UPLOAD_REQ_CODE
        )
    }

    companion object {
        internal const val IMAGE_UPLOAD_REQ_CODE = 100
    }
}