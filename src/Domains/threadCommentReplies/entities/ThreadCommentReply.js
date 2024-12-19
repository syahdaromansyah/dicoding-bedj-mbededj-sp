class ThreadCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, threadCommentId, date, isDelete, ownerId } = payload;

    this.id = id;
    this.content = content;
    this.threadCommentId = threadCommentId;
    this.date = date;
    this.isDelete = isDelete;
    this.ownerId = ownerId;
  }

  _verifyPayload(payload) {
    const payloadError = new Error(
      'DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { id, content, threadCommentId, date, isDelete, ownerId } = payload;

    if (!id || !content || !threadCommentId || !date || !ownerId) {
      throw payloadError;
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof threadCommentId !== 'string' ||
      typeof date !== 'string' ||
      typeof isDelete !== 'boolean' ||
      typeof ownerId !== 'string'
    ) {
      throw payloadError;
    }

    if (
      id.match(/^\s*$/g) ||
      content.match(/^\s*$/g) ||
      threadCommentId.match(/^\s*$/g) ||
      date.match(/^\s*$/g) ||
      ownerId.match(/^\s*$/g)
    ) {
      throw payloadError;
    }
  }
}

module.exports = ThreadCommentReply;
