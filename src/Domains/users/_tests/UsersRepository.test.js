const UserRepository = require('../UsersRepository');

describe('A UserRepository Interface', () => {
  test('should throw error when invoking the abstract method', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action & Assert
    await expect(() => userRepository.add()).rejects.toThrow(
      'DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => userRepository.getById()).rejects.toThrow(
      'DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => userRepository.getByUsername()).rejects.toThrow(
      'DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() =>
      userRepository.verifyUsernameCanBeUsed(),
    ).rejects.toThrow('DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
