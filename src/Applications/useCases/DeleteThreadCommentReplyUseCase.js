class DeleteThreadCommentReplyUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
  }

  async execute(ownerId, threadId, commentId, replyId) {
    await this._threadsRepository.checkExistenceById(threadId);

    await this._threadCommentsRepository.checkExistenceById(commentId);

    await this._threadCommentRepliesRepository.checkExistenceById(replyId);

    await this._threadCommentRepliesRepository.verifyOwner(ownerId, replyId);

    await this._threadCommentRepliesRepository.deleteById(replyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
