const AuthRepository = require('../../../Domains/auth/AuthRepository');
const AuthTokenManager = require('../../security/AuthTokenManager');
const RefreshTokenUseCase = require('../RefreshTokenUseCase');

describe('A RefreshTokenUseCase Use Case', () => {
  describe('Negative Tests', () => {
    test.each([1, true, undefined, null, [], {}, () => {}])(
      'should throw an error when payload validation is failed',
      async (dmyPayload) => {
        // Arrange
        const authRepository = new AuthRepository();

        authRepository.checkRefreshTokenExistence = jest.fn();

        const authTokenManager = new AuthTokenManager();

        authTokenManager.validateRefreshToken = jest.fn();
        authTokenManager.getRefreshTokenPayload = jest.fn();
        authTokenManager.generateAccessToken = jest.fn();

        const refreshTokenUseCase = new RefreshTokenUseCase(
          authRepository,
          authTokenManager,
        );

        // Action & Assert
        await expect(() =>
          refreshTokenUseCase.execute(dmyPayload),
        ).rejects.toThrow('APPLICATION.REFRESH_TOKEN_USE_CASE.PAYLOAD_INVALID');

        await expect(() =>
          refreshTokenUseCase.execute({
            refreshToken: dmyPayload,
          }),
        ).rejects.toThrow('APPLICATION.REFRESH_TOKEN_USE_CASE.PAYLOAD_INVALID');

        expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
          0,
        );

        expect(authTokenManager.validateRefreshToken).toHaveBeenCalledTimes(0);
        expect(authTokenManager.getRefreshTokenPayload).toHaveBeenCalledTimes(
          0,
        );
        expect(authTokenManager.generateAccessToken).toHaveBeenCalledTimes(0);
      },
    );

    test('should throw an error when refresh token is not exist', async () => {
      // Arrange
      const authRepository = new AuthRepository();

      authRepository.checkRefreshTokenExistence = jest.fn().mockRejectedValue();

      const authTokenManager = new AuthTokenManager();

      authTokenManager.validateRefreshToken = jest.fn();
      authTokenManager.getRefreshTokenPayload = jest.fn();
      authTokenManager.generateAccessToken = jest.fn();

      const refreshTokenUseCase = new RefreshTokenUseCase(
        authRepository,
        authTokenManager,
      );

      // Action & Assert
      await expect(() =>
        refreshTokenUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).rejects.toThrow(
        'APPLICATION.REFRESH_TOKEN_USE_CASE.REFRESH_TOKEN_INVALID',
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
        1,
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.validateRefreshToken).toHaveBeenCalledTimes(0);
      expect(authTokenManager.getRefreshTokenPayload).toHaveBeenCalledTimes(0);
      expect(authTokenManager.generateAccessToken).toHaveBeenCalledTimes(0);
    });

    test('should throw an error when refresh token validation is failed', async () => {
      // Arrange
      const authRepository = new AuthRepository();

      authRepository.checkRefreshTokenExistence = jest.fn().mockResolvedValue();

      const authTokenManager = new AuthTokenManager();

      authTokenManager.validateRefreshToken = jest.fn(() => {
        throw new Error();
      });

      authTokenManager.getRefreshTokenPayload = jest.fn();
      authTokenManager.generateAccessToken = jest.fn();

      const refreshTokenUseCase = new RefreshTokenUseCase(
        authRepository,
        authTokenManager,
      );

      // Action & Assert
      await expect(() =>
        refreshTokenUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).rejects.toThrow(
        'APPLICATION.REFRESH_TOKEN_USE_CASE.REFRESH_TOKEN_INVALID',
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
        1,
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.validateRefreshToken).toHaveBeenCalledTimes(1);

      expect(authTokenManager.validateRefreshToken).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.getRefreshTokenPayload).toHaveBeenCalledTimes(0);
      expect(authTokenManager.generateAccessToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('Positive Tests', () => {
    test('should orchestrate an action of the use case correctly', async () => {
      // Arrange
      const authRepository = new AuthRepository();

      authRepository.checkRefreshTokenExistence = jest.fn().mockResolvedValue();

      const authTokenManager = new AuthTokenManager();

      authTokenManager.validateRefreshToken = jest.fn().mockReturnValue();

      authTokenManager.getRefreshTokenPayload = jest.fn().mockReturnValue({
        userId: 'user-1',
      });

      authTokenManager.generateAccessToken = jest
        .fn()
        .mockReturnValue('new_access_token');

      const refreshTokenUseCase = new RefreshTokenUseCase(
        authRepository,
        authTokenManager,
      );

      // Action & Assert
      await expect(
        refreshTokenUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).resolves.toStrictEqual({
        accessToken: 'new_access_token',
      });

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
        1,
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.validateRefreshToken).toHaveBeenCalledTimes(1);

      expect(authTokenManager.validateRefreshToken).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.getRefreshTokenPayload).toHaveBeenCalledTimes(1);

      expect(authTokenManager.getRefreshTokenPayload).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authTokenManager.generateAccessToken).toHaveBeenCalledTimes(1);

      expect(authTokenManager.generateAccessToken).toHaveBeenCalledWith({
        userId: 'user-1',
      });
    });
  });
});
