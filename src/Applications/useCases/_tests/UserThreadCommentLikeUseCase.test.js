const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const UserThreadCommentLikesRepository = require('../../../Domains/userThreadCommentLikes/UserThreadCommentLikesRepository');
const UserThreadCommentLikeUseCase = require('../UserThreadCommentLikeUseCase');

describe('A UserThreadCommentLikeUseCase Use Case', () => {
  describe('A User Like Comment Scenario', () => {
    test('should orchestrate an use case action correctly', async () => {
      // Arrange
      const threadsRepository = new ThreadsRepository();

      threadsRepository.checkExistenceById = jest.fn().mockResolvedValueOnce();

      const threadCommentsRepository = new ThreadCommentsRepository();

      threadCommentsRepository.checkExistenceById = jest
        .fn()
        .mockResolvedValueOnce();

      const userThreadCommentLikesRepository =
        new UserThreadCommentLikesRepository();

      userThreadCommentLikesRepository.isLiked = jest
        .fn()
        .mockResolvedValueOnce(false);

      userThreadCommentLikesRepository.add = jest.fn().mockResolvedValueOnce();

      userThreadCommentLikesRepository.delete = jest.fn();

      const userThreadCommentLikeUseCase = new UserThreadCommentLikeUseCase({
        threadsRepository,
        threadCommentsRepository,
        userThreadCommentLikesRepository,
      });

      // Action & Assert
      await expect(
        userThreadCommentLikeUseCase.execute(
          'user-xyz',
          'thread-1',
          'comment-1',
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

      expect(userThreadCommentLikesRepository.isLiked).toHaveBeenCalledTimes(1);

      expect(userThreadCommentLikesRepository.isLiked).toHaveBeenCalledWith(
        'user-xyz',
        'comment-1',
      );

      expect(userThreadCommentLikesRepository.add).toHaveBeenCalledTimes(1);

      expect(userThreadCommentLikesRepository.add).toHaveBeenCalledWith(
        'user-xyz',
        'comment-1',
      );

      expect(userThreadCommentLikesRepository.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('A User Cancel Like Comment Scenario', () => {
    test('should orchestrate an use case action correctly', async () => {
      // Arrange
      const threadsRepository = new ThreadsRepository();

      threadsRepository.checkExistenceById = jest.fn().mockResolvedValueOnce();

      const threadCommentsRepository = new ThreadCommentsRepository();

      threadCommentsRepository.checkExistenceById = jest
        .fn()
        .mockResolvedValueOnce();

      const userThreadCommentLikesRepository =
        new UserThreadCommentLikesRepository();

      userThreadCommentLikesRepository.isLiked = jest
        .fn()
        .mockResolvedValueOnce(true);

      userThreadCommentLikesRepository.add = jest.fn();

      userThreadCommentLikesRepository.delete = jest
        .fn()
        .mockResolvedValueOnce();

      const userThreadCommentLikeUseCase = new UserThreadCommentLikeUseCase({
        threadsRepository,
        threadCommentsRepository,
        userThreadCommentLikesRepository,
      });

      // Action & Assert
      await expect(
        userThreadCommentLikeUseCase.execute(
          'user-xyz',
          'thread-1',
          'comment-1',
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

      expect(userThreadCommentLikesRepository.isLiked).toHaveBeenCalledTimes(1);

      expect(userThreadCommentLikesRepository.isLiked).toHaveBeenCalledWith(
        'user-xyz',
        'comment-1',
      );

      expect(userThreadCommentLikesRepository.add).toHaveBeenCalledTimes(0);

      expect(userThreadCommentLikesRepository.delete).toHaveBeenCalledTimes(1);

      expect(userThreadCommentLikesRepository.delete).toHaveBeenCalledWith(
        'user-xyz',
        'comment-1',
      );
    });
  });
});
