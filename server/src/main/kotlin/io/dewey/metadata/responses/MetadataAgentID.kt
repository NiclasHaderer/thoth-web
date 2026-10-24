package io.dewey.metadata.responses

interface MetadataAgentID {
    val provider: String
    val itemID: String
}

data class MetadataAgentIDImpl(
    override val provider: String,
    override val itemID: String,
) : MetadataAgentID
