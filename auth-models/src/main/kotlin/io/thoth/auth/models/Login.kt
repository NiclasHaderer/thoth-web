package io.thoth.auth.models

interface ThothLoginUser {
    val username: String
    val password: String
}

data class ThothLoginUserImpl(
    override val username: String,
    override val password: String,
) : ThothLoginUser
