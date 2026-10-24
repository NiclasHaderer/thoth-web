package io.dewey.auth.interactions

import io.dewey.auth.deweyAuthConfig
import io.dewey.auth.models.DeweyAccessToken
import io.dewey.auth.models.DeweyLoginUser
import io.dewey.auth.utils.generateJwtPairForUser
import io.dewey.auth.utils.passwordMatches
import io.dewey.openapi.ktor.errors.ErrorResponse
import io.ktor.server.routing.RoutingContext

interface DeweyLoginParams

fun RoutingContext.loginUser(
    params: DeweyLoginParams,
    loginUser: DeweyLoginUser,
): DeweyAccessToken {
    val config = deweyAuthConfig<Any, Any>()

    // Never reveal whether the username or the password was wrong
    val user = config.getUserByUsername(loginUser.username) ?: throw ErrorResponse.userError("Could not login user")

    if (!passwordMatches(loginUser.password, user)) {
        throw ErrorResponse.userError("Could not login user")
    }

    val keyPair = generateJwtPairForUser(user, config)
    call.appendAuthCookies(keyPair, config)

    return DeweyAccessToken(keyPair.accessToken)
}
