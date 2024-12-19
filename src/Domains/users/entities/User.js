class User {
  constructor(payload) {
    this._verify(payload);

    const { id, username, password, fullname } = payload;

    this.id = id;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verify(payload) {
    const payloadError = new Error('DOMAIN.ENTITY.USER.PAYLOAD_INVALID');

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { id, username, password, fullname } = payload;

    if (!id || !username || !password || !fullname) {
      throw payloadError;
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw payloadError;
    }

    if (!id.match(/^user-.{30}$/g)) {
      throw payloadError;
    }

    if (!username.match(/^[a-z_\d]{3,64}$/g)) {
      throw payloadError;
    }

    if (!fullname.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/g)) {
      throw payloadError;
    }
  }
}

module.exports = User;
