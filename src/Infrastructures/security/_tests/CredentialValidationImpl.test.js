const UserEntity = require('../../../Domains/users/entities/User');
const UserProfileEntity = require('../../../Domains/users/entities/UserProfile');
const UsersRepository = require('../../../Domains/users/UsersRepository');
const PasswordEncryption = require('../../../Applications/security/PasswordEncryption');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthError = require('../../../Commons/exceptions/AuthError');
const CredentialValidationImpl = require('../CredentialValidationImpl');

describe('A CredentialValidationImpl Interface Implementation', () => {
  describe('Negative Tests', () => {
    test('should throw an error when a username is invalid', async () => {
      const usersRepository = new UsersRepository();

      usersRepository.getByUsername = jest.fn().mockRejectedValue();

      const credentialValidationImpl = new CredentialValidationImpl(
        usersRepository,
        {},
      );

      await expect(() =>
        credentialValidationImpl.validate('foobaz', ''),
      ).rejects.toThrow(InvariantError);

      await expect(() =>
        credentialValidationImpl.validate('foobaz', ''),
      ).rejects.toThrow('username or password is invalid');

      expect(usersRepository.getByUsername).toHaveBeenCalledTimes(2);
      expect(usersRepository.getByUsername).toHaveBeenCalledWith('foobaz');
    });

    test('should throw an error when a password is invalid', async () => {
      const usersRepository = new UsersRepository();

      usersRepository.getByUsername = jest.fn().mockResolvedValue(
        new UserEntity({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          password: 'enc_foobarpass',
          fullname: 'Foo Bar',
        }),
      );

      const passwordEncryption = new PasswordEncryption();

      passwordEncryption.compare = jest
        .fn()
        .mockRejectedValue('password is not matched');

      const credentialValidationImpl = new CredentialValidationImpl(
        usersRepository,
        passwordEncryption,
      );

      const dummyPayload = {
        username: 'foobar',
        password: 'foobarwrong',
      };

      await expect(() =>
        credentialValidationImpl.validate(
          dummyPayload.username,
          dummyPayload.password,
        ),
      ).rejects.toThrow(AuthError);

      await expect(() =>
        credentialValidationImpl.validate(
          dummyPayload.username,
          dummyPayload.password,
        ),
      ).rejects.toThrow('username or password is invalid');

      expect(usersRepository.getByUsername).toHaveBeenCalledTimes(2);

      expect(usersRepository.getByUsername).toHaveBeenCalledWith(
        dummyPayload.username,
      );

      expect(passwordEncryption.compare).toHaveBeenCalledTimes(2);

      expect(passwordEncryption.compare).toHaveBeenCalledWith(
        dummyPayload.password,
        'enc_foobarpass',
      );
    });
  });

  describe('Positive Tests', () => {
    test('should not throw an error when a credential is valid', async () => {
      const usersRepository = new UsersRepository();

      usersRepository.getByUsername = jest.fn().mockResolvedValue(
        new UserEntity({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          password: 'enc_foobarpass',
          fullname: 'Foo Bar',
        }),
      );

      const passwordEncryption = new PasswordEncryption();

      passwordEncryption.compare = jest.fn().mockResolvedValue();

      const credentialValidationImpl = new CredentialValidationImpl(
        usersRepository,
        passwordEncryption,
      );

      const dummyPayload = {
        username: 'foobar',
        password: 'foobarwrong',
      };

      await expect(
        credentialValidationImpl.validate(
          dummyPayload.username,
          dummyPayload.password,
        ),
      ).resolves.toStrictEqual(
        new UserProfileEntity({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          fullname: 'Foo Bar',
        }),
      );

      expect(usersRepository.getByUsername).toHaveBeenCalledTimes(1);

      expect(usersRepository.getByUsername).toHaveBeenCalledWith(
        dummyPayload.username,
      );

      expect(passwordEncryption.compare).toHaveBeenCalledTimes(1);

      expect(passwordEncryption.compare).toHaveBeenCalledWith(
        dummyPayload.password,
        'enc_foobarpass',
      );
    });
  });
});
