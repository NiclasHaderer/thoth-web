package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.ArraySchema
import io.swagger.v3.oas.models.media.Schema

class PairSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> =
        ArraySchema().also { schema ->
            val subSchema = classType.genericArguments.map(generateSubType)
            schema.prefixItems = subSchema.map { it.reference() }
        }

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(Pair::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Application.Json
}
