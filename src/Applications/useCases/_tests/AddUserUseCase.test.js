const UserRegistrationEntity = require('../../../Domains/users/entities/UserRegistration');
const UserProfileEntity = require('../../../Domains/users/entities/UserProfile');
const UsersRepository = require('../../../Domains/users/UsersRepository');
const PasswordEncryption = require('../../security/PasswordEncryption');
const AddUserUseCase = require('../AddUserUseCase');

describe('An AddUserUseCase Use Case', () => {
  test('should orchestrate a use case action correctly', async () => {
    // Arrange
    const usersRepository = new UsersRepository();

    usersRepository.verifyUsernameCanBeUsed = jest.fn().mockResolvedValue();

    usersRepository.add = jest.fn().mockResolvedValue(
      new UserProfileEntity({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        fullname: 'Foo Bar',
      }),
    );

    const passwordEncryption = new PasswordEncryption();

    passwordEncryption.hash = jest.fn().mockResolvedValue('enc_foobarpwd');

    const addUserUseCase = new AddUserUseCase(
      usersRepository,
      passwordEncryption,
    );

    // Action & Assert
    await expect(
      addUserUseCase.execute({
        username: 'foobar',
        password: 'foobarpwd',
        fullname: 'Foo Bar',
      }),
    ).resolves.toStrictEqual({
      addedUser: new UserProfileEntity({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        fullname: 'Foo Bar',
      }),
    });

    expect(passwordEncryption.hash).toHaveBeenCalledTimes(1);

    expect(passwordEncryption.hash).toHaveBeenCalledWith('foobarpwd');

    expect(usersRepository.verifyUsernameCanBeUsed).toHaveBeenCalledTimes(1);

    expect(usersRepository.verifyUsernameCanBeUsed).toHaveBeenCalledWith(
      'foobar',
    );

    expect(usersRepository.add).toHaveBeenCalledTimes(1);

    expect(usersRepository.add).toHaveBeenCalledWith(
      new UserRegistrationEntity({
        username: 'foobar',
        password: 'enc_foobarpwd',
        fullname: 'Foo Bar',
      }),
    );
  });
});
