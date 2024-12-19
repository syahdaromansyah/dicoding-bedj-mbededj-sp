const AuthRepository = require('../AuthRepository');

describe('An AuthRepository Interface', () => {
  test('should throw error when invoking an abstract method', async () => {
    // Arrange
    const authRepository = new AuthRepository();

    // Action & Assert
    await expect(() => authRepository.addRefreshToken()).rejects.toThrow(
      'DOMAIN.AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => authRepository.deleteRefreshToken()).rejects.toThrow(
      'DOMAIN.AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() =>
      authRepository.checkRefreshTokenExistence(),
    ).rejects.toThrow('DOMAIN.AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
