package io.dewey.server.database.extensions

import io.dewey.server.di.serialization.Serialization
import io.dewey.server.di.serialization.deserializeValue
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.json.json
import org.koin.mp.KoinPlatform

inline fun <reified T : Any> Table.json(
    columnName: String,
    crossinline validation: (T) -> Unit = {},
): Column<T> {
    val serializer = KoinPlatform.getKoin().get<Serialization>()

    return json(columnName, serialize = {
        validation(it)
        serializer.serializeValue(it)
    }, deserialize = {
        serializer.deserializeValue<T>(it)
    })
}
