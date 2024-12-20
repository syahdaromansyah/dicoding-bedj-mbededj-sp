class UserThreadCommentLikeUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    userThreadCommentLikesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._userThreadCommentLikesRepository = userThreadCommentLikesRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadsRepository.checkExistenceById(threadId);

    await this._threadCommentsRepository.checkExistenceById(commentId);

    const isLiked = await this._userThreadCommentLikesRepository.isLiked(
      userId,
      commentId,
    );

    if (isLiked) {
      await this._userThreadCommentLikesRepository.delete(userId, commentId);
    } else {
      await this._userThreadCommentLikesRepository.add(userId, commentId);
    }
  }
}

module.exports = UserThreadCommentLikeUseCase;
