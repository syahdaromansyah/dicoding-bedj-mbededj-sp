const ClientError = require('../ClientError');
const NotFoundError = require('../NotFoundError');

describe('An NotFoundError Exception', () => {
  test('should successfully instantiate the error instance', () => {
    expect(() => new NotFoundError('a not found error occurs')).not.toThrow();

    const notFoundError = new NotFoundError('a not found error occurs');

    expect(notFoundError).toBeInstanceOf(NotFoundError);
    expect(notFoundError).toBeInstanceOf(ClientError);
    expect(notFoundError).toBeInstanceOf(Error);

    expect(notFoundError.statusCode).toBe(404);
    expect(notFoundError.message).toBe('a not found error occurs');
    expect(notFoundError.name).toBe('NotFoundError');
  });
});
