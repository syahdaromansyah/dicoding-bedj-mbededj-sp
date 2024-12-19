const ClientError = require('../ClientError');

describe('A ClientError Exception', () => {
  test('should throw error when instantiate the abstract class', () => {
    expect(() => new ClientError('')).toThrow(
      'cannot instantiate the abstract class',
    );
  });
});
