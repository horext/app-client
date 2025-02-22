import { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import jwt from 'jsonwebtoken'

export interface JwtClientOptions {
  audience: string
  issuer: string
}

export class JwtClient {
  constructor(
    private readonly options: JwtClientOptions,
    private readonly jwksClient: JwksClient,
  ) {}

  getKey(header: JwtHeader, callback: SigningKeyCallback) {
    this.jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err)
        return
      }
      callback(null, key?.getPublicKey())
    })
  }

  async verify(token: string) {
    return new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        this.getKey,
        {
          algorithms: ['RS256'],
          audience: this.options.audience,
          issuer: this.options.issuer,
        },
        (err, decoded) => {
          if (err) {
            return reject(err)
          }
          if (!decoded) {
            return reject(new Error('Invalid token'))
          }
          if (typeof decoded === 'string') {
            return reject(new Error('Invalid format of decoded token'))
          }
          return resolve(decoded)
        },
      )
    })
  }
}
