const NewThreadCommentEntity = require('../NewThreadComment');

describe('A NewThreadComment Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new NewThreadCommentEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new NewThreadCommentEntity({})).toThrow(
          'DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID',
        );
      });

      describe('A content Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyContentValue) => {
            expect(
              () =>
                new NewThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyContentValue) => {
            expect(
              () =>
                new NewThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should successfully create an object instance', () => {
      expect(
        new NewThreadCommentEntity({
          content: 'Comment test',
        }),
      ).toEqual({
        content: 'Comment test',
      });
    });
  });
});
