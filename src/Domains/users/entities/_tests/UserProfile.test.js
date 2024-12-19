const UserProfileEntity = require('../UserProfile');

describe('A UserProfile Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new UserProfileEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID',
          );
        },
      );

      describe('payload Fields', () => {
        test.each([
          {
            username: 'foobar',
            fullname: 'Foo Bar',
          },
          {
            id: `user-${'xyz'.repeat(10)}`,
            fullname: 'Foo Bar',
          },
          {
            id: `user-${'xyz'.repeat(10)}`,
            username: 'foobar',
          },
        ])(
          'should throw an error when fields are incomplete',
          (dummyPayload) => {
            expect(() => new UserProfileEntity(dummyPayload)).toThrow(
              'DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID',
            );
          },
        );

        test.each(['id', 'username', 'fullname'])(
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
                id: `user-${'xyz'.repeat(10)}`,
                username: 'foobar',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserProfileEntity({
                    ...dummyPayload,
                    [fieldKey]: e,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
            });
          },
        );

        describe('An id Field', () => {
          test('should throw an error when it contains whitespace chars', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  id: `user ${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });

          test.each([`user-${'xyz'.repeat(9)}xy`, `user-${'xyz'.repeat(10)}x`])(
            'should throw an error when it contains not exactly 35 chars',
            (dummyId) => {
              const dummyPayload = {
                id: `user-${'xyz'.repeat(10)}`,
                username: 'foobar',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserProfileEntity({
                    ...dummyPayload,
                    id: dummyId,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
            },
          );

          test('should throw an error when it is not prefixed with "user-"', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  id: 'abc123'.repeat(13),
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });
        });

        describe('A username Field', () => {
          test('should throw an error when it contains whitespace chars', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  username: 'foo bar',
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });

          test('should throw an error when it contains restricted chars', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  username: 'foo@bar',
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });

          test('should throw an error when it contains uppercase letters', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  username: 'FooBar',
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });

          test('should throw an error when it contains less than 3 chars', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  username: 'fo',
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
          });

          test('should throw an error when it contains more than 64 chars', () => {
            const dummyPayload = {
              id: `user-${'xyz'.repeat(10)}`,
              username: 'foobar',
              fullname: 'Foo Bar',
            };

            expect(
              () =>
                new UserProfileEntity({
                  ...dummyPayload,
                  username: `${'foobar45'.repeat(8)}x`,
                }),
            ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
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
                id: `user-${'xyz'.repeat(10)}`,
                username: 'foobar',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserProfileEntity({
                    ...dummyPayload,
                    fullname: dummyFullname,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
            },
          );

          test.each(['foo', 'foo bar', 'Foo bar'])(
            'should throw an error when each word not started with capital letter',
            (dummyFullname) => {
              const dummyPayload = {
                id: `user-${'xyz'.repeat(10)}`,
                username: 'foobar',
                fullname: 'Foo Bar',
              };

              expect(
                () =>
                  new UserProfileEntity({
                    ...dummyPayload,
                    fullname: dummyFullname,
                  }),
              ).toThrow('DOMAIN.ENTITY.USER_PROFILE.PAYLOAD_INVALID');
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
          new UserProfileEntity({
            id: `user-${'xyz'.repeat(10)}`,
            username: 'foobar',
            fullname: 'Foo Bar',
          }),
        ).toEqual({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          fullname: 'Foo Bar',
        });
      });
    });
  });
});
