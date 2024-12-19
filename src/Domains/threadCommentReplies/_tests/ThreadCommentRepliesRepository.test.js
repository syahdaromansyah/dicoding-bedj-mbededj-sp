const ThreadCommentRepliesRepository = require('../ThreadCommentRepliesRepository');

describe('A ThreadCommentRepliesRepository Interface', () => {
  test('should throw an error when invoking an abstract error', async () => {
    // Arrange
    const threadCommentRepliesRepository = new ThreadCommentRepliesRepository();

    // Action & Assert
    await expect(threadCommentRepliesRepository.add()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(
      threadCommentRepliesRepository.getManyWithUsernameByThreadId(),
    ).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(
      threadCommentRepliesRepository.checkExistenceById(),
    ).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(threadCommentRepliesRepository.verifyOwner()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_ALLOWED',
    );

    await expect(threadCommentRepliesRepository.deleteById()).rejects.toThrow(
      'DOMAIN.THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_ALLOWED',
    );
  });
});
