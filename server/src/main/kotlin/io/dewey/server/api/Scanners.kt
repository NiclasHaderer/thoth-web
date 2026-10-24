package io.dewey.server.api

import io.dewey.models.FileScanner
import io.dewey.openapi.ktor.get
import io.dewey.server.file.analyzer.AudioFileAnalyzers
import io.ktor.server.routing.Routing
import org.koin.ktor.ext.inject

fun Routing.scannerRouting() {
    val scanners by inject<AudioFileAnalyzers>()
    get<Api.Scanners, List<FileScanner>> { scanners.map { FileScanner(it.name) } }
}
