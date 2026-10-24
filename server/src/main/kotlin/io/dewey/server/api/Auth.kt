package io.dewey.server.api

import io.dewey.auth.interactions.changeUserPassword
import io.dewey.auth.interactions.currentUser
import io.dewey.auth.interactions.deleteUser
import io.dewey.auth.interactions.displayUser
import io.dewey.auth.interactions.getJwks
import io.dewey.auth.interactions.listUsers
import io.dewey.auth.interactions.loginUser
import io.dewey.auth.interactions.logoutUser
import io.dewey.auth.interactions.modifyUserPermissions
import io.dewey.auth.interactions.refreshAccessToken
import io.dewey.auth.interactions.registerUser
import io.dewey.auth.interactions.renameUser
import io.dewey.auth.models.DeweyAccessToken
import io.dewey.auth.models.DeweyChangePassword
import io.dewey.auth.models.DeweyJWKs
import io.dewey.auth.models.DeweyLoginUser
import io.dewey.auth.models.DeweyModifyPermissions
import io.dewey.auth.models.DeweyRegisterUser
import io.dewey.auth.models.DeweyRenameUser
import io.dewey.auth.models.DeweyUser
import io.dewey.auth.models.DeweyUserWithPermissions
import io.dewey.models.UpdateUserPermissions
import io.dewey.models.UserPermissions
import io.dewey.openapi.ktor.delete
import io.dewey.openapi.ktor.get
import io.dewey.openapi.ktor.post
import io.dewey.openapi.ktor.put
import io.ktor.server.routing.Routing
import io.ktor.server.routing.RoutingContext
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

fun Routing.authRoutes() {
    post<Api.Auth.Login, DeweyLoginUser, DeweyAccessToken>(RoutingContext::loginUser)

    post<Api.Auth.Logout, Unit, Unit>(RoutingContext::logoutUser)

    post<Api.Auth.Register, DeweyRegisterUser, DeweyUser> { params, body ->
        registerLock.withLock { registerUser(params, body) }
    }

    get<Api.Auth.Jwks, DeweyJWKs>(RoutingContext::getJwks)

    put<Api.Auth.User.Id.Permissions, DeweyModifyPermissions<UpdateUserPermissions>, DeweyUser>(
        withTransaction(RoutingContext::modifyUserPermissions),
    )

    get<Api.Auth.User.Id, DeweyUser>(withTransaction(RoutingContext::displayUser))

    get<Api.Auth.User.Current, DeweyUserWithPermissions<UserPermissions>>(
        withTransaction(RoutingContext::currentUser),
    )

    get<Api.Auth.User.All, List<DeweyUserWithPermissions<UserPermissions>>>(
        withTransaction(RoutingContext::listUsers),
    )

    delete<Api.Auth.User.Id, Unit, Unit>(withTransaction(RoutingContext::deleteUser))

    post<Api.Auth.User.Id.Username, DeweyRenameUser, DeweyUser>(withTransaction(RoutingContext::renameUser))

    post<Api.Auth.User.Id.Password, DeweyChangePassword, Unit>(RoutingContext::changeUserPassword)

    post<Api.Auth.User.Refresh, Unit, DeweyAccessToken>(withTransaction(RoutingContext::refreshAccessToken))
}

// Serializes concurrent registrations so the "first user becomes admin" check-then-insert can't race
// (two signups on an empty DB both seeing zero users). In-process lock: fine for a single app instance.
private val registerLock = ReentrantLock()

private fun <P1, P2, R> withTransaction(
    func: RoutingContext.(p1: P1, p2: P2) -> R,
): suspend RoutingContext.(P1, P2) -> R =
    { a, b ->
        transaction {
            func(a, b)
        }
    }

private fun <P1, R> withTransaction(func: RoutingContext.(p1: P1) -> R): suspend RoutingContext.(P1) -> R =
    { a ->
        transaction {
            func(a)
        }
    }
