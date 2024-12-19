class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyPayload(payload) {
    const payloadError = new Error('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID');

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { title, body } = payload;

    if (!title || !body) {
      throw payloadError;
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw payloadError;
    }

    if (title.match(/^\s*$/g) || body.match(/^\s*$/g)) {
      throw payloadError;
    }
  }
}

module.exports = NewThread;
