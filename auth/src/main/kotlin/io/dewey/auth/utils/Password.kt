package io.dewey.auth.utils

import io.dewey.auth.models.DeweyDatabaseUser
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder

internal fun passwordMatches(
    password: String,
    user: DeweyDatabaseUser,
): Boolean {
    val encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
    return encoder.matches(password, user.passwordHash)
}

internal fun hashPassword(password: String): String {
    val encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
    return encoder.encode(password)!!
}
