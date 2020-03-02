package com.dapaniapp.screens.expense

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.annotation.CallSuper
import com.dapaniapp.R
import com.dapaniapp.screens.expense.ExpenseDetailsModule.Companion.IMAGE_UPLOAD_REQ_CODE
import com.dapaniapp.utils.RNBrideUtil
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.github.dhaval2404.imagepicker.ImagePicker
import kotlinx.android.synthetic.main.activity_expense_details.*
import timber.log.Timber
import java.util.*

const val UPLOAD_IMAGE_EVENT = "UploadImageEvent"
const val POST_COMMENT_EVENT = "PostCommentEvent"

class ExpenseDetailsActivity : ReactActivity() {

    companion object {
        lateinit var reactContext: ReactContext
    }

    private var expenseIndex = -1
    private var expenseId: String? = null

    private val writableMap: WritableMap =
        Arguments.createMap().apply {
            putString("event_source", ExpenseDetailsActivity::class.java.simpleName)
            putString("timestamp", Date().toString())
            putString("expense_id", expenseId)
            putInt("expense_index", expenseIndex)
        }

    @CallSuper
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_expense_details)
        initViews()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val errorMessage = ImagePicker.getError(data)
        if (requestCode == IMAGE_UPLOAD_REQ_CODE) {
            when (resultCode) {
                Activity.RESULT_OK -> {
                    Timber.i("Path: ${ImagePicker.getFilePath(data)}")
                    val file = ImagePicker.getFile(data)!!.path
                    Toast.makeText(this, file, Toast.LENGTH_SHORT).show()
                    RNBrideUtil.sendEvent(
                        reactContext, UPLOAD_IMAGE_EVENT,
                        writableMap.copy().apply { putString("file_name", file) })
                }
                ImagePicker.RESULT_ERROR -> {
                    Timber.e("Error: $errorMessage")
                    Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
                    RNBrideUtil.sendEvent(
                        reactContext, POST_COMMENT_EVENT,
                        writableMap.copy().apply { putString("file_upload_error", errorMessage) })
                }
            }
        }
    }

    private fun initViews() {
        backTextView.setOnClickListener { finish() }
        photoImageView.setOnClickListener { pickImage() }

        with(intent) {
            expenseId = getStringExtra("id")
            expenseIndex = getDoubleExtra("index", -1.0).toInt()
            merchantTextView.text = getString(R.string.merchant, getStringExtra("merchant"))
            val category = getStringExtra("category")
            categoryTextView.text =
                if (category.isNullOrBlank()) getString(R.string.uncategorized) else category
            dateTextView.text = getStringExtra("date")
            commentTextTextView.text = getStringExtra("comment")
            val commentCount = if (getStringExtra("comment")!!.isEmpty()) 0 else 1
            commentTextView.apply { text = getString(R.string.comment, commentCount) }
            commentTextTextView.visibility = if (commentCount == 1) View.VISIBLE else View.GONE
            commentLabel.visibility = if (commentCount == 1) View.VISIBLE else View.GONE
            commentEditText.setText(getStringExtra("comment"))

            postTextView.setOnClickListener {
                RNBrideUtil.sendEvent(
                    reactContext, UPLOAD_IMAGE_EVENT,
                    writableMap.copy().apply {
                        putString("comment", commentEditText.text.toString())
                    })
            }
            getBundleExtra("user")?.let {
                val firstName = it.getString("first")
                val lastName = it.getString("last")
                val name = "$firstName $lastName"
                val initial = "${firstName?.first()}${lastName?.first()}"
                userTextView.text = name
                initialsTextView.text = initial
                emailTextView.text = it.getString("email")
            }

            getBundleExtra("amount")?.let {
                val value = it.getString("value")
                val currency = it.getString("currency")
                val amount = "$currency $value"
                amountTextView.text = amount
            }

            val receipts: List<String>? = getStringArrayListExtra("receipts")
            receiptTextView.apply { text = getString(R.string.receipt, receipts?.size ?: 0) }
        }
    }

    private fun pickImage() {
        ImagePicker.with(this).cropSquare().maxResultSize(1024, 720)
            .start(IMAGE_UPLOAD_REQ_CODE)
    }
}
