package io.dewey.server.schedules

import io.dewey.server.common.scheduling.CronTask
import io.dewey.server.common.scheduling.EventTask
import io.dewey.server.config.DeweyConfig
import io.dewey.server.database.tables.LibraryTable
import io.dewey.server.file.scanner.LibraryImportPipeline
import io.dewey.server.file.scanner.ScanRequest
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class DeweySchedules : KoinComponent {
    private val config by inject<DeweyConfig>()
    private val pipeline: LibraryImportPipeline by inject()

    val fullScan =
        CronTask(
            "Full scan",
            config.fullScanCron,
            callback = {
                val libraries =
                    transaction { LibraryTable.select(LibraryTable.id).map { it[LibraryTable.id].value } }
                libraries.forEach { pipeline.scanLibrary(it) }
            },
        )
    val scanLibrary =
        EventTask<ScanRequest>(
            "Scan library",
            callback = { pipeline.scanLibrary(it.data.libraryId, it.data.reanalyze) },
        )
}
