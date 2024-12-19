const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('A DeleteThreadCommentUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    threadsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    const threadCommentsRepository = new ThreadCommentsRepository();

    threadCommentsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    threadCommentsRepository.verifyOwner = jest.fn().mockResolvedValue();

    threadCommentsRepository.deleteById = jest.fn().mockResolvedValue();

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase(
      threadsRepository,
      threadCommentsRepository,
    );

    // Action & Assert
    await expect(
      deleteThreadCommentUseCase.execute('user-abc', 'thread-1', 'comment-1'),
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

    expect(threadCommentsRepository.verifyOwner).toHaveBeenCalledTimes(1);

    expect(threadCommentsRepository.verifyOwner).toHaveBeenCalledWith(
      'user-abc',
      'comment-1',
    );

    expect(threadCommentsRepository.deleteById).toHaveBeenCalledTimes(1);

    expect(threadCommentsRepository.deleteById).toHaveBeenCalledWith(
      'comment-1',
    );
  });
});
