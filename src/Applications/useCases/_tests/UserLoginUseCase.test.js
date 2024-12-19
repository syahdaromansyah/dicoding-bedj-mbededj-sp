const UserProfileEntity = require('../../../Domains/users/entities/UserProfile');
const AuthRepository = require('../../../Domains/auth/AuthRepository');
const CredentialValidation = require('../../security/CredentialValidation');
const AuthTokenManager = require('../../security/AuthTokenManager');
const UserLoginUseCase = require('../UserLoginUseCase');

describe('A UserLoginUseCase Use Case', () => {
  test('should orchestrate a use case action correctly', async () => {
    // Arrange
    const credentialValidation = new CredentialValidation();

    credentialValidation.validate = jest.fn().mockResolvedValue(
      new UserProfileEntity({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        fullname: 'Foo Bar',
      }),
    );

    const authTokenManager = new AuthTokenManager();

    authTokenManager.generateAccessToken = jest
      .fn()
      .mockReturnValue('access_token');

    authTokenManager.generateRefreshToken = jest
      .fn()
      .mockReturnValue('refresh_token');

    const authRepository = new AuthRepository();

    authRepository.addRefreshToken = jest.fn().mockResolvedValue();

    const userLoginUseCase = new UserLoginUseCase({
      credentialValidation,
      authTokenManager,
      authRepository,
    });

    // Action & Assert
    await expect(
      userLoginUseCase.execute({
        username: 'foobar',
        password: 'foobarpwd',
      }),
    ).resolves.toStrictEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    expect(credentialValidation.validate).toHaveBeenCalledTimes(1);

    expect(credentialValidation.validate).toHaveBeenCalledWith(
      'foobar',
      'foobarpwd',
    );

    expect(authTokenManager.generateAccessToken).toHaveBeenCalledTimes(1);

    expect(authTokenManager.generateAccessToken).toHaveBeenCalledWith({
      userId: `user-${'xyz'.repeat(10)}`,
    });

    expect(authTokenManager.generateRefreshToken).toHaveBeenCalledTimes(1);

    expect(authTokenManager.generateRefreshToken).toHaveBeenCalledWith({
      userId: `user-${'xyz'.repeat(10)}`,
    });

    expect(authRepository.addRefreshToken).toHaveBeenCalledTimes(1);

    expect(authRepository.addRefreshToken).toHaveBeenCalledWith(
      'refresh_token',
    );
  });
});
