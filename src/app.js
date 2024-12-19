require('dotenv').config();

const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

const startServer = async () => {
  const server = await createServer(container);

  await server.start();

  console.log(`server is running at ${server.info.uri}`);
};

startServer();
