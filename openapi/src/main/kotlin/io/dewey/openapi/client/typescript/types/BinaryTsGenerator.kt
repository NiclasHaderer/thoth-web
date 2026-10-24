package io.dewey.openapi.client.typescript.types

import io.dewey.openapi.client.common.GenerateType
import io.dewey.openapi.client.typescript.TsTypeGenerator
import io.dewey.openapi.common.ClassType
import io.dewey.openapi.ktor.responses.BinaryResponse
import io.dewey.openapi.ktor.responses.FileResponse

class BinaryTsGenerator : TsTypeGenerator() {
    override fun generateContent(
        classType: ClassType,
        generateSubType: GenerateType<TsType>,
    ) = "Blob"

    override fun getParsingMethod(classType: ClassType): TsParseMethod = TsParseMethod.BLOB

    override fun getInsertionMode(classType: ClassType) = TsDataType.PRIMITIVE

    override fun generateReference(
        classType: ClassType,
        generateSubType: GenerateType<TsType>,
    ): String? = null

    override fun getName(classType: ClassType): String? = null

    override fun canGenerate(classType: ClassType): Boolean =
        classType.isSubclassOf(BinaryResponse::class, FileResponse::class, ByteArray::class)
}
