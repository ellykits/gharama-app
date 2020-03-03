package com.dapaniapp.data

import com.dapaniapp.BuildConfig
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/***
 * This object is used for configuring retrofit
 */
object RetrofitServiceBuilder {

    private val client = OkHttpClient.Builder().build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.EXPENSES_BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(client)
        .build()

    /***
     * Used to create instances of [service] to make them usable
     */
    fun <T> buildService(service: Class<T>): T {
        return retrofit.create(service)
    }
}