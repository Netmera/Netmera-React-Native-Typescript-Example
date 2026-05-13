///
/// Copyright (c) 2026 Netmera Research.
///

package com.netmera.demo.reactnative.config

enum class NetmeraEnvironment(
    val key: String,
    val url: String,
    val defaultApiKey: String
) {
    TEST(
        "test",
        "https://sdk-cloud-test.sdpaas.com",
        "gFtyH_nz5WDqpkkpQX-3Qn4e8xbxuQroQ1BwUItYPzdGiPjlHM-_eKeoG4wr2GHFvp0KoCf-8ts"
    ),
    PREPROD(
        "preprod",
        "https://sdk-cloud-uat.sdpaas.com",
        "gFtyH_nz5WDqpkkpQX-3Qn4e8xbxuQronOkkqhUjXw50my32OqV7lQlSPYMqNhYWGXQxPbXLLKQ"
    ),
    PROD(
        "prod",
        "https://sdkapi.netmera.com",
        "gFtyH_nz5WAWBrHDHVZGclG4W_qB0XRba1aqIfXpmXLuZtIs4D_CU0iIL-uUs-aw"
    ),
    CUSTOM("custom", "", "");

    val displayName: String
        get() = when (this) {
            TEST -> "Test"
            PREPROD -> "Pre-prod"
            PROD -> "Prod"
            CUSTOM -> "Custom"
        }

    companion object {
        fun fromKey(key: String?): NetmeraEnvironment =
            entries.find { it.key == key } ?: PROD
    }
}