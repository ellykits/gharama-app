package com.dapaniapp.nativemodules.imagepicker

import android.app.Activity
import android.content.Intent
import android.widget.Toast
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.github.dhaval2404.imagepicker.ImagePicker
import timber.log.Timber

class ImagePickerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var imagePickerPromise: Promise? = null

    enum class ImagePickerErrors {
        IMAGE_PICKER_ERROR,
        TASK_CANCELED
    }

    private inner class ActivityEventListener : BaseActivityEventListener() {
        override fun onActivityResult(
            activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?
        ) {
            super.onActivityResult(activity, requestCode, resultCode, data)
            val errorMessage = ImagePicker.getError(data)
            val writableMap = WritableNativeMap().apply {
                putString("class", ImagePickerModule::javaClass.name)
            }
            when (resultCode) {
                Activity.RESULT_OK -> {
                    imagePickerPromise?.also {
                        Timber.i("Path: ${ImagePicker.getFilePath(data)}")
                        val file = ImagePicker.getFile(data)!!
                        if (requestCode == IMG_REQ_CODE) {
                            it.resolve(file.path)
                        }
                    }
                }
                ImagePicker.RESULT_ERROR -> {
                    Toast.makeText(activity, errorMessage, Toast.LENGTH_SHORT).show()
                    Timber.e("Error: $errorMessage")
                    imagePickerPromise?.reject(
                        ImagePickerErrors.IMAGE_PICKER_ERROR.name, errorMessage, writableMap
                    )
                }
                else -> {
                    Toast.makeText(activity, "Operation canceled", Toast.LENGTH_SHORT).show()
                    Timber.e("Error: $errorMessage")
                    imagePickerPromise?.reject(
                        ImagePickerErrors.TASK_CANCELED.name, errorMessage, writableMap
                    )
                }
            }
            imagePickerPromise = null
        }
    }

    init {
        reactContext.addActivityEventListener(ActivityEventListener())
    }

    override fun getName(): String {
        return "ImagePickerModule"
    }

    companion object {
        private const val IMG_REQ_CODE = 101
    }

    @ReactMethod
    fun pickImage(promise: Promise) {
        imagePickerPromise = promise
        currentActivity?.also {
            ImagePicker.with(it)
                .cropSquare()
                .maxResultSize(1024, 720)
                .start(IMG_REQ_CODE)
        }
    }
}