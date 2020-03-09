package com.dapaniapp.screens.receipts

import android.content.Intent
import androidx.lifecycle.ViewModelProvider
import com.dapaniapp.BuildConfig
import com.dapaniapp.MainApplication
import com.dapaniapp.R
import com.dapaniapp.screens.expense.RECEIPTS
import com.dapaniapp.screens.expense.showToast
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.util.*

class ReceiptsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val receiptViewModel by lazy {
        ViewModelProvider(currentActivity?.application as MainApplication).get(ReceiptViewModel::class.java)
    }

    override fun getName() = ReceiptsModule::class.java.simpleName

    @ReactMethod
    fun displayReceipts(readableMap: ReadableMap) {
        receiptViewModel.receiptList.value?.also {
            it.clear()
            it.addAll(readableMap.retrieveReceiptFilePaths())
        }
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

/**Extension functions **/
fun ReadableMap.retrieveReceiptFilePaths() =
    ArrayList<String>().apply {
        this@retrieveReceiptFilePaths.getArray(RECEIPTS)?.toArrayList()
            ?.map { it as HashMap<*, *> }
            ?.forEach { item ->
                val filePath =
                    BuildConfig.EXPENSES_BASE_URL.plus((item["url"] as String).substring(1))
                add(filePath)
            }
    }