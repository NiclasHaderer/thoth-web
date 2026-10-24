package io.dewey.server.api

import io.dewey.metadata.MetadataAgents
import io.dewey.openapi.ktor.get
import io.ktor.server.routing.Routing
import org.koin.ktor.ext.inject

fun Routing.metadataAgentRouting() {
    val scanners by inject<MetadataAgents>()
    get<Api.MetadataAgents, List<MetadataAgentApiModel>> {
        scanners.map { MetadataAgentApiModel(it.name, it.supportedRegions) }
    }
}
