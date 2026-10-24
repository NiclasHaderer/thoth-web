package io.dewey.auth.models

open class DeweyChangePassword(
    open val currentPassword: String,
    open val newPassword: String,
)
