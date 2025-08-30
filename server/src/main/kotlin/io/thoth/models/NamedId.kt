package io.thoth.models

import java.util.UUID

data class NamedId(
    val id: UUID,
    val name: String,
)
