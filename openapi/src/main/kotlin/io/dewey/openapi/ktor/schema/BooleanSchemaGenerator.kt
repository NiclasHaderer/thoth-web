package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.BooleanSchema
import io.swagger.v3.oas.models.media.Schema

class BooleanSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> = BooleanSchema()

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(Boolean::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Text.Plain
}
