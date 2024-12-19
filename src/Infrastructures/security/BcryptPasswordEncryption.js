const PasswordEncryption = require('../../Applications/security/PasswordEncryption');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class BcryptPasswordEncryption extends PasswordEncryption {
  constructor(bcrypt) {
    super();

    this._bcrypt = bcrypt;
  }

  async hash(password, saltRounds = 10) {
    return this._bcrypt.hash(password, saltRounds);
  }

  async compare(password, encPassword) {
    const isMatched = await this._bcrypt.compare(password, encPassword);

    if (!isMatched) {
      throw new InvariantError('password is not matched');
    }
  }
}

module.exports = BcryptPasswordEncryption;
