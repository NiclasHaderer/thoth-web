package io.dewey.auth.interactions

import io.dewey.auth.deweyAuthConfig
import io.dewey.auth.models.DeweyRegisterUser
import io.dewey.auth.models.DeweyRegisteredUser
import io.dewey.auth.models.DeweyUser
import io.dewey.auth.utils.hashPassword
import io.dewey.auth.utils.wrap
import io.dewey.auth.withUserMutation
import io.dewey.openapi.ktor.errors.ErrorResponse
import io.ktor.server.routing.RoutingContext

interface DeweyRegisterParams

fun RoutingContext.registerUser(
    params: DeweyRegisterParams,
    user: DeweyRegisterUser,
): DeweyUser {
    val config = deweyAuthConfig<Any, Any>()

    if (!config.allowNewSignups()) {
        throw ErrorResponse.userError("New signups are not allowed")
    }

    config.passwordMeetsRequirements(user.password).also { (meetsRequirement, message) ->
        if (!meetsRequirement) {
            throw ErrorResponse.userError(message!!)
        }
    }

    config.usernameMeetsRequirements(user.username).also { (meetsRequirement, message) ->
        if (!meetsRequirement) {
            throw ErrorResponse.userError(message!!)
        }
    }

    val passwordHash = hashPassword(user.password)

    return withUserMutation {
        val isAdmin = config.firstUserIsAdmin && config.isFirstUser()
        config
            .createUser(DeweyRegisteredUser(username = user.username, passwordHash = passwordHash, admin = isAdmin))
            .wrap()
    }
}
