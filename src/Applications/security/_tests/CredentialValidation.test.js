const CredentialValidation = require('../CredentialValidation');

describe('A CredentialValidation Interface', () => {
  test('should throw an error when invoking an abstract method', async () => {
    const credentialValidation = new CredentialValidation();

    await expect(() => credentialValidation.validate()).rejects.toThrow(
      'APPLICATION.CREDENTIAL_VALIDATION.METHOD_NOT_IMPLEMENTED',
    );
  });
});
