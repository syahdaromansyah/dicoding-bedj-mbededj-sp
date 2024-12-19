class DeleteThreadCommentUseCase {
  constructor(threadsRepository, threadCommentsRepository) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
  }

  async execute(ownerId, threadId, commentId) {
    await this._threadsRepository.checkExistenceById(threadId);

    await this._threadCommentsRepository.checkExistenceById(commentId);

    await this._threadCommentsRepository.verifyOwner(ownerId, commentId);

    await this._threadCommentsRepository.deleteById(commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
