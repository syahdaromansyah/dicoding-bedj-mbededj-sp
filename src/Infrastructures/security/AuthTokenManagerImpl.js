const AuthTokenManager = require('../../Applications/security/AuthTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const config = require('../../Commons/config');

class AuthTokenManagerImpl extends AuthTokenManager {
  constructor(jwt) {
    super();

    this._jwt = jwt;
  }

  generateAccessToken(payload) {
    return this._jwt.token.generate(payload, config.secret.auth.accessToken);
  }

  generateRefreshToken(payload) {
    return this._jwt.token.generate(payload, config.secret.auth.refreshToken);
  }

  validateRefreshToken(refreshToken) {
    try {
      const artifacts = this._jwt.token.decode(refreshToken);

      this._jwt.token.verifySignature(
        artifacts,
        config.secret.auth.refreshToken,
      );
    } catch (_error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  getRefreshTokenPayload(refreshToken) {
    try {
      const artifacts = this._jwt.token.decode(refreshToken);

      return artifacts.decoded.payload;
    } catch (_error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }
}

module.exports = AuthTokenManagerImpl;
