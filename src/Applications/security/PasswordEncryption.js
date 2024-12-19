class PasswordEncryption {
  async hash() {
    throw Error('APPLICATION.PASSWORD_ENCRYPTION.METHOD_NOT_IMPLEMENTED');
  }

  async compare() {
    throw Error('APPLICATION.PASSWORD_ENCRYPTION.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordEncryption;
