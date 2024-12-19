const AddThreadCommentReplyUseCase = require('../../../../Applications/useCases/AddThreadCommentReplyUseCase');
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/useCases/DeleteThreadCommentReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentReplyHandler =
      this.postThreadCommentReplyHandler.bind(this);

    this.deleteThreadCommentReplyHandler =
      this.deleteThreadCommentReplyHandler.bind(this);
  }

  async postThreadCommentReplyHandler({ auth, params, payload }, h) {
    const addThreadCommentReplyUseCase = this._container.getInstance(
      AddThreadCommentReplyUseCase.name,
    );

    const { userId } = auth.credentials;

    const { threadId, commentId } = params;

    const addedReply = await addThreadCommentReplyUseCase.execute(
      userId,
      threadId,
      commentId,
      payload,
    );

    return h
      .response({
        status: 'success',
        data: addedReply,
      })
      .code(201);
  }

  async deleteThreadCommentReplyHandler({ auth, params }, h) {
    const deleteThreadCommentReplyUseCase = this._container.getInstance(
      DeleteThreadCommentReplyUseCase.name,
    );

    const { userId } = auth.credentials;

    const { threadId, commentId, replyId } = params;

    await deleteThreadCommentReplyUseCase.execute(
      userId,
      threadId,
      commentId,
      replyId,
    );

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;
