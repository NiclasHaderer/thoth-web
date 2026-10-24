package io.dewey.server.api

import io.dewey.models.Genre
import io.dewey.models.GenreDetailed
import io.dewey.models.PaginatedResponse
import io.dewey.openapi.ktor.get
import io.dewey.server.plugins.auth.deweyPrincipal
import io.dewey.server.repositories.GenreRepository
import io.ktor.server.routing.Routing
import org.koin.ktor.ext.inject

fun Routing.genreRouting() {
    val genreRepository by inject<GenreRepository>()

    get<Api.Libraries.Id.Genres.All, PaginatedResponse<Genre>> {
        PaginatedResponse(
            items = genreRepository.getAll(it.libraryId, it.order.toSortOrder(), it.limit, it.offset),
            limit = it.limit,
            offset = it.offset,
            total = genreRepository.total(it.libraryId),
        )
    }

    get<Api.Libraries.Id.Genres.Name, GenreDetailed> {
        genreRepository.get(
            deweyPrincipal().userId,
            it.name,
            it.libraryId,
        )
    }
}
