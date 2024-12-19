const NewThreadCommentReplyEntity = require('../NewThreadCommentReply');

describe('A NewThreadCommentReply Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new NewThreadCommentReplyEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new NewThreadCommentReplyEntity({})).toThrow(
          'DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID',
        );
      });

      describe('A content Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyContentValue) => {
            expect(
              () =>
                new NewThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyContentValue) => {
            expect(
              () =>
                new NewThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.NEW_THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should successfully create an object instance', () => {
      expect(
        new NewThreadCommentReplyEntity({
          content: 'Reply test',
        }),
      ).toEqual({
        content: 'Reply test',
      });
    });
  });
});
