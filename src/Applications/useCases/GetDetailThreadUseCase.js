const DetailThreadEntity = require('../../Domains/detailThread/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
  }

  async execute(threadId) {
    await this._threadsRepository.checkExistenceById(threadId);

    const thread = await this._threadsRepository.getWithUsernameById(threadId);

    const threadComments =
      await this._threadCommentsRepository.getManyWithUsernameByThreadId(
        threadId,
      );

    const threadCommentReplies =
      await this._threadCommentRepliesRepository.getManyWithUsernameByThreadId(
        threadId,
      );

    return {
      thread: new DetailThreadEntity({
        thread,
        threadComments,
        threadCommentReplies,
      }),
    };
  }
}

module.exports = GetDetailThreadUseCase;
