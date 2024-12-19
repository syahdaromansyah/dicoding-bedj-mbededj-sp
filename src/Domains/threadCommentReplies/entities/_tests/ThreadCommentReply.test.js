const ThreadCommentReplyEntity = require('../ThreadCommentReply');

describe('A ThreadCommentReply Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new ThreadCommentReplyEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new ThreadCommentReplyEntity({})).toThrow(
          'DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID',
        );
      });

      describe('An id Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: dummyIdValue,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: dummyIdValue,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });

      describe('A content Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyContentValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyContentValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });

      describe('A threadCommentId Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dmyThdCmtRpyIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: dmyThdCmtRpyIdValue,
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dmyThdCmtRpyIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: dmyThdCmtRpyIdValue,
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });

      describe('A date Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: dummyDateValue,
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: dummyDateValue,
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });

      describe('An isDelete Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a boolean',
          (dummyIsDeleteValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: dummyIsDeleteValue,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: dummyDateValue,
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });

      describe('An ownerId Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadCommentReplyEntity({
                  id: `reply-${'xyz'.repeat(7)}`,
                  content: 'Reply test',
                  threadCommentId: 'comment-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT_REPLY.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should create an object instance correctly', () => {
      expect(
        new ThreadCommentReplyEntity({
          id: `reply-${'xyz'.repeat(7)}`,
          content: 'Reply test',
          threadCommentId: 'comment-1',
          date: new Date('2024-12-01').toISOString(),
          isDelete: false,
          ownerId: `user-${'xyz'.repeat(10)}`,
        }),
      ).toEqual({
        id: `reply-${'xyz'.repeat(7)}`,
        content: 'Reply test',
        threadCommentId: 'comment-1',
        date: new Date('2024-12-01').toISOString(),
        isDelete: false,
        ownerId: `user-${'xyz'.repeat(10)}`,
      });
    });
  });
});
