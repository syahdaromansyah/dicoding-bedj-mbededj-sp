const UserThreadCommentLikesRepository = require('../UserThreadCommentLikesRepository');

describe('A UserThreadCommentLikesRepository Interface', () => {
  test('should throw an error when invoking an abstract method', async () => {
    // Arrange
    const userThdCmtLikesRepository = new UserThreadCommentLikesRepository();

    // Action & Assert
    await expect(() => userThdCmtLikesRepository.add()).rejects.toThrow(
      'DOMAIN.USER_THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() =>
      userThdCmtLikesRepository.getByThreadId(),
    ).rejects.toThrow(
      'DOMAIN.USER_THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => userThdCmtLikesRepository.isLiked()).rejects.toThrow(
      'DOMAIN.USER_THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => userThdCmtLikesRepository.delete()).rejects.toThrow(
      'DOMAIN.USER_THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
