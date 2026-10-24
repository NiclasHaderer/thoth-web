package io.dewey.openapi.ktor.schema

import io.dewey.openapi.common.ClassType
import io.ktor.http.ContentType
import io.swagger.v3.oas.models.media.DateSchema
import io.swagger.v3.oas.models.media.DateTimeSchema
import io.swagger.v3.oas.models.media.NumberSchema
import io.swagger.v3.oas.models.media.Schema
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.Date

class DateSchemaGenerator : SchemaGenerator() {
    override fun generateSchema(
        classType: ClassType,
        generateSubType: GenerateSchemaSubtype,
    ): Schema<*> =
        when (classType.clazz) {
            Date::class -> DateTimeSchema()
            LocalDate::class -> DateSchema()
            LocalDateTime::class -> DateTimeSchema()
            else -> NumberSchema()
        }

    override fun canGenerate(classType: ClassType): Boolean =
        classType.isSubclassOf(Date::class, LocalDate::class, LocalDateTime::class)

    override fun generateContentType(classType: ClassType): ContentType = ContentType.Text.Plain
}
