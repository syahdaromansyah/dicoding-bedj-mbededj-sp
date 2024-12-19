const AddUserUseCase = require('../../../../Applications/useCases/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);

    const addedUser = await addUserUseCase.execute(payload);

    return h
      .response({
        status: 'success',
        data: addedUser,
      })
      .code(201);
  }
}

module.exports = UsersHandler;
