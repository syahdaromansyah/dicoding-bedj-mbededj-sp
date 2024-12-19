const { nanoid } = require('nanoid');
const IdGeneratorImpl = require('../IdGeneratorImpl');

describe('An IdGeneratorImpl Interface Implementation', () => {
  test('should return a generated string id', () => {
    // Arrange
    const mockedIdGen = jest.fn((size) => nanoid(size));

    const idGeneratorImpl = new IdGeneratorImpl(mockedIdGen);

    // Action & Assert
    expect(typeof idGeneratorImpl.generate(24)).toBe('string');

    expect(mockedIdGen).toHaveBeenCalledTimes(1);

    expect(mockedIdGen).toHaveBeenCalledWith(24);
  });

  test.each([
    {
      idLength: 24,
      expected: 24,
    },
    {
      idLength: 32,
      expected: 32,
    },
  ])(
    'should return a correct generated id total length',
    ({ idLength, expected }) => {
      // Arrange
      const mockedIdGen = jest.fn((size) => nanoid(size));

      const idGeneratorImpl = new IdGeneratorImpl(mockedIdGen);

      // Action & Assert
      expect(idGeneratorImpl.generate(idLength)).toHaveLength(expected);

      expect(mockedIdGen).toHaveBeenCalledTimes(1);

      expect(mockedIdGen).toHaveBeenCalledWith(expected);
    },
  );
});
