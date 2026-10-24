package io.dewey.models

data class Narrator(
    val name: String,
    val bookCount: Int,
)

data class NarratorDetailed(
    val name: String,
    val books: List<Book>,
)
