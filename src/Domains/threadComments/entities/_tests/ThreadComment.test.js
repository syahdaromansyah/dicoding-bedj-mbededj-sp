const ThreadCommentEntity = require('../ThreadComment');

describe('A ThreadComment Entity', () => {
  describe('Negative Tests', () => {
    describe('A payload Parameter', () => {
      test.each(['foobar', 1, null, undefined, [], () => {}])(
        'should throw an error when its data type is not an object',
        (dummyPayload) => {
          expect(() => new ThreadCommentEntity(dummyPayload)).toThrow(
            'DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID',
          );
        },
      );

      test('should throw an error when its fields is incomplete', () => {
        expect(() => new ThreadCommentEntity({})).toThrow(
          'DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID',
        );
      });

      describe('An id Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: dummyIdValue,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: dummyIdValue,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });

      describe('A content Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyContentValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyContentValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: dummyContentValue,
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });

      describe('A threadId Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyThreadIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: dummyThreadIdValue,
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyThreadIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: dummyThreadIdValue,
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });

      describe('A date Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: dummyDateValue,
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyDateValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: dummyDateValue,
                  isDelete: false,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });

      describe('An isDelete Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a boolean',
          (dummyIsDeleteValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: dummyIsDeleteValue,
                  ownerId: `user-${'xyz'.repeat(10)}`,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });

      describe('An ownerId Field', () => {
        test.each([1, null, undefined, [], {}, () => {}])(
          'should throw an error when its value is not a string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );

        test.each(['', ' ', '   '])(
          'should throw an error if its empty string',
          (dummyOwnerIdValue) => {
            expect(
              () =>
                new ThreadCommentEntity({
                  id: `comment-${'xyz'.repeat(7)}`,
                  content: 'Comment test',
                  threadId: 'thread-1',
                  date: new Date().toISOString(),
                  isDelete: false,
                  ownerId: dummyOwnerIdValue,
                }),
            ).toThrow('DOMAIN.ENTITY.THREAD_COMMENT.PAYLOAD_INVALID');
          },
        );
      });
    });
  });

  describe('Positive Tests', () => {
    test('should create an object instance correctly', () => {
      expect(
        new ThreadCommentEntity({
          id: `comment-${'xyz'.repeat(7)}`,
          content: 'Comment test',
          threadId: 'thread-1',
          date: new Date('2024-12-01').toISOString(),
          isDelete: false,
          ownerId: `user-${'xyz'.repeat(10)}`,
        }),
      ).toEqual({
        id: `comment-${'xyz'.repeat(7)}`,
        content: 'Comment test',
        threadId: 'thread-1',
        date: new Date('2024-12-01').toISOString(),
        isDelete: false,
        ownerId: `user-${'xyz'.repeat(10)}`,
      });
    });
  });
});
