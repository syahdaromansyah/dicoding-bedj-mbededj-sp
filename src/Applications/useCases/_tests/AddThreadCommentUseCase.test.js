const ThreadCommentEntity = require('../../../Domains/threadComments/entities/ThreadComment');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('An AddThreadCommentUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    threadsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentsRepository = new ThreadCommentsRepository();

    threadCommentsRepository.add = jest.fn().mockResolvedValue(
      new ThreadCommentEntity({
        id: 'comment-1',
        content: 'Comment content',
        threadId: 'thread-1',
        date: new Date().toISOString(),
        isDelete: false,
        ownerId: 'user-abc',
      }),
    );

    const addThreadCommentUseCase = new AddThreadCommentUseCase(
      threadsRepository,
      threadCommentsRepository,
    );

    // Action & Assert
    await expect(
      addThreadCommentUseCase.execute('user-abc', 'thread-1', {
        content: 'Comment content',
      }),
    ).resolves.toStrictEqual({
      addedComment: {
        id: 'comment-1',
        content: 'Comment content',
        owner: 'user-abc',
      },
    });

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledTimes(1);

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledWith(
      'thread-1',
    );

    expect(threadCommentsRepository.add).toHaveBeenCalledTimes(1);

    expect(threadCommentsRepository.add).toHaveBeenCalledWith(
      'user-abc',
      'thread-1',
      {
        content: 'Comment content',
      },
    );
  });
});
