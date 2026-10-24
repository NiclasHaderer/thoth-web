package io.dewey.server.api

import io.dewey.models.Narrator
import io.dewey.models.NarratorDetailed
import io.dewey.models.PaginatedResponse
import io.dewey.openapi.ktor.get
import io.dewey.server.plugins.auth.deweyPrincipal
import io.dewey.server.repositories.NarratorRepository
import io.ktor.server.routing.Routing
import org.koin.ktor.ext.inject

fun Routing.narratorRouting() {
    val narratorRepository by inject<NarratorRepository>()

    get<Api.Libraries.Id.Narrators.All, PaginatedResponse<Narrator>> {
        PaginatedResponse(
            items = narratorRepository.getAll(it.libraryId, it.order.toSortOrder(), it.limit, it.offset),
            limit = it.limit,
            offset = it.offset,
            total = narratorRepository.total(it.libraryId),
        )
    }

    get<Api.Libraries.Id.Narrators.Name, NarratorDetailed> {
        narratorRepository.get(deweyPrincipal().userId, it.name, it.libraryId)
    }
}
