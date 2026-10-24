package io.dewey.auth.models

import java.util.UUID

// The Internal database model of the user, intentionally does not extend from DeweyUser, so the
// internal database user cannot be accidentally leaked by returning it instead of the DeweyUser

open class DeweyDatabaseUser(
    open val id: UUID,
    open val username: String,
    open val passwordHash: String,
    open val tokenVersion: Int,
)
