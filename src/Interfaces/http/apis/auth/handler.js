const UserLoginUseCase = require('../../../../Applications/useCases/UserLoginUseCase');
const RefreshTokenUseCase = require('../../../../Applications/useCases/RefreshTokenUseCase');
const UserLogoutUseCase = require('../../../../Applications/useCases/UserLogoutUseCase');

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler({ payload }, h) {
    const userLoginUseCase = this._container.getInstance(UserLoginUseCase.name);

    const token = await userLoginUseCase.execute(payload);

    return h
      .response({
        status: 'success',
        data: token,
      })
      .code(201);
  }

  async putAuthHandler({ payload }, h) {
    const refreshTokenUseCase = this._container.getInstance(
      RefreshTokenUseCase.name,
    );

    const token = await refreshTokenUseCase.execute(payload);

    return h
      .response({
        status: 'success',
        data: token,
      })
      .code(200);
  }

  async deleteAuthHandler({ payload }, h) {
    const userLogoutUseCase = this._container.getInstance(
      UserLogoutUseCase.name,
    );

    await userLogoutUseCase.execute(payload);

    return h
      .response({
        status: 'success',
        message: 'user logout is successful',
      })
      .code(200);
  }
}

module.exports = AuthHandler;
