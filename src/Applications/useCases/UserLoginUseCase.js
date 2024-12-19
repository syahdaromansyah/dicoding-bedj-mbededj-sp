const UserCredentialEntity = require('../../Domains/users/entities/UserCredential');

class UserLoginUseCase {
  constructor({ credentialValidation, authTokenManager, authRepository }) {
    this._credentialValidation = credentialValidation;
    this._authTokenManager = authTokenManager;
    this._authRepository = authRepository;
  }

  async execute(payload) {
    const { username, password } = new UserCredentialEntity(payload);

    const { id: userId } = await this._credentialValidation.validate(
      username,
      password,
    );

    const accessToken = this._authTokenManager.generateAccessToken({
      userId,
    });

    const refreshToken = this._authTokenManager.generateRefreshToken({
      userId,
    });

    await this._authRepository.addRefreshToken(refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = UserLoginUseCase;
