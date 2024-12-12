const dotenv = require('dotenv');
const nodePath = require('path');

dotenv.config({
  path: nodePath.resolve(process.cwd(), '.env.test'),
});
