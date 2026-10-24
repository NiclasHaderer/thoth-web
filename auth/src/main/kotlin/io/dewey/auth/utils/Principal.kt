package io.dewey.auth.utils

import io.dewey.openapi.ktor.errors.ErrorResponse
import io.ktor.server.auth.Principal
import io.ktor.server.auth.principal
import io.ktor.server.routing.RoutingContext
import java.util.UUID

interface DeweyPrincipal : Principal {
    val userId: UUID
}

inline fun <reified TYPE : DeweyPrincipal> RoutingContext.deweyPrincipal(): TYPE =
    call.principal()
        ?: throw ErrorResponse.internalError(
            "Route requires user to be logged in, but authentication was not required. Please check your configuration.",
        )
