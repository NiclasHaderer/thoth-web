package io.dewey.server.api

import io.dewey.models.Book
import io.dewey.models.ListeningHistoryEntry
import io.dewey.models.PaginatedResponse
import io.dewey.openapi.ktor.get
import io.dewey.openapi.ktor.put
import io.dewey.server.plugins.auth.deweyPrincipal
import io.dewey.server.repositories.ProgressRepository
import io.ktor.server.routing.Routing
import org.koin.ktor.ext.inject

fun Routing.progressRouting() {
    val progressRepository by inject<ProgressRepository>()

    put<Api.Libraries.Id.Books.Id.Progress, ProgressUpdate, Unit> { route, body ->
        progressRepository.upsert(deweyPrincipal().userId, route.libraryId, route.id, body.positionMs)
    }

    put<Api.Libraries.Id.Books.Id.Progress.Finished, SetFinished, Unit> { route, body ->
        progressRepository.setFinished(deweyPrincipal().userId, route.libraryId, route.id, body.finished)
    }

    put<Api.Libraries.Id.Books.Id.Progress.Dismissed, SetDismissed, Unit> { route, body ->
        progressRepository.setDismissed(deweyPrincipal().userId, route.libraryId, route.id, body.dismissed)
    }

    // Cross-library on purpose
    get<Api.Me.ContinueListening, List<Book>> { route ->
        progressRepository.continueListening(deweyPrincipal().userId, route.limit)
    }

    get<Api.Me.History, PaginatedResponse<ListeningHistoryEntry>> { route ->
        val userId = deweyPrincipal().userId
        PaginatedResponse(
            items = progressRepository.history(userId, route.limit, route.offset),
            total = progressRepository.historyTotal(userId),
            limit = route.limit,
            offset = route.offset,
        )
    }
}
