package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.dewey.openapi.ktor.responses.BinaryResponse
import io.dewey.openapi.ktor.responses.FileResponse
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.Schema
import io.swagger.v3.oas.models.media.StringSchema

class FileSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> = StringSchema().format("binary")

    override fun canGenerate(classType: ClassType): Boolean =
        classType.isSubclassOf(FileResponse::class, BinaryResponse::class, ByteArray::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Application.OctetStream
}
