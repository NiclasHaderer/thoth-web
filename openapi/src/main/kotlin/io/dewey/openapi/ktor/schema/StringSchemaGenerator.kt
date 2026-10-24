package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.Schema
import io.swagger.v3.oas.models.media.StringSchema

class StringSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> = StringSchema()

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(String::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Text.Plain
}
