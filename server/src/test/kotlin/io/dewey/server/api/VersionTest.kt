package io.dewey.server.api

import io.dewey.server.DeweyTest
import io.dewey.server.api
import io.dewey.server.deweyServer
import io.ktor.http.HttpStatusCode
import kotlin.test.Test
import kotlin.test.assertEquals

class VersionTest : DeweyTest() {
    @Test
    fun `the api version is readable without logging in`() =
        deweyServer {
            val response = api.getApiVersion()

            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(api.apiVersion, response.body().version)
        }
}
