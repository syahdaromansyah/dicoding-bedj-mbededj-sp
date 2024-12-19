const ThreadCommentRepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threadCommentReplies',
  register: async (server, { container }) => {
    const threadCommentRepliesHandler = new ThreadCommentRepliesHandler(
      container,
    );

    server.route(routes(threadCommentRepliesHandler));
  },
};
