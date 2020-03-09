package com.dapaniapp.screens.receipts

import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.dapaniapp.MainApplication
import com.dapaniapp.R
import com.dapaniapp.screens.expense.MERCHANT
import com.squareup.picasso.Picasso
import com.stfalcon.imageviewer.StfalconImageViewer
import kotlinx.android.synthetic.main.activity_receipts.*
import java.util.*

class ReceiptsActivity : AppCompatActivity() {

    private lateinit var receiptViewer: StfalconImageViewer<String>

    private val receiptImageUrlList = arrayListOf<String>()

    private val receiptViewModel: ReceiptViewModel by lazy {
        ViewModelProvider(this.application as MainApplication).get(ReceiptViewModel::class.java)
    }

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
    }

    override fun onResume() {
        super.onResume()
        receiptViewModel.receiptList.observe(this,
            Observer<ArrayList<String>> { receipts ->
                receiptImageUrlList.addAll(receipts)
                createImageViews(receipts)
            })
    }

    private fun createImageViews(receipts: ArrayList<String>) {
        if (receipts.isEmpty()) {
            infoLabel.apply {
                text = getString(R.string.no_receipts)
                setCompoundDrawables(null, null, null, null)
            }
            return
        }
        imagesLinearLayout.removeAllViews()
        receipts.reversed().forEachIndexed { index, _ ->
            imagesLinearLayout.apply {
                addView(ImageView(this@ReceiptsActivity).apply {
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