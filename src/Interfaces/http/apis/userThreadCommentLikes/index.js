const UserThreadCommentLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'userThreadCommentLikes',
  register: async (server, { container }) => {
    const userThreadCommentLikesHandler = new UserThreadCommentLikesHandler(
      container,
    );

    server.route(routes(userThreadCommentLikesHandler));
  },
};
