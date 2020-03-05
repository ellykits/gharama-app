package com.dapaniapp.screens.receipts

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.dapaniapp.BuildConfig
import com.dapaniapp.R
import com.dapaniapp.screens.expense.RECEIPTS
import com.squareup.picasso.Picasso
import com.stfalcon.imageviewer.StfalconImageViewer
import kotlinx.android.synthetic.main.activity_receipts.*
import java.util.*

const val MERCHANT = "merchant"

class ReceiptsActivity : AppCompatActivity() {

    private lateinit var receiptViewer: StfalconImageViewer<String>

    private val receiptImageUrlList = arrayListOf<String>()

    @ExperimentalStdlibApi
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receipts)

        backToDetailsTextView.apply {
            val merchant = intent?.getStringExtra(MERCHANT) ?: ""
            text = getString(
                R.string.back_to_details,
                merchant.toLowerCase(Locale.getDefault()).capitalize(Locale.getDefault()).trim()
            )
            setOnClickListener { finish() }
        }

        intent.mapReceiptObjectToString(receiptImageUrlList)

        if (receiptImageUrlList.isEmpty()) {
            infoLabel.apply {
                text = getString(R.string.no_receipts)
                setCompoundDrawables(null, null, null, null)
            }
        }
        //Create dynamic image vies and add to list
        receiptImageUrlList.forEachIndexed { index, _ ->
            imagesLinearLayout.addView(ImageView(this).apply {
                adjustViewBounds = true
                scaleType = ImageView.ScaleType.CENTER_CROP
                loadImage(receiptImageUrlList.getOrNull(index))
                setOnClickListener {
                    receiptViewer = displayReceiptImage(index).also {
                        it.withTransitionFrom(this)
                        it.withImageChangeListener {
                            receiptViewer.updateTransitionImage(this)
                        }
                    }.show()
                }
            })
        }
    }

    private fun displayReceiptImage(startPosition: Int): StfalconImageViewer.Builder<String> {
        return StfalconImageViewer.Builder<String>(this, receiptImageUrlList, ImageView::loadImage)
            .withHiddenStatusBar(true)
            .allowZooming(true)
            .allowSwipeToDismiss(true)
            .withStartPosition(startPosition)
    }
}

/**Extension functions**/
fun ImageView.loadImage(url: String?) {
    this.apply {
        Picasso.get().load(url).into(this)
    }
}

fun Intent.mapReceiptObjectToString(receipts: ArrayList<String>) {
    extras?.getParcelableArrayList<Bundle>(RECEIPTS)?.forEach { parcelableBundle ->
        parcelableBundle.getString("url")?.let {
            val filePath = BuildConfig.EXPENSES_BASE_URL.plus(it.substring(1))
            receipts.add(filePath)
        }
    }
}