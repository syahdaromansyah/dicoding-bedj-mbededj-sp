class NewThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload(payload) {
    const payloadError = new Error(
      'DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { content } = payload;

    if (!content) {
      throw payloadError;
    }

    if (typeof content !== 'string') {
      throw payloadError;
    }

    if (content.match(/^\s*$/g)) {
      throw payloadError;
    }
  }
}

module.exports = NewThreadComment;
