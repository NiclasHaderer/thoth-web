package io.dewey.server.api

import io.dewey.metadata.responses.MetadataRegion

data class MetadataAgentApiModel(
    val name: String,
    val supportedRegions: List<MetadataRegion>,
)
