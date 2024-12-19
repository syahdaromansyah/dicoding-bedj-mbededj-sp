const UserProfileEntity = require('../../Domains/users/entities/UserProfile');
const UserRegistrationEntity = require('../../Domains/users/entities/UserRegistration');

class AddUserUseCase {
  constructor(usersRepository, passwordEncryption) {
    this._usersRepository = usersRepository;
    this._passwordEncryption = passwordEncryption;
  }

  async execute(payload) {
    const userRegistrationEntity = new UserRegistrationEntity(payload);

    await this._usersRepository.verifyUsernameCanBeUsed(
      userRegistrationEntity.username,
    );

    userRegistrationEntity.password = await this._passwordEncryption.hash(
      userRegistrationEntity.password,
    );

    const { password: _password, ...restUserData } =
      await this._usersRepository.add(userRegistrationEntity);

    return {
      addedUser: new UserProfileEntity({
        ...restUserData,
      }),
    };
  }
}

module.exports = AddUserUseCase;
