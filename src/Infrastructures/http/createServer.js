const Hapi = require('@hapi/hapi');
const HapiJwt = require('@hapi/jwt');

const ClientError = require('../../Commons/exceptions/ClientError');
const config = require('../../Commons/config');
const ErrorsTranslator = require('../../Commons/exceptions/ErrorsTranslator');

const usersEndpoints = require('../../Interfaces/http/apis/users');
const authEndpoints = require('../../Interfaces/http/apis/auth');
const threadsEndpoints = require('../../Interfaces/http/apis/threads');
const threadCommentsEndpoints = require('../../Interfaces/http/apis/threadComments');
const threadCommentRepliesEndpoints = require('../../Interfaces/http/apis/threadCommentReplies');
const userThreadCommentLikesEndpoints = require('../../Interfaces/http/apis/userThreadCommentLikes');

const createServer = async (container) => {
  const hapiServer = Hapi.server({
    ...config.app,
  });

  // Common plugin registration
  await hapiServer.register([
    {
      plugin: HapiJwt,
    },
  ]);

  // Auth strategy registration
  hapiServer.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.secret.auth.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.secret.auth.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  // Endpoints registration
  await hapiServer.register([
    {
      plugin: usersEndpoints,
      options: {
        container,
      },
    },
    {
      plugin: authEndpoints,
      options: {
        container,
      },
    },
    {
      plugin: threadsEndpoints,
      options: {
        container,
      },
    },
    {
      plugin: threadCommentsEndpoints,
      options: {
        container,
      },
    },
    {
      plugin: threadCommentRepliesEndpoints,
      options: {
        container,
      },
    },
    {
      plugin: userThreadCommentLikesEndpoints,
      options: {
        container,
      },
    },
  ]);

  hapiServer.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = ErrorsTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: translatedError.message,
          })
          .code(translatedError.statusCode);
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      return h
        .response({
          status: 'error',
          message: 'something went wrong',
        })
        .code(500);
    }

    return h.continue;
  });

  return hapiServer;
};

module.exports = createServer;
