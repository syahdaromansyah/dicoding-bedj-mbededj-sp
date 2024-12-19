const AddThreadUseCase = require('../../../../Applications/useCases/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/useCases/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler({ auth, payload }, h) {
    const { userId } = auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute(userId, payload);

    return h
      .response({
        status: 'success',
        data: addedThread,
      })
      .code(201);
  }

  async getDetailThreadHandler({ params }, h) {
    const getDetailThreadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name,
    );

    const detailThread = await getDetailThreadUseCase.execute(params.threadId);

    return h
      .response({
        status: 'success',
        data: detailThread,
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;
