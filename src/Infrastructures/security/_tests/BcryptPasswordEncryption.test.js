const bcrypt = require('bcrypt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const BcryptPasswordEncryption = require('../BcryptPasswordEncryption');

describe('A BcryptPasswordEncryption Interface Implementation', () => {
  describe('Negative Tests', () => {
    describe('A .compare Method', () => {
      test('should throw an error when password is not matched', async () => {
        const spiedCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockResolvedValue(false);

        const bcryptPasswordEncryption = new BcryptPasswordEncryption(bcrypt);

        await expect(() =>
          bcryptPasswordEncryption.compare('foobarpasswrong', 'enc_foobarpass'),
        ).rejects.toThrow(InvariantError);

        await expect(() =>
          bcryptPasswordEncryption.compare('foobarpasswrong', 'enc_foobarpass'),
        ).rejects.toThrow('password is not matched');

        expect(spiedCompare).toHaveBeenCalledTimes(2);

        expect(spiedCompare).toHaveBeenCalledWith(
          'foobarpasswrong',
          'enc_foobarpass',
        );
      });
    });
  });

  describe('Positive Tests', () => {
    describe('A .hash Method', () => {
      test('should return a hashed password', async () => {
        const spiedHash = jest
          .spyOn(bcrypt, 'hash')
          .mockResolvedValueOnce('enc_foobarpass');

        const bcryptPasswordEncryption = new BcryptPasswordEncryption(bcrypt);

        await expect(
          bcryptPasswordEncryption.hash('foobarpass', 12),
        ).resolves.toBe('enc_foobarpass');

        expect(spiedHash).toHaveBeenCalledTimes(1);
        expect(spiedHash).toHaveBeenCalledWith('foobarpass', 12);
      });
    });

    describe('A .compare Method', () => {
      test('should not throw an error when password is matched', async () => {
        const spiedCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockResolvedValue(true);

        const bcryptPasswordEncryption = new BcryptPasswordEncryption(bcrypt);

        await expect(
          bcryptPasswordEncryption.compare('foobarpasswrong', 'enc_foobarpass'),
        ).resolves.not.toThrow(InvariantError);

        await expect(
          bcryptPasswordEncryption.compare('foobarpasswrong', 'enc_foobarpass'),
        ).resolves.not.toThrow('password is not matched');

        expect(spiedCompare).toHaveBeenCalledTimes(2);

        expect(spiedCompare).toHaveBeenCalledWith(
          'foobarpasswrong',
          'enc_foobarpass',
        );
      });
    });
  });
});
