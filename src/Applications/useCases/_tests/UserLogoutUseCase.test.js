const AuthRepository = require('../../../Domains/auth/AuthRepository');
const UserLogoutUseCase = require('../UserLogoutUseCase');

describe('A UserLogoutUseCase Use Case', () => {
  describe('Negative Tests', () => {
    test.each([1, true, undefined, null, [], {}, () => {}])(
      'should throw an error when payload validation is failed',
      async (dmyPayload) => {
        // Arrange
        const authRepository = new AuthRepository();

        authRepository.checkRefreshTokenExistence = jest.fn();
        authRepository.deleteRefreshToken = jest.fn();

        const userLogoutUseCase = new UserLogoutUseCase(authRepository);

        // Action & Assert
        await expect(() =>
          userLogoutUseCase.execute(dmyPayload),
        ).rejects.toThrow('APPLICATION.USER_LOGOUT_USE_CASE.PAYLOAD_INVALID');

        await expect(() =>
          userLogoutUseCase.execute({
            refreshToken: dmyPayload,
          }),
        ).rejects.toThrow('APPLICATION.USER_LOGOUT_USE_CASE.PAYLOAD_INVALID');

        expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
          0,
        );

        expect(authRepository.deleteRefreshToken).toHaveBeenCalledTimes(0);
      },
    );

    test('should throw an error when checking a refresh token is failed', async () => {
      // Arrange
      const authRepository = new AuthRepository();

      authRepository.checkRefreshTokenExistence = jest.fn().mockRejectedValue();

      authRepository.deleteRefreshToken = jest.fn();

      const userLogoutUseCase = new UserLogoutUseCase(authRepository);

      // Action & Assert
      await expect(() =>
        userLogoutUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).rejects.toThrow(
        'APPLICATION.USER_LOGOUT_USE_CASE.REFRESH_TOKEN_INVALID',
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
        1,
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authRepository.deleteRefreshToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('Positive Tests', () => {
    test('should orchestrate an action of the use case correctly', async () => {
      // Arrange
      const authRepository = new AuthRepository();

      authRepository.checkRefreshTokenExistence = jest.fn().mockResolvedValue();

      authRepository.deleteRefreshToken = jest.fn().mockResolvedValue();

      const userLogoutUseCase = new UserLogoutUseCase(authRepository);

      // Action & Assert
      await expect(
        userLogoutUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).resolves.not.toThrow(Error);

      await expect(
        userLogoutUseCase.execute({
          refreshToken: 'refresh_token',
        }),
      ).resolves.toBeUndefined();

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledTimes(
        2,
      );

      expect(authRepository.checkRefreshTokenExistence).toHaveBeenCalledWith(
        'refresh_token',
      );

      expect(authRepository.deleteRefreshToken).toHaveBeenCalledTimes(2);

      expect(authRepository.deleteRefreshToken).toHaveBeenCalledWith(
        'refresh_token',
      );
    });
  });
});
