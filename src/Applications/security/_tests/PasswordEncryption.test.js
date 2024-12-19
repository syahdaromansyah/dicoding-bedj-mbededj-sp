const PasswordEncryption = require('../PasswordEncryption');

describe('A PasswordEncryption Interface', () => {
  test('should throw error when invoking an abstract method', async () => {
    const passwordEncryption = new PasswordEncryption();

    await expect(() => passwordEncryption.hash()).rejects.toThrow(
      'APPLICATION.PASSWORD_ENCRYPTION.METHOD_NOT_IMPLEMENTED',
    );

    await expect(() => passwordEncryption.compare()).rejects.toThrow(
      'APPLICATION.PASSWORD_ENCRYPTION.METHOD_NOT_IMPLEMENTED',
    );
  });
});
