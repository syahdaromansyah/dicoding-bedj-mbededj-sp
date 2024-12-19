const DatetimeImpl = require('../DatetimeImpl');

describe('A DatetimeImpl Interface Implementation', () => {
  test('should be instances of Date constructor', () => {
    // Arrange
    const datetimeImpl = new DatetimeImpl(Date);

    // Action & Assert
    expect(datetimeImpl.now()).toBeInstanceOf(Date);
  });
});
