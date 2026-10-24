package io.dewey.models

data class UserPermissions(
    val isAdmin: Boolean,
    val libraries: List<LibraryPermissions>,
)
