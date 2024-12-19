const ThreadCommentReplyEntity = require('../../../Domains/threadCommentReplies/entities/ThreadCommentReply');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const ThreadCommentRepliesRepository = require('../../../Domains/threadCommentReplies/ThreadCommentRepliesRepository');
const AddThreadCommentReplyUseCase = require('../AddThreadCommentReplyUseCase');

describe('An AddThreadCommentReplyUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    threadsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentsRepository = new ThreadCommentsRepository();

    threadCommentsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentRepliesRepository = new ThreadCommentRepliesRepository();

    threadCommentRepliesRepository.add = jest.fn().mockResolvedValue(
      new ThreadCommentReplyEntity({
        id: 'reply-1',
        content: 'Reply content',
        threadCommentId: 'comment-1',
        date: new Date().toISOString(),
        isDelete: false,
        ownerId: 'user-abc',
      }),
    );

    const addThreadCommentUseCase = new AddThreadCommentReplyUseCase({
      threadsRepository,
      threadCommentsRepository,
      threadCommentRepliesRepository,
    });

    // Action & Assert
    await expect(
      addThreadCommentUseCase.execute('user-abc', 'thread-1', 'comment-1', {
        content: 'Reply content',
      }),
    ).resolves.toStrictEqual({
      addedReply: {
        id: 'reply-1',
        content: 'Reply content',
        owner: 'user-abc',
      },
    });

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

    expect(threadCommentRepliesRepository.add).toHaveBeenCalledTimes(1);

    expect(threadCommentRepliesRepository.add).toHaveBeenCalledWith(
      'user-abc',
      'comment-1',
      {
        content: 'Reply content',
      },
    );
  });
});
