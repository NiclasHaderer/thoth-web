package io.dewey.auth.models

open class DeweyJwtPair(
    open val accessToken: String,
    open val refreshToken: String,
)
