class UserLogoutUseCase {
  constructor(authRepository) {
    this._authRepository = authRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);

    const { refreshToken } = payload;

    await this._validateRefreshToken(refreshToken);

    await this._authRepository.deleteRefreshToken(refreshToken);
  }

  _validatePayload(payload) {
    const errorValidation = new Error(
      'APPLICATION.USER_LOGOUT_USE_CASE.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw errorValidation;
    }

    const { refreshToken } = payload;

    if (!refreshToken) {
      throw errorValidation;
    }

    if (typeof refreshToken !== 'string') {
      throw errorValidation;
    }
  }

  async _validateRefreshToken(refreshToken) {
    try {
      await this._authRepository.checkRefreshTokenExistence(refreshToken);
    } catch (_) {
      throw new Error('APPLICATION.USER_LOGOUT_USE_CASE.REFRESH_TOKEN_INVALID');
    }
  }
}

module.exports = UserLogoutUseCase;
