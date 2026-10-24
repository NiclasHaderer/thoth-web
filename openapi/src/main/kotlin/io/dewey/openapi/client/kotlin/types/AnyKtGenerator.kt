package io.dewey.openapi.client.kotlin.types

import io.dewey.openapi.client.common.GenerateType
import io.dewey.openapi.client.kotlin.KtTypeGenerator
import io.dewey.openapi.common.ClassType

class AnyKtGenerator : KtTypeGenerator() {
    override fun generateContent(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String = "Any"

    override fun getName(classType: ClassType): String? = null

    override fun priority(classType: ClassType): Int = -1

    override fun getInsertionMode(classType: ClassType) = KtDataType.PRIMITIVE

    override fun generateReference(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String? = null

    override fun canGenerate(classType: ClassType): Boolean = classType.clazz == Any::class
}
