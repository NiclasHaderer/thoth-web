package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.dewey.openapi.common.Patch
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.ObjectSchema
import io.swagger.v3.oas.models.media.Schema

class PatchSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> {
        if (classType.genericArguments.isEmpty()) {
            log.warn { "Could not resolve generic argument for patch" }
            return ObjectSchema()
        }
        return generateSubType(classType.genericArguments[0]).reference()
    }

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(Patch::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Application.Json
}
