package io.dewey.auth.models

enum class DeweyJwtTypes(
    val type: String,
) {
    Access("access"),
    Refresh("refresh"),
}
