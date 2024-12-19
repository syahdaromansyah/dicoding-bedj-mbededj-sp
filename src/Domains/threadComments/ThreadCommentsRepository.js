class ThreadCommentsRepository {
  async add() {
    throw new Error('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');
  }

  async getManyWithUsernameByThreadId() {
    throw new Error('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');
  }

  async checkExistenceById() {
    throw new Error('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');
  }

  async verifyOwner() {
    throw new Error('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');
  }

  async deleteById() {
    throw new Error('DOMAIN.THREAD_COMMENT_REPOSITORY.METHOD_NOT_ALLOWED');
  }
}

module.exports = ThreadCommentsRepository;
