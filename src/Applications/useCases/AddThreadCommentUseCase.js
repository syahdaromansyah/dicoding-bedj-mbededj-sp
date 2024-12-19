const NewThreadCommentEntity = require('../../Domains/threadComments/entities/NewThreadComment');

class AddThreadCommentUseCase {
  constructor(threadsRepository, threadCommentsRepository) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
  }

  async execute(ownerId, threadId, payload) {
    const newThreadComment = new NewThreadCommentEntity(payload);

    await this._threadsRepository.checkExistenceById(threadId);

    const addedThreadComment = await this._threadCommentsRepository.add(
      ownerId,
      threadId,
      newThreadComment,
    );

    return {
      addedComment: {
        id: addedThreadComment.id,
        content: addedThreadComment.content,
        owner: addedThreadComment.ownerId,
      },
    };
  }
}

module.exports = AddThreadCommentUseCase;
