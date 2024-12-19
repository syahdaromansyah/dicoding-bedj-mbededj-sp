class DetailThread {
  constructor({ thread, threadComments, threadCommentReplies }) {
    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.date = thread.date;
    this.username = thread.username;

    this.comments = this._arrangeCommentsDetail(
      threadComments,
      threadCommentReplies,
    );
  }

  _arrangeCommentsDetail(threadComments, threadCommentReplies) {
    let tcrCopied = JSON.parse(JSON.stringify(threadCommentReplies));

    return threadComments.map((tC) => {
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
        username: tC.username,
        replies,
      };
    });
  }
}

module.exports = DetailThread;
