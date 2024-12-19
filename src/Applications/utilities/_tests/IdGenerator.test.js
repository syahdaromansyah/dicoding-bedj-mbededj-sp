const IdGenerator = require('../IdGenerator');

describe('An IdGenerator Interface', () => {
  test('should throw an error when invoking an abstract method', () => {
    // Arrange
    const idGenerator = new IdGenerator();

    // Action & Assert
    expect(() => idGenerator.generate()).toThrow(
      'APPLICATION.ID_GENERATOR.METHOD_NOT_IMPLEMENTED',
    );
  });
});
