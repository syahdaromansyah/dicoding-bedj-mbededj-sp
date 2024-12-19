const ClientError = require('../ClientError');
const InvariantError = require('../InvariantError');

describe('An InvariantError Exception', () => {
  test('should successfully instantiate the error instance', () => {
    expect(() => new InvariantError('a not found error occurs')).not.toThrow();

    const invariantError = new InvariantError('an invariant error occurs');

    expect(invariantError).toBeInstanceOf(InvariantError);
    expect(invariantError).toBeInstanceOf(ClientError);
    expect(invariantError).toBeInstanceOf(Error);

    expect(invariantError.statusCode).toBe(400);
    expect(invariantError.message).toBe('an invariant error occurs');
    expect(invariantError.name).toBe('InvariantError');
  });
});
