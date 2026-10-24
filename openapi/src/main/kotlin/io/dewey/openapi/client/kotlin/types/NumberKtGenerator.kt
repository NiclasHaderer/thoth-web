package io.dewey.openapi.client.kotlin.types

import io.dewey.openapi.client.common.GenerateType
import io.dewey.openapi.client.kotlin.KtTypeGenerator
import io.dewey.openapi.common.ClassType

class NumberKtGenerator : KtTypeGenerator() {
    override fun generateContent(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String = classType.simpleName

    override fun getName(classType: ClassType): String? = null

    override fun getInsertionMode(classType: ClassType) = KtDataType.PRIMITIVE

    override fun generateReference(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String? = null

    override fun canGenerate(classType: ClassType): Boolean =
        classType.isSubclassOf(
            Number::class,
            Int::class,
            Long::class,
            Double::class,
            Float::class,
            Short::class,
            Byte::class,
            UInt::class,
            ULong::class,
            UShort::class,
            UByte::class,
        )
}
