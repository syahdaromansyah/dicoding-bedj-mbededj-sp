const ThreadEntity = require('../../../Domains/threads/entities/Thread');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('An AddThreadUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    threadsRepository.add = jest.fn().mockResolvedValue(
      new ThreadEntity({
        id: 'thread-1',
        title: 'Title Thread',
        body: 'Body thread',
        date: new Date().toISOString(),
        ownerId: 'user-xyz',
      }),
    );

    const addThreadUseCase = new AddThreadUseCase(threadsRepository);

    // Action & Assert
    await expect(
      addThreadUseCase.execute('user-xyz', {
        title: 'Title Thread',
        body: 'Body thread',
      }),
    ).resolves.toStrictEqual({
      addedThread: {
        id: 'thread-1',
        title: 'Title Thread',
        owner: 'user-xyz',
      },
    });

    expect(threadsRepository.add).toHaveBeenCalledTimes(1);

    expect(threadsRepository.add).toHaveBeenCalledWith('user-xyz', {
      title: 'Title Thread',
      body: 'Body thread',
    });
  });
});
