package io.dewey.server.repositories

import io.dewey.metadata.FakeMetadataAgent
import io.dewey.metadata.MetadataAgents
import io.dewey.metadata.searchHit
import io.dewey.models.NamedMetadataAgent
import io.dewey.server.DeweyTest
import io.dewey.server.database.tables.BookTable
import io.dewey.server.file.scanner.LibraryImportPipeline
import io.dewey.server.newLibrary
import io.dewey.server.schedules.AutoMatcher
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.v1.core.isNotNull
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.koin.dsl.module
import org.koin.mp.KoinPlatform.getKoin
import java.nio.file.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.isDirectory
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertTrue
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds

class AutoMatchOnScanTest : DeweyTest() {
    private val pipeline by lazy { getKoin().get<LibraryImportPipeline>() }
    private val autoMatcher by lazy { getKoin().get<AutoMatcher>() }

    private val testResources: Path =
        generateSequence(Path.of("").toAbsolutePath()) { it.parent }
            .map { it.resolve("test-resources") }
            .first { it.isDirectory() }

    @BeforeTest
    fun startMatcher() {
        val agent =
            FakeMetadataAgent(
                hits =
                    listOf("Angels and Demons", "Da Vinci Code").map {
                        searchHit(it, authors = listOf("Dan Brown"), series = listOf("Robert Langdon"))
                    },
            )
        getKoin().loadModules(listOf(module { single { MetadataAgents(listOf(agent)) } }), allowOverride = true)
        autoMatcher.start()
    }

    @AfterTest
    fun stopMatcher() {
        autoMatcher.stop()
    }

    @Test
    fun `a new library matches its books against its metadata agent`() {
        // The author is read from the folder above the series, and a match is only accepted for that author
        val root = dataDir.resolve("library")
        testResources
            .resolve("Dan Brown/Robert Langdon")
            .toFile()
            .copyRecursively(root.resolve("Dan Brown/Robert Langdon").toFile())
        val libId =
            newLibrary(
                "fake",
                folders = listOf(root.absolutePathString()),
                metadataAgents = listOf(NamedMetadataAgent("fake")),
            )

        pipeline.scanLibrary(libId)

        eventually(describe = { "the scan to import a book" }) { books() > 0 }
        eventually(describe = { "the imported books to be matched, ${matched()} of ${books()} are" }) {
            matched() == books()
        }
        assertTrue(
            transaction { BookTable.selectAll().all { it[BookTable.provider] == "fake" } },
            "every match must record the agent it came from",
        )
    }

    private fun books() = transaction { BookTable.selectAll().count() }

    private fun matched() = transaction { BookTable.selectAll().where { BookTable.provider.isNotNull() }.count() }

    private fun eventually(
        timeout: Duration = 30.seconds,
        describe: () -> String,
        until: () -> Boolean,
    ) = runBlocking {
        val deadline = System.nanoTime() + timeout.inWholeNanoseconds
        while (System.nanoTime() < deadline) {
            if (until()) return@runBlocking
            delay(50.milliseconds)
        }
        throw AssertionError("Timed out waiting for: ${describe()}")
    }
}
