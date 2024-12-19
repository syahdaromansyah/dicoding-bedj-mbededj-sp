class UserCredential {
  constructor(payload) {
    this._verify(payload);

    const { username, password } = payload;

    this.username = username;
    this.password = password;
  }

  _verify(payload) {
    const payloadError = new Error(
      'DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { username, password } = payload;

    if (!username || !password) {
      throw payloadError;
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw payloadError;
    }
  }
}

module.exports = UserCredential;
