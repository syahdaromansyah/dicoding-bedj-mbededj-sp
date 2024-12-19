const AddThreadCommentUseCase = require('../../../../Applications/useCases/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/useCases/DeleteThreadCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);

    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler({ auth, params, payload }, h) {
    const { userId } = auth.credentials;

    const { threadId } = params;

    const addThreadCommentUseCase = this._container.getInstance(
      AddThreadCommentUseCase.name,
    );

    const addedComment = await addThreadCommentUseCase.execute(
      userId,
      threadId,
      payload,
    );

    return h
      .response({
        status: 'success',
        data: addedComment,
      })
      .code(201);
  }

  async deleteThreadCommentHandler({ auth, params }, h) {
    const { userId } = auth.credentials;

    const { threadId, commentId } = params;

    const deleteThreadCommentUseCase = this._container.getInstance(
      DeleteThreadCommentUseCase.name,
    );

    await deleteThreadCommentUseCase.execute(userId, threadId, commentId);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;
