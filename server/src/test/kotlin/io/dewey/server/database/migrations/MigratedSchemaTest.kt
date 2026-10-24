package io.dewey.server.database.migrations

import io.dewey.server.DeweyTest
import io.dewey.server.database.DEWEY_TABLES
import io.dewey.server.database.sqliteDataSource
import org.jetbrains.exposed.v1.core.EnumerationColumnType
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.SchemaUtils
import org.jetbrains.exposed.v1.jdbc.transactions.TransactionManager
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.vendors.currentDialectMetadata
import kotlin.test.Test
import kotlin.test.assertEquals

class MigratedSchemaTest : DeweyTest(migrate = false) {
    @Test
    fun `migrations produce the schema the tables describe`() {
        DatabaseMigrator().migrateDatabase()
        val migrated = transaction(database) { snapshot() }

        assertEquals(referenceSchema(), migrated)
    }

    private fun referenceSchema(): List<String> {
        val dataSource = sqliteDataSource(dataDir.resolve("reference.db"), importThreads = 1, busyTimeoutMillis = 500)
        val reference = Database.connect(dataSource)
        try {
            transaction(reference) { SchemaUtils.create(*DEWEY_TABLES) }
            return transaction(reference) { snapshot() }
        } finally {
            TransactionManager.closeAndUnregister(reference)
            dataSource.close()
        }
    }

    private fun snapshot(): List<String> {
        currentDialectMetadata.resetCaches()
        val existing = currentDialectMetadata.allTablesNames().map { it.substringAfterLast('.').lowercase() }.toSet()
        val present = DEWEY_TABLES.filter { it.tableName.lowercase() in existing }.toTypedArray()

        val columns = present.metadata { currentDialectMetadata.tableColumns(*it) }
        val indices = present.metadata { currentDialectMetadata.existingIndices(*it) }
        val primaryKeys = present.metadata { currentDialectMetadata.existingPrimaryKeys(*it) }

        return DEWEY_TABLES.sortedBy { it.tableName }.map { table ->
            buildString {
                appendLine("${table.tableName} present=${table in present}")
                columns[table].orEmpty().sortedBy { it.name }.forEach { appendLine("  column $it") }
                indices[table]
                    .orEmpty()
                    .map { "  index $it" }
                    .sorted()
                    .forEach { appendLine(it) }
                appendLine("  primaryKey ${primaryKeys[table]}")
            }
        }
    }

    private fun <T> Array<Table>.metadata(read: (Array<Table>) -> Map<Table, T>): Map<Table, T> =
        if (isEmpty()) emptyMap() else read(this)
}
