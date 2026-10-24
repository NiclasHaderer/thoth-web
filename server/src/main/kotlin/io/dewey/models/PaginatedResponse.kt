package io.dewey.models

data class PaginatedResponse<T>(
    val items: List<T>,
    val total: Long,
    val offset: Long,
    val limit: Int,
)
