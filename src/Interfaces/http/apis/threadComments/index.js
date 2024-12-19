const ThreadCommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threadComments',
  register: async (server, { container }) => {
    const threadCommentsHandler = new ThreadCommentsHandler(container);

    server.route(routes(threadCommentsHandler));
  },
};
