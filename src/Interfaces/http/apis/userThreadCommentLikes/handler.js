const UserThreadCommentLikeUseCase = require('../../../../Applications/useCases/UserThreadCommentLikeUseCase');

class UserThreadCommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putUserThreadCommentLikeHandler =
      this.putUserThreadCommentLikeHandler.bind(this);
  }

  async putUserThreadCommentLikeHandler({ auth, params }, h) {
    const { userId } = auth.credentials;

    const { threadId, commentId } = params;

    const userThdCmtLikeUseCase = this._container.getInstance(
      UserThreadCommentLikeUseCase.name,
    );

    await userThdCmtLikeUseCase.execute(userId, threadId, commentId);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = UserThreadCommentLikesHandler;
