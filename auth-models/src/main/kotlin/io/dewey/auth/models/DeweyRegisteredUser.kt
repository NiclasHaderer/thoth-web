package io.dewey.auth.models

open class DeweyRegisteredUser(
    open val username: String,
    open val passwordHash: String,
    open val admin: Boolean,
)
