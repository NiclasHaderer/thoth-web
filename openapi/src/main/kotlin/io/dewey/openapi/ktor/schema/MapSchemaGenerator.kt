package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.ObjectSchema
import io.swagger.v3.oas.models.media.Schema

class MapSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> =
        ObjectSchema().also {
            if (classType.genericArguments.size == 2) {
                val subSchema = generateSubType(classType.genericArguments[1])
                it.additionalProperties = subSchema
            } else {
                log.warn { "Could not resolve generic argument for map" }
            }
        }

    override fun canGenerate(classType: ClassType): Boolean =
        classType.isSubclassOf(Map::class, HashMap::class, LinkedHashMap::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Application.Json
}
