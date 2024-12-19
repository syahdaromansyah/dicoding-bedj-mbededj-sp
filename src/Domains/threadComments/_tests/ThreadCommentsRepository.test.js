const ThreadCommentsRepository = require('../ThreadCommentsRepository');

describe('A ThreadCommentsRepository Interface', () => {
  test('should throw an error when invoking an abstract method', async () => {
    // Arrange
    const threadCommentsRepository = new ThreadCommentsRepository();

    // Action & Assert
    await expect(threadCommentsRepository.add()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(
      threadCommentsRepository.getManyWithUsernameByThreadId(),
    ).rejects.toThrow('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');

    await expect(threadCommentsRepository.checkExistenceById()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(threadCommentsRepository.verifyOwner()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(threadCommentsRepository.deleteById()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED',
    );
  });
});
