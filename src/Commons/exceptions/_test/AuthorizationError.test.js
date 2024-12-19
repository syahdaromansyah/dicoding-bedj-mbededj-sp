const ClientError = require('../ClientError');
const AuthorizationError = require('../AuthorizationError');

describe('An AuthError Exception', () => {
  test('should successfully instantiate the error instance', () => {
    expect(
      () => new AuthorizationError('a not found error occurs'),
    ).not.toThrow();

    const authError = new AuthorizationError('an authorization error occurs');

    expect(authError).toBeInstanceOf(AuthorizationError);
    expect(authError).toBeInstanceOf(ClientError);
    expect(authError).toBeInstanceOf(Error);

    expect(authError.statusCode).toBe(403);
    expect(authError.message).toBe('an authorization error occurs');
    expect(authError.name).toBe('AuthorizationError');
  });
});
