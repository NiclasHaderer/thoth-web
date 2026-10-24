package io.dewey.server.repositories

import io.dewey.models.Narrator
import io.dewey.models.NarratorDetailed
import io.dewey.openapi.ktor.errors.ErrorResponse
import io.dewey.server.database.rows.bookGroupCount
import io.dewey.server.database.rows.bookGroups
import io.dewey.server.database.rows.booksInGroup
import io.dewey.server.database.rows.booksToModels
import io.dewey.server.database.tables.BookTable
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import java.util.UUID

interface NarratorRepository {
    fun getAll(
        libraryId: UUID,
        order: SortOrder,
        limit: Int = 20,
        offset: Long = 0L,
    ): List<Narrator>

    fun get(
        userId: UUID,
        name: String,
        libraryId: UUID,
    ): NarratorDetailed

    fun total(libraryId: UUID): Long
}

class NarratorRepositoryImpl : NarratorRepository {
    override fun getAll(
        libraryId: UUID,
        order: SortOrder,
        limit: Int,
        offset: Long,
    ): List<Narrator> =
        transaction {
            BookTable.narrators
                .bookGroups(libraryId, order, limit, offset)
                .map { Narrator(name = it.name, bookCount = it.bookCount) }
        }

    override fun get(
        userId: UUID,
        name: String,
        libraryId: UUID,
    ): NarratorDetailed =
        transaction {
            val match =
                BookTable.narrators.booksInGroup(name, libraryId)
                    ?: throw ErrorResponse.notFound("Narrator", name)
            NarratorDetailed(name = match.name, books = booksToModels(match.books, userId))
        }

    override fun total(libraryId: UUID): Long = transaction { BookTable.narrators.bookGroupCount(libraryId) }
}
