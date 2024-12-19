const DetailThreadEntity = require('../DetailThread');

describe('A DetailThread Entity', () => {
  test('should map detail thread payload correctly', () => {
    // Arrange
    const expected = {
      id: 'thread-1',
      title: 'Title Thread',
      body: 'Body thread',
      date: new Date(2024, 11, 8, 8, 0, 0).toISOString(),
      username: 'foobar',
      comments: [
        {
          id: 'comment-1',
          content: 'Comment 1',
          date: new Date(2024, 11, 8, 9, 0, 0).toISOString(),
          username: 'foobaz',
          replies: [
            {
              id: 'reply-11',
              content: 'Reply 1',
              date: new Date(2024, 11, 8, 10, 0, 0).toISOString(),
              username: 'foobar',
            },
            {
              id: 'reply-12',
              content: '**balasan telah dihapus**',
              date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
              username: 'foobaz',
            },
          ],
        },
        {
          id: 'comment-2',
          content: 'Comment 2',
          date: new Date(2024, 11, 8, 10, 0, 0).toISOString(),
          username: 'voobar',
          replies: [
            {
              id: 'reply-21',
              content: '**balasan telah dihapus**',
              date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
              username: 'foobaz',
            },
            {
              id: 'reply-22',
              content: '**balasan telah dihapus**',
              date: new Date(2024, 11, 8, 12, 0, 0).toISOString(),
              username: 'voobaz',
            },
          ],
        },
        {
          id: 'comment-3',
          content: '**komentar telah dihapus**',
          date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
          username: 'voobaz',
          replies: [],
        },
      ],
    };

    const dummyPayload = {
      thread: {
        id: 'thread-1',
        title: 'Title Thread',
        body: 'Body thread',
        date: new Date(2024, 11, 8, 8, 0, 0).toISOString(),
        username: 'foobar',
      },
      threadComments: [
        {
          id: 'comment-1',
          content: 'Comment 1',
          date: new Date(2024, 11, 8, 9, 0, 0).toISOString(),
          isDelete: false,
          username: 'foobaz',
        },
        {
          id: 'comment-2',
          content: 'Comment 2',
          date: new Date(2024, 11, 8, 10, 0, 0).toISOString(),
          isDelete: false,
          username: 'voobar',
        },
        {
          id: 'comment-3',
          content: 'Comment 3',
          date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
          isDelete: true,
          username: 'voobaz',
        },
      ],
      threadCommentReplies: [
        {
          id: 'reply-11',
          content: 'Reply 1',
          date: new Date(2024, 11, 8, 10, 0, 0).toISOString(),
          isDelete: false,
          replyCommentId: 'comment-1',
          username: 'foobar',
        },
        {
          id: 'reply-12',
          content: 'Reply 2',
          date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
          isDelete: true,
          replyCommentId: 'comment-1',
          username: 'foobaz',
        },
        {
          id: 'reply-21',
          content: 'Reply 1',
          date: new Date(2024, 11, 8, 11, 0, 0).toISOString(),
          isDelete: true,
          replyCommentId: 'comment-2',
          username: 'foobaz',
        },
        {
          id: 'reply-22',
          content: 'Reply 2',
          date: new Date(2024, 11, 8, 12, 0, 0).toISOString(),
          isDelete: true,
          replyCommentId: 'comment-2',
          username: 'voobaz',
        },
      ],
    };

    // Action & Assert
    expect(new DetailThreadEntity(dummyPayload)).toEqual(expected);
  });
});
