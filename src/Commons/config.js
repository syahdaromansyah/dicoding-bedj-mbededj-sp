/* istanbul ignore file */

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  secret: {
    auth: {
      accessToken: process.env.ACCESS_TOKEN_KEY,
      refreshToken: process.env.REFRESH_TOKEN_KEY,
      tokenAge: process.env.ACCESS_TOKEN_AGE,
    },
  },
};

module.exports = config;
