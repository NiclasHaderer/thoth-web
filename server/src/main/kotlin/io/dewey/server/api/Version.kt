package io.dewey.server.api

import io.dewey.models.ApiVersion
import io.dewey.openapi.ktor.get
import io.dewey.openapi.ktor.plugins.OpenAPIConfigurationKey
import io.ktor.server.routing.Routing

fun Routing.versionRouting() {
    get<Api.Version, ApiVersion> { ApiVersion(call.application.attributes[OpenAPIConfigurationKey].apiVersion) }
}
