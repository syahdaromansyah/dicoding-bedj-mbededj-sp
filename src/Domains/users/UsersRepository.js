class UserRepository {
  async add() {
    throw new Error('DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getById() {
    throw new Error('DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getByUsername() {
    throw new Error('DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyUsernameCanBeUsed() {
    throw new Error('DOMAIN.USERS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
