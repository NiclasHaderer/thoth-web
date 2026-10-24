package io.dewey.server.plugins

import com.fasterxml.jackson.databind.ObjectMapper
import io.dewey.server.di.serialization.JacksonSerialization
import io.ktor.http.ContentType
import io.ktor.serialization.jackson.JacksonConverter
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import org.koin.ktor.ext.get

fun Application.configureSerialization(): ObjectMapper {
    val mapper = get<JacksonSerialization>().objectMapper

    install(ContentNegotiation) { register(ContentType.Application.Json, JacksonConverter(mapper)) }

    return mapper
}
