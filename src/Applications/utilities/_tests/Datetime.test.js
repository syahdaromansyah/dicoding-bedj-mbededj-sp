const Datetime = require('../Datetime');

describe('A Datetime Interface', () => {
  test('should throw an error when invoking an abstract method', () => {
    // Arrange
    const datetime = new Datetime();

    // Action & Assert
    expect(() => datetime.now()).toThrow(
      'APPLICATION.DATETIME.METHOD_NOT_IMPLEMENTED',
    );
  });
});
