const AuthTokenManager = require('../AuthTokenManager');

describe('An AuthTokenManager Interface', () => {
  test('should throw an error when invoking an abstract method', async () => {
    const authTokenManager = new AuthTokenManager();

    await expect(() => authTokenManager.generateAccessToken()).rejects.toThrow(
      'APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => authTokenManager.generateRefreshToken()).rejects.toThrow(
      'APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => authTokenManager.validateRefreshToken()).rejects.toThrow(
      'APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() =>
      authTokenManager.getRefreshTokenPayload(),
    ).rejects.toThrow('APPLICATION.AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
