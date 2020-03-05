package com.dapaniapp.screens.receipts

import android.content.Intent
import com.dapaniapp.R
import com.dapaniapp.screens.expense.showToast
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class ReceiptsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = ReceiptsModule::class.java.simpleName

    @ReactMethod
    fun displayReceipts(readableMap: ReadableMap) {
        currentActivity?.startActivity(
            Intent(currentActivity, ReceiptsActivity::class.java).apply {
                Arguments.toBundle(readableMap)?.let { putExtras(it) }
            }
        )
    }

    @ReactMethod
    fun showToastMessage(isSuccessful: Boolean) {
        currentActivity?.also {
            it.showToast(
                if (isSuccessful) it.getString(R.string.uploading_receipt_successful) else it.getString(
                    R.string.error_uploading_receipt
                )
            )
        }
    }
}