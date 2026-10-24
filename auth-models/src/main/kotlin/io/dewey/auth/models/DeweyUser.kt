package io.dewey.auth.models

import java.util.UUID

// User models which will be returned by the auth api

open class DeweyUser(
    open val id: UUID,
    open val username: String,
)

open class DeweyUserWithPermissions<PERMISSIONS : Any>(
    open val id: UUID,
    open val username: String,
    open val permissions: PERMISSIONS,
)
