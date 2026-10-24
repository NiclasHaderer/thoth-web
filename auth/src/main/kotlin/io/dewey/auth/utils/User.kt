package io.dewey.auth.utils

import io.dewey.auth.models.DeweyDatabaseUser
import io.dewey.auth.models.DeweyUser

fun DeweyDatabaseUser.wrap(): DeweyUser = DeweyUser(id = this.id, username = this.username)
