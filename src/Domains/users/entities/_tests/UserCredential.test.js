const UserCredentialEntity = require('../UserCredential');

describe('A UserCredential Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new UserCredentialEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID',
          );
        },
      );

      describe('payload Fields', () => {
        test.each([
          {
            password: 'foobarpass',
          },
          {
            username: 'foobar',
          },
        ])(
          'should throw an error when fields are incomplete',
          (dummyPayload) => {
            expect(() => new UserCredentialEntity(dummyPayload)).toThrow(
              'DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID',
            );
          },
        );

        test.each(['username', 'password'])(
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
              };

              expect(
                () =>
                  new UserCredentialEntity({
                    ...dummyPayload,
                    [fieldKey]: e,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_CREDENTIAL.PAYLOAD_INVALID');
            });
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    describe('Payload Fields', () => {
      test('should successfully instantiate when payload fields are valid', () => {
        expect(
          new UserCredentialEntity({
            username: 'foobar',
            password: 'foobarpass',
          }),
        ).toEqual({
          username: 'foobar',
          password: 'foobarpass',
        });
      });
    });
  });
});
