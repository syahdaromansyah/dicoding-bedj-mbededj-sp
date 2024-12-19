const ThreadsRepository = require('../ThreadsRepository');

describe('A ThreadsRepository Interface', () => {
  test('should throw an error when invoking an abstract method', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    // Action & Assert
    await expect(() => threadsRepository.add()).rejects.toThrow(
      'DOMAIN.THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => threadsRepository.getById()).rejects.toThrow(
      'DOMAIN.THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => threadsRepository.getWithUsernameById()).rejects.toThrow(
      'DOMAIN.THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => threadsRepository.checkExistenceById()).rejects.toThrow(
      'DOMAIN.THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
