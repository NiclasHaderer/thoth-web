package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.dewey.openapi.ktor.responses.RedirectResponse
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.Schema
import io.swagger.v3.oas.models.media.StringSchema

class RedirectSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> = StringSchema()

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(RedirectResponse::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Text.Plain
}
