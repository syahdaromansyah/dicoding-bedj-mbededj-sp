const ClientError = require('../ClientError');
const AuthError = require('../AuthError');

describe('An AuthError Exception', () => {
  test('should successfully instantiate the error instance', () => {
    expect(() => new AuthError('a not found error occurs')).not.toThrow();

    const authError = new AuthError('an auth error occurs');

    expect(authError).toBeInstanceOf(AuthError);
    expect(authError).toBeInstanceOf(ClientError);
    expect(authError).toBeInstanceOf(Error);

    expect(authError.statusCode).toBe(401);
    expect(authError.message).toBe('an auth error occurs');
    expect(authError.name).toBe('AuthError');
  });
});
