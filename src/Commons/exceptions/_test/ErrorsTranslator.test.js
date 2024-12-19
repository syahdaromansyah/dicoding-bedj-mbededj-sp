const ErrorsTranslator = require('../ErrorsTranslator');
const InvariantError = require('../InvariantError');

describe('A DomainErrorsTranslator', () => {
  test('should translates error correctly', () => {
    expect(
      ErrorsTranslator.translate(
        new Error('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'user registration payload fields specification is invalid',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error(
          'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS',
        ),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'user credential payload fields specification is invalid',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError('thread payload fields specification is invalid'),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'thread comment payload fields specification is invalid',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'thread comment reply payload fields specification is invalid',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('APPLICATION.REFRESH_TOKEN_USE_CASE.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'refresh token payload field specification is invalid',
      ),
    );

    expect(
      ErrorsTranslator.translate(
        new Error('APPLICATION.REFRESH_TOKEN_USE_CASE.REFRESH_TOKEN_INVALID'),
      ),
    ).toStrictEqual(new InvariantError('refresh token tidak valid'));

    expect(
      ErrorsTranslator.translate(
        new Error('APPLICATION.USER_LOGOUT_USE_CASE.PAYLOAD_INVALID'),
      ),
    ).toStrictEqual(new InvariantError('user logout is failed'));

    expect(
      ErrorsTranslator.translate(
        new Error('APPLICATION.USER_LOGOUT_USE_CASE.REFRESH_TOKEN_INVALID'),
      ),
    ).toStrictEqual(
      new InvariantError('refresh token tidak ditemukan di database'),
    );
  });

  test('should not translates an unnecessary error message', () => {
    const basicError = new Error('a basic error');

    expect(ErrorsTranslator.translate(basicError)).toStrictEqual(basicError);
  });
});
