class RefreshTokenUseCase {
  constructor(authRepository, authTokenManager) {
    this._authRepository = authRepository;
    this._authTokenManager = authTokenManager;
  }

  async execute(payload) {
    this._validatePayload(payload);

    const { refreshToken } = payload;

    await this._validateRefreshToken(refreshToken);

    const tokenPayload =
      this._authTokenManager.getRefreshTokenPayload(refreshToken);

    const accessToken =
      this._authTokenManager.generateAccessToken(tokenPayload);

    return {
      accessToken,
    };
  }

  _validatePayload(payload) {
    const errorValidation = new Error(
      'APPLICATION.REFRESH_TOKEN_USE_CASE.PAYLOAD_INVALID',
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

      this._authTokenManager.validateRefreshToken(refreshToken);
    } catch (_) {
      throw new Error(
        'APPLICATION.REFRESH_TOKEN_USE_CASE.REFRESH_TOKEN_INVALID',
      );
    }
  }
}

module.exports = RefreshTokenUseCase;
