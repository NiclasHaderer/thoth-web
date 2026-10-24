package io.dewey.openapi.client.kotlin.types

import io.dewey.openapi.client.common.GenerateType
import io.dewey.openapi.client.kotlin.KtTypeGenerator
import io.dewey.openapi.common.ClassType

class UnitKtGenerator : KtTypeGenerator() {
    override fun generateContent(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String = "Unit"

    override fun getInsertionMode(classType: ClassType) = KtDataType.PRIMITIVE

    override fun getName(classType: ClassType): String? = null

    override fun generateReference(
        classType: ClassType,
        generateSubType: GenerateType<KtType>,
    ): String? = null

    override fun canGenerate(classType: ClassType): Boolean = classType.isSubclassOf(Unit::class)
}
