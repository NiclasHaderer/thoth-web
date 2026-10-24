package io.dewey.auth.interactions

import io.dewey.auth.deweyAuthConfig
import io.ktor.server.routing.RoutingContext

interface DeweyLogoutParams

fun RoutingContext.logoutUser(
    params: DeweyLogoutParams,
    body: Unit,
) {
    call.clearAuthCookies(deweyAuthConfig<Any, Any>())
}
