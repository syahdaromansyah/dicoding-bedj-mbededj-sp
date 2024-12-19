const NewThreadEntity = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor(threadsRepository) {
    this._threadsRepository = threadsRepository;
  }

  async execute(ownerId, payload) {
    const newThread = new NewThreadEntity(payload);

    const addedThread = await this._threadsRepository.add(ownerId, newThread);

    return {
      addedThread: {
        id: addedThread.id,
        title: addedThread.title,
        owner: addedThread.ownerId,
      },
    };
  }
}

module.exports = AddThreadUseCase;
