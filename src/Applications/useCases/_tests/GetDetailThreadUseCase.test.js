const DetailThreadEntity = require('../../../Domains/detailThread/entities/DetailThread');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const ThreadCommentRepliesRepository = require('../../../Domains/threadCommentReplies/ThreadCommentRepliesRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('A GetDetailThreadUseCase Use Case', () => {
  test('should orchestrate the use case action correctly', async () => {
    // Arrange
    const expected = {
      thread: new DetailThreadEntity({
        thread: {
          id: 'thread-1',
          title: 'Thread Title',
          body: 'Thread body',
          date: new Date('2024-12-1').toISOString(),
          username: 'foobar',
        },
        threadComments: [
          {
            id: 'comment-1',
            content: 'foobaz comment',
            date: new Date('2024-12-2').toISOString(),
            isDelete: false,
            username: 'foobaz',
          },
          {
            id: 'comment-2',
            content: 'voobar comment',
            date: new Date('2024-12-3').toISOString(),
            isDelete: false,
            username: 'voobar',
          },
          {
            id: 'comment-3',
            content: 'voobaz comment',
            date: new Date('2024-12-4').toISOString(),
            isDelete: true,
            username: 'voobaz',
          },
        ],
        threadCommentReplies: [
          {
            id: 'reply-1',
            content: 'foobar reply',
            date: new Date('2024-12-3').toISOString(),
            isDelete: false,
            replyCommentId: 'comment-1',
            username: 'foobar',
          },
          {
            id: 'reply-2',
            content: 'voobar reply',
            date: new Date('2024-12-4').toISOString(),
            isDelete: true,
            replyCommentId: 'comment-1',
            username: 'voobar',
          },
          {
            id: 'reply-3',
            content: 'foobar second reply',
            date: new Date('2024-12-4').toISOString(),
            isDelete: true,
            replyCommentId: 'comment-2',
            username: 'foobar',
          },
          {
            id: 'reply-4',
            content: 'voobaz reply',
            date: new Date('2024-12-5').toISOString(),
            isDelete: true,
            replyCommentId: 'comment-2',
            username: 'voobaz',
          },
        ],
      }),
    };

    const threadsRepository = new ThreadsRepository();

    threadsRepository.checkExistenceById = jest.fn().mockResolvedValue();

    threadsRepository.getWithUsernameById = jest.fn().mockResolvedValueOnce({
      id: 'thread-1',
      title: 'Thread Title',
      body: 'Thread body',
      date: new Date('2024-12-1').toISOString(),
      username: 'foobar',
    });

    const threadCommentsRepository = new ThreadCommentsRepository();

    threadCommentsRepository.getManyWithUsernameByThreadId = jest
      .fn()
      .mockResolvedValueOnce([
        {
          id: 'comment-1',
          content: 'foobaz comment',
          date: new Date('2024-12-2').toISOString(),
          isDelete: false,
          username: 'foobaz',
        },
        {
          id: 'comment-2',
          content: 'voobar comment',
          date: new Date('2024-12-3').toISOString(),
          isDelete: false,
          username: 'voobar',
        },
        {
          id: 'comment-3',
          content: 'voobaz comment',
          date: new Date('2024-12-4').toISOString(),
          isDelete: true,
          username: 'voobaz',
        },
      ]);

    const threadCommentRepliesRepository = new ThreadCommentRepliesRepository();

    threadCommentRepliesRepository.getManyWithUsernameByThreadId = jest
      .fn()
      .mockResolvedValueOnce([
        {
          id: 'reply-1',
          content: 'foobar reply',
          date: new Date('2024-12-3').toISOString(),
          isDelete: false,
          replyCommentId: 'comment-1',
          username: 'foobar',
        },
        {
          id: 'reply-2',
          content: 'voobar reply',
          date: new Date('2024-12-4').toISOString(),
          isDelete: true,
          replyCommentId: 'comment-1',
          username: 'voobar',
        },
        {
          id: 'reply-3',
          content: 'foobar second reply',
          date: new Date('2024-12-4').toISOString(),
          isDelete: true,
          replyCommentId: 'comment-2',
          username: 'foobar',
        },
        {
          id: 'reply-4',
          content: 'voobaz reply',
          date: new Date('2024-12-5').toISOString(),
          isDelete: true,
          replyCommentId: 'comment-2',
          username: 'voobaz',
        },
      ]);

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadsRepository,
      threadCommentsRepository,
      threadCommentRepliesRepository,
    });

    // Action & Assert
    await expect(
      getDetailThreadUseCase.execute('thread-1'),
    ).resolves.toStrictEqual(expected);

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledTimes(1);

    expect(threadsRepository.checkExistenceById).toHaveBeenCalledWith(
      'thread-1',
    );

    expect(threadsRepository.getWithUsernameById).toHaveBeenCalledTimes(1);

    expect(threadsRepository.getWithUsernameById).toHaveBeenCalledWith(
      'thread-1',
    );

    expect(
      threadCommentsRepository.getManyWithUsernameByThreadId,
    ).toHaveBeenCalledTimes(1);

    expect(
      threadCommentsRepository.getManyWithUsernameByThreadId,
    ).toHaveBeenCalledWith('thread-1');

    expect(
      threadCommentRepliesRepository.getManyWithUsernameByThreadId,
    ).toHaveBeenCalledTimes(1);

    expect(
      threadCommentRepliesRepository.getManyWithUsernameByThreadId,
    ).toHaveBeenCalledWith('thread-1');
  });
});
