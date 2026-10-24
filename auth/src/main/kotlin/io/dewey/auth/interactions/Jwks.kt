package io.dewey.auth.interactions

import com.nimbusds.jose.jwk.KeyUse
import com.nimbusds.jose.jwk.RSAKey
import io.dewey.auth.deweyAuthConfig
import io.dewey.auth.models.DeweyJWKs
import io.dewey.auth.models.JWK
import io.ktor.server.routing.RoutingContext
import java.security.interfaces.RSAPublicKey

interface DeweyJwksParams

fun RoutingContext.getJwks(params: DeweyJwksParams): DeweyJWKs {
    val config = deweyAuthConfig<Any, Any>()
    val keyPairs = config.keyPairs

    val jwks =
        keyPairs.entries
            .map { (keyId, keyPair) ->
                RSAKey
                    .Builder(keyPair.public as RSAPublicKey)
                    .keyUse(KeyUse.SIGNATURE)
                    .keyID(keyId)
                    .build()
            }.map { rsaKey ->
                JWK(
                    kty = rsaKey.keyType.toString(),
                    use = rsaKey.keyUse.toString(),
                    kid = rsaKey.keyID,
                    n = rsaKey.modulus.toString(),
                    e = rsaKey.publicExponent.toString(),
                )
            }

    return DeweyJWKs(keys = jwks)
}
