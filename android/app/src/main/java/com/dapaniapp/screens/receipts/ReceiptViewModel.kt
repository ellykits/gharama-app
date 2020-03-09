package com.dapaniapp.screens.receipts

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ReceiptViewModel : ViewModel() {
    val receiptList by lazy {
        MutableLiveData<ArrayList<String>>().also {
             Handler(Looper.getMainLooper()).post {
                 it.value = arrayListOf()
             }
        }
    }
}