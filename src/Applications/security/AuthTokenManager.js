class AuthTokenManager {
  async generateAccessToken() {
    throw new Error('APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async generateRefreshToken() {
    throw new Error('APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async validateRefreshToken() {
    throw new Error('APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async getRefreshTokenPayload() {
    throw new Error('APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthTokenManager;
