package com.dapaniapp.data

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Path

/**
 * This class handles expense data
 */
interface ExpenseDataService {

    /**
     * Posts the given comment wrapped in the provided [expense] data class
     */
    @POST("/expenses/{id}")
    fun postComment(@Path("id") id: String, @Body expense: Expense): Call<Expense>
}