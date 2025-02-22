import { JwtHeader, SigningKeyCallback } from "jsonwebtoken"
import { JwksClient } from "jwks-rsa"

export class CustomJwksClient extends JwksClient {
    getKey(header: JwtHeader, callback: SigningKeyCallback) {
        super.getSigningKey(header.kid, (err, key) => {
            if (err) {
                callback(err)
                return
            }
            callback(null, key?.getPublicKey())
        })
    }
}