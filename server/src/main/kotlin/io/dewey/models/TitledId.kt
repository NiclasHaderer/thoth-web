package io.dewey.models

import java.util.UUID

data class TitledId(
    val id: UUID,
    val title: String,
)
