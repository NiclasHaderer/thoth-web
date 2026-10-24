package io.dewey.server.api

import io.dewey.client.gen.models.AuthorCreateImpl
import io.dewey.client.gen.models.LibraryPermissionLevel
import io.dewey.client.gen.models.SeriesCreateImpl
import io.dewey.server.DeweyTest
import io.dewey.server.api
import io.dewey.server.bearer
import io.dewey.server.deweyServer
import io.dewey.server.newLibrary
import io.dewey.server.registerWithAccess
import io.ktor.http.HttpStatusCode
import kotlin.test.Test
import kotlin.test.assertEquals

class ManualCreationTest : DeweyTest() {
    @Test
    fun `a hand made author is returned by the endpoint that created it`() =
        deweyServer {
            val libId = newLibrary("lib")
            val token = bearer(registerWithAccess("editor", libId, LibraryPermissionLevel.READ_WRITE))

            val response = api.createAuthor(libId, AuthorCreateImpl("Terry Pratchett"), token)

            assertEquals(HttpStatusCode.Created, response.status)
            assertEquals("Terry Pratchett", response.body().name)
            assertEquals(
                HttpStatusCode.NotFound,
                api.getAuthor(response.body().id, libId, token).status,
                "it stays hidden until a book joins it, so a later read is a miss",
            )
        }

    @Test
    fun `a hand made series is returned by the endpoint that created it`() =
        deweyServer {
            val libId = newLibrary("lib")
            val token = bearer(registerWithAccess("editor", libId, LibraryPermissionLevel.READ_WRITE))

            val response = api.createSeries(libId, SeriesCreateImpl("Discworld"), token)

            assertEquals(HttpStatusCode.Created, response.status)
            assertEquals("Discworld", response.body().title)
            assertEquals(
                HttpStatusCode.NotFound,
                api.getSeries(response.body().id, libId, token).status,
                "it stays hidden until a book joins it, so a later read is a miss",
            )
        }
}
