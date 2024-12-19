const InvariantError = require('./InvariantError');

const ErrorsTranslator = {
  translate(error) {
    return ErrorsTranslator._directories[error.message] || error;
  },
};

ErrorsTranslator._directories = {
  'DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID': new InvariantError(
    'user registration payload fields specification is invalid',
  ),
  'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS':
    new InvariantError(
      'tidak dapat membuat user baru karena username mengandung karakter terlarang',
    ),
  'DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID': new InvariantError(
    'user credential payload fields specification is invalid',
  ),
  'DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID': new InvariantError(
    'thread payload fields specification is invalid',
  ),
  'DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID': new InvariantError(
    'thread comment payload fields specification is invalid',
  ),
  'DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID': new InvariantError(
    'thread comment reply payload fields specification is invalid',
  ),
  'APPLICATION.REFRESH_TOKEN_USE_CASE.PAYLOAD_INVALID': new InvariantError(
    'refresh token payload field specification is invalid',
  ),
  'APPLICATION.REFRESH_TOKEN_USE_CASE.REFRESH_TOKEN_INVALID':
    new InvariantError('refresh token tidak valid'),
  'APPLICATION.USER_LOGOUT_USE_CASE.PAYLOAD_INVALID': new InvariantError(
    'user logout is failed',
  ),
  'APPLICATION.USER_LOGOUT_USE_CASE.REFRESH_TOKEN_INVALID': new InvariantError(
    'refresh token tidak ditemukan di database',
  ),
};

module.exports = ErrorsTranslator;
