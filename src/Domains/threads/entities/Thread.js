class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, ownerId } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.ownerId = ownerId;
  }

  _verifyPayload(payload) {
    const payloadError = new Error('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { id, title, body, date, ownerId } = payload;

    if (!id || !title || !body || !date || !ownerId) {
      throw payloadError;
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof ownerId !== 'string'
    ) {
      throw payloadError;
    }

    if (
      id.match(/^\s*$/g) ||
      title.match(/^\s*$/g) ||
      body.match(/^\s*$/g) ||
      date.match(/^\s*$/g) ||
      ownerId.match(/^\s*$/g)
    ) {
      throw payloadError;
    }
  }
}

module.exports = Thread;
