class UserProfile {
  constructor(payload) {
    this._verify(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  _verify(payload) {
    const payloadError = new Error(
      'DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID',
    );

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw payloadError;
    }

    const { id, username, fullname } = payload;

    if (!id || !username || !fullname) {
      throw payloadError;
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
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

module.exports = UserProfile;
