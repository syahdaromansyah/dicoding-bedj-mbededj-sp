class DetailThread {
  constructor({
    thread,
    threadComments,
    threadCommentReplies,
    userThreadCommentsLikes,
  }) {
    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.date = thread.date;
    this.username = thread.username;

    this.comments = this._arrangeCommentsDetail(
      threadComments,
      threadCommentReplies,
      userThreadCommentsLikes,
    );
  }

  _arrangeCommentsDetail(
    threadComments,
    threadCommentReplies,
    userThreadCommentsLikes,
  ) {
    let tcrCopied = JSON.parse(JSON.stringify(threadCommentReplies));
    let utclCopied = JSON.parse(JSON.stringify(userThreadCommentsLikes));

    return threadComments.map((tC) => {
      const likeCount = utclCopied.filter(
        (utcl) => utcl.threadCommentId === tC.id,
      ).length;

      utclCopied = utclCopied.filter((utcl) => utcl.threadCommentId !== tC.id);

      const replies = tcrCopied
        .filter((tCR) => tCR.replyCommentId === tC.id)
        .map((tCR) => ({
          id: tCR.id,
          content: tCR.isDelete ? '**balasan telah dihapus**' : tCR.content,
          date: tCR.date,
          username: tCR.username,
        }));

      tcrCopied = tcrCopied.filter((tCR) => tCR.replyCommentId !== tC.id);

      return {
        id: tC.id,
        content: tC.isDelete ? '**komentar telah dihapus**' : tC.content,
        date: tC.date,
        likeCount,
        username: tC.username,
        replies,
      };
    });
  }
}

module.exports = DetailThread;
