package io.thoth.models

import java.util.UUID

data class User(
    val id: UUID,
    val username: String,
    val admin: Boolean,
)
