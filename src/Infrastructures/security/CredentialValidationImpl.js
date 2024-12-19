const UserProfileEntity = require('../../Domains/users/entities/UserProfile');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthError = require('../../Commons/exceptions/AuthError');
const CredentialValidation = require('../../Applications/security/CredentialValidation');

class CredentialValidationImpl extends CredentialValidation {
  constructor(usersRepository, passwordEncryption) {
    super();

    this._usersRepository = usersRepository;
    this._passwordEncryption = passwordEncryption;
  }

  async validate(username, password) {
    const userData = await this._validateUsername(username);

    await this._validatePassword(password, userData.password);

    return new UserProfileEntity({
      id: userData.id,
      username: userData.username,
      fullname: userData.fullname,
    });
  }

  async _validateUsername(username) {
    try {
      return await this._usersRepository.getByUsername(username);
    } catch (_) {
      throw new InvariantError('username or password is invalid');
    }
  }

  async _validatePassword(password, encPassword) {
    try {
      await this._passwordEncryption.compare(password, encPassword);
    } catch (_) {
      throw new AuthError('username or password is invalid');
    }
  }
}

module.exports = CredentialValidationImpl;
