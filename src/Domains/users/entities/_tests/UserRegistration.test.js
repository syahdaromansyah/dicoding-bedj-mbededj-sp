const UserRegistrationEntity = require('../UserRegistration');

describe('A UserRegistration Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new UserRegistrationEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID',
          );
        },
      );

      describe('payload Fields', () => {
        test.each([
          {
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
          {
            username: 'foobar',
            fullname: 'Foo Bar',
          },
          {
            username: 'foobar',
            password: 'foobarpass',
          },
        ])(
          'should throw an error when fields are incomplete',
          (dummyPayload) => {
            expect(() => new UserRegistrationEntity(dummyPayload)).toThrow(
              'DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID',
            );
          },
        );

        test.each(['username', 'password', 'fullname'])(
          'should throw an error when string fields have invalid data type',
          (fieldKey) => {
            const nonStringValues = [
              1,
              null,
              undefined,
              false,
              true,
              [],
              {},
              () => {},
            ];

            nonStringValues.forEach((e) => {
              const dummyPayload = {
                username: 'foobar',
                password: 'foobarpass',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserRegistrationEntity({
                    ...dummyPayload,
                    [fieldKey]: e,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID');
            });
          },
        );

        describe('A username Field', () => {
          test('should throw an error when it contains whitespace chars', () => {
            const dummyPayload = {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserRegistrationEntity({
                  ...dummyPayload,
                  username: 'foo bar',
                }),
            ).toThrow(
              'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS',
            );
          });

          test('should throw an error when it contains restricted chars', () => {
            const dummyPayload = {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserRegistrationEntity({
                  ...dummyPayload,
                  username: 'foo@bar',
                }),
            ).toThrow(
              'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS',
            );
          });

          test('should throw an error when it contains uppercase letters', () => {
            const dummyPayload = {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserRegistrationEntity({
                  ...dummyPayload,
                  username: 'FooBar',
                }),
            ).toThrow(
              'DOMAIN.ENTITY.USER_REGISTRATION.RESTRICTED_PAYLOAD_FIELD_CHARS',
            );
          });

          test('should throw an error when it contains less than 3 chars', () => {
            const dummyPayload = {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserRegistrationEntity({
                  ...dummyPayload,
                  username: 'fo',
                }),
            ).toThrow('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID');
          });

          test('should throw an error when it contains more than 64 chars', () => {
            const dummyPayload = {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserRegistrationEntity({
                  ...dummyPayload,
                  username: `${'foobar45'.repeat(8)}x`,
                }),
            ).toThrow('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID');
          });
        });

        describe('A fullname Field', () => {
          test.each([
            ' Foo',
            'Foo ',
            ' Foo ',
            ' Foo Bar',
            'Foo Bar ',
            ' Foo Bar ',
          ])(
            'should throw an error when it contains whitespace at the start and or the end of a string',
            (dummyFullname) => {
              const dummyPayload = {
                username: 'foobar',
                password: 'foobarpass',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserRegistrationEntity({
                    ...dummyPayload,
                    fullname: dummyFullname,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID');
            },
          );

          test.each(['foo', 'foo bar', 'Foo bar'])(
            'should throw an error when each word not started with capital letter',
            (dummyFullname) => {
              const dummyPayload = {
                username: 'foobar',
                password: 'foobarpass',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserRegistrationEntity({
                    ...dummyPayload,
                    fullname: dummyFullname,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_REGISTRATION.PAYLOAD_INVALID');
            },
          );
        });
      });
    });
  });

  describe('Positive Tests', () => {
    describe('Payload Fields', () => {
      test('should successfully instantiate when payload fields are valid', () => {
        expect(
          new UserRegistrationEntity({
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          }),
        ).toEqual({
          username: 'foobar',
          password: 'foobarpass',
          fullname: 'Foo Bar',
        });
      });
    });
  });
});
