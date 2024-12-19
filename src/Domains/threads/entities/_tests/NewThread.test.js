const NewThreadEntity = require('../NewThread');

describe('A NewThread Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new NewThreadEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new NewThreadEntity({})).toThrow(
          'DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID',
        );
      });

      describe('A title Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyTitleValue) => {
            expect(
              () =>
                new NewThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: dummyTitleValue,
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyTitleValue) => {
            expect(
              () =>
                new NewThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: dummyTitleValue,
                  body: 'Body Test',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID');
          },
        );
      });

      describe('A body Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyBodyValue) => {
            expect(
              () =>
                new NewThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: dummyBodyValue,
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyBodyValue) => {
            expect(
              () =>
                new NewThreadEntity({
                  id: `thread-${'xyz'.repeat(7)}`,
                  title: 'Title Test',
                  body: dummyBodyValue,
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should successfully create an object instance', () => {
      expect(
        new NewThreadEntity({
          title: 'Title Test',
          body: 'Body Test',
        }),
      ).toEqual({
        title: 'Title Test',
        body: 'Body Test',
      });
    });
  });
});
