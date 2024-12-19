const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const ThreadCommentRepliesRepository = require('../../../Domains/threadCommentReplies/ThreadCommentRepliesRepository');
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');

describe('A DeleteThreadCommentReplyUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    threadsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentsRepository = new ThreadCommentsRepository();

    threadCommentsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentRepliesRepository = new ThreadCommentRepliesRepository();

    threadCommentRepliesRepository.checkExistenceById = jest
      .fn()
      .mockResolvedValue();

    threadCommentRepliesRepository.verifyOwner = jest.fn().mockResolvedValue();

    threadCommentRepliesRepository.deleteById = jest.fn().mockResolvedValue();

    const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase(
      {
        threadsRepository,
        threadCommentsRepository,
        threadCommentRepliesRepository,
      },
    );

    // Action & Assert
    await expect(
      deleteThreadCommentReplyUseCase.execute(
        'user-abc',
        'thread-1',
        'comment-1',
        'reply-1',
      ),
    ).resolves.toBeUndefined();

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledTimes(1);

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledWith(
      'thread-1',
    );

    expect(threadCommentsRepository.checkExistenceById).toHaveBeenCalledTimes(
      1,
    );

    expect(threadCommentsRepository.checkExistenceById).toHaveBeenCalledWith(
      'comment-1',
    );

    expect(
      threadCommentRepliesRepository.checkExistenceById,
    ).toHaveBeenCalledTimes(1);

    expect(
      threadCommentRepliesRepository.checkExistenceById,
    ).toHaveBeenCalledWith('reply-1');

    expect(threadCommentRepliesRepository.verifyOwner).toHaveBeenCalledTimes(1);

    expect(threadCommentRepliesRepository.verifyOwner).toHaveBeenCalledWith(
      'user-abc',
      'reply-1',
    );

    expect(threadCommentRepliesRepository.deleteById).toHaveBeenCalledTimes(1);

    expect(threadCommentRepliesRepository.deleteById).toHaveBeenCalledWith(
      'reply-1',
    );
  });
});
