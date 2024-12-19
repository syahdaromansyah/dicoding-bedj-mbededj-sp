class UserRegistration {
  constructor(payload) {
    this._verify(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verify(payload) {
    const payloadError = new Error(
      'DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { username, password, fullname } = payload;

    if (!username || !password || !fullname) {
      throw payloadError;
    }

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw payloadError;
    }

    if (!username.match(/^[a-z_\d]*$/g)) {
      throw new Error(
        'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS',
      );
    }

    if (username.length < 3 || username.length > 64) {
      throw payloadError;
    }

    if (!fullname.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/g)) {
      throw payloadError;
    }
  }
}

module.exports = UserRegistration;
