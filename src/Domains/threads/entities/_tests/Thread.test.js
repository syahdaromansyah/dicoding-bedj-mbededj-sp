const ThreadEntity = require('../Thread');

describe('A Thread Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new ThreadEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new ThreadEntity({})).toThrow(
          'DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID',
        );
      });

      describe('An id Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: dummyIdValue,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: dummyIdValue,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );
      });

      describe('A title Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyTitleValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: dummyTitleValue,
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyTitleValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: dummyTitleValue,
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );
      });

      describe('A body Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyBodyValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: dummyBodyValue,
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyBodyValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: dummyBodyValue,
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );
      });

      describe('A date Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: dummyDateValue,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: dummyDateValue,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );
      });

      describe('An ownerId Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should successfully create an object instance', () => {
      expect(
        new ThreadEntity({
          id: `thread-${'xyz'.repeat(7)}`,
          title: 'Title Test',
          body: 'Body Test',
          date: new Date('2024-12-01').toISOString(),
          ownerId: `user-${'xyz'.repeat(10)}`,
        }),
      ).toEqual({
        id: `thread-${'xyz'.repeat(7)}`,
        title: 'Title Test',
        body: 'Body Test',
        date: new Date('2024-12-01').toISOString(),
        ownerId: `user-${'xyz'.repeat(10)}`,
      });
    });
  });
});
