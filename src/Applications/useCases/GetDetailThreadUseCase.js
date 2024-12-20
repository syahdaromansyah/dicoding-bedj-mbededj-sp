const DetailThreadEntity = require('../../Domains/detailThread/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository,
    userThreadCommentLikesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
    this._userThreadCommentLikesRepository = userThreadCommentLikesRepository;
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

    const userThreadCommentsLikes =
      await this._userThreadCommentLikesRepository.getByThreadId(threadId);

    return {
      thread: new DetailThreadEntity({
        thread,
        threadComments,
        threadCommentReplies,
        userThreadCommentsLikes,
      }),
    };
  }
}

module.exports = GetDetailThreadUseCase;
