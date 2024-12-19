const NewThreadCommentReplyEntity = require('../../Domains/threadCommentReplies/entities/NewThreadCommentReply');

class AddThreadCommentReplyUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
  }

  async execute(ownerId, threadId, commentId, payload) {
    const newThreadCommentReply = new NewThreadCommentReplyEntity(payload);

    await this._threadsRepository.checkExistenceById(threadId);

    await this._threadCommentsRepository.checkExistenceById(commentId);

    const addedThreadCommentReply =
      await this._threadCommentRepliesRepository.add(
        ownerId,
        commentId,
        newThreadCommentReply,
      );

    return {
      addedReply: {
        id: addedThreadCommentReply.id,
        content: addedThreadCommentReply.content,
        owner: addedThreadCommentReply.ownerId,
      },
    };
  }
}

module.exports = AddThreadCommentReplyUseCase;
