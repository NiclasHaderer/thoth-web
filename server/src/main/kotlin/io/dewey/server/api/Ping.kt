package io.dewey.server.api

import io.dewey.openapi.ktor.post
import io.ktor.server.routing.Routing

fun Routing.pingRouting() {
    post<Api.Ping, Unit, Unit> { _, _ -> }
}
