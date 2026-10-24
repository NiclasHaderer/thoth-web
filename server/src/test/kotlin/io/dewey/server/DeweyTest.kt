package io.dewey.server

import com.zaxxer.hikari.HikariDataSource
import io.dewey.server.config.DeweyConfig
import io.dewey.server.database.DatabaseConnector
import io.dewey.server.database.migrations.DatabaseMigrator
import io.dewey.server.database.sqliteDataSource
import io.dewey.server.di.deweyModule
import io.dewey.server.file.scanner.LibraryImportPipeline
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.transactions.TransactionManager
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.mp.KoinPlatform.getKoin
import java.nio.file.Path
import kotlin.io.path.createTempDirectory
import kotlin.test.AfterTest
import kotlin.test.BeforeTest

abstract class DeweyTest(
    private val migrate: Boolean = true,
) {
    protected lateinit var dataDir: Path
        private set

    protected lateinit var config: DeweyConfig
        private set

    protected lateinit var database: Database
        private set

    private lateinit var dataSource: HikariDataSource

    protected open fun configure(dataDir: Path) = DeweyConfig(dataDir = dataDir)

    @BeforeTest
    fun startApplication() {
        dataDir = createTempDirectory("dewey-test")
        config = configure(dataDir)
        startKoin { modules(deweyModule(config)) }

        dataSource = sqliteDataSource(config.sqliteFile, config.importThreads, busyTimeoutMillis = 500)
        database = DatabaseConnector.connect(dataSource)
        if (migrate) DatabaseMigrator().migrateDatabase()
        getKoin().get<LibraryImportPipeline>().start()
    }

    @AfterTest
    fun stopApplication() {
        getKoin().get<LibraryImportPipeline>().stop()
        TransactionManager.closeAndUnregister(database)
        dataSource.close()
        stopKoin()
        dataDir.toFile().deleteRecursively()
    }
}
