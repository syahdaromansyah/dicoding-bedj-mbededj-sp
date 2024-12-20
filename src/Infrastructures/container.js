/* istanbul ignore file */

const { createContainer } = require('instances-container');

const HapiJwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const pool = require('./databases/postgres/pool');

const UsersRepository = require('../Domains/users/UsersRepository');
const AuthRepository = require('../Domains/auth/AuthRepository');
const ThreadsRepository = require('../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../Domains/threadComments/ThreadCommentsRepository');
const ThreadCommentRepliesRepository = require('../Domains/threadCommentReplies/ThreadCommentRepliesRepository');
const UserThreadCommentLikesRepository = require('../Domains/userThreadCommentLikes/UserThreadCommentLikesRepository');

const PasswordEncryption = require('../Applications/security/PasswordEncryption');
const CredentialValidation = require('../Applications/security/CredentialValidation');
const AuthTokenManager = require('../Applications/security/AuthTokenManager');
const IdGenerator = require('../Applications/utilities/IdGenerator');
const Datetime = require('../Applications/utilities/Datetime');

const AddUserUseCase = require('../Applications/useCases/AddUserUseCase');
const UserLoginUseCase = require('../Applications/useCases/UserLoginUseCase');
const RefreshTokenUseCase = require('../Applications/useCases/RefreshTokenUseCase');
const UserLogoutUseCase = require('../Applications/useCases/UserLogoutUseCase');
const AddThreadUseCase = require('../Applications/useCases/AddThreadUseCase');
const AddThreadCommentUseCase = require('../Applications/useCases/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../Applications/useCases/DeleteThreadCommentUseCase');
const GetDetailThreadUseCase = require('../Applications/useCases/GetDetailThreadUseCase');
const AddThreadCommentReplyUseCase = require('../Applications/useCases/AddThreadCommentReplyUseCase');
const DeleteThreadCommentReplyUseCase = require('../Applications/useCases/DeleteThreadCommentReplyUseCase');
const UserThreadCommentLikeUseCase = require('../Applications/useCases/UserThreadCommentLikeUseCase');

const UsersRepositoryPostgres = require('./repositories/UsersRepositoryPostgres');
const AuthRepositoryPostgres = require('./repositories/AuthRepositoryPostgres');
const ThreadsRepositoryPostgres = require('./repositories/ThreadsRepositoryPostgres');
const ThreadCommentsRepositoryPostgres = require('./repositories/ThreadCommentsRepositoryPostgres');
const ThreadCommentRepliesRepositoryPostgres = require('./repositories/ThreadCommentRepliesRepositoryPostgres');
const UserThreadCommentLikesRepositoryPostgres = require('./repositories/UserThreadCommentLikesRepositoryPostgres');

const BcryptPasswordEncryption = require('./security/BcryptPasswordEncryption');
const CredentialValidationImpl = require('./security/CredentialValidationImpl');
const AuthTokenManagerImpl = require('./security/AuthTokenManagerImpl');
const IdGeneratorImpl = require('./utilities/IdGeneratorImpl');
const DatetimeImpl = require('./utilities/DatetimeImpl');

const container = createContainer();

// Repositories Registration
container.register([
  {
    key: UsersRepository.name,
    Class: UsersRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          internal: IdGenerator.name,
        },
      ],
    },
  },
  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ThreadsRepository.name,
    Class: ThreadsRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool,
        },
        {
          name: 'idGen',
          internal: IdGenerator.name,
        },
        {
          name: 'date',
          internal: Datetime.name,
        },
      ],
    },
  },
  {
    key: ThreadCommentsRepository.name,
    Class: ThreadCommentsRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool,
        },
        {
          name: 'idGen',
          internal: IdGenerator.name,
        },
        {
          name: 'date',
          internal: Datetime.name,
        },
      ],
    },
  },
  {
    key: ThreadCommentRepliesRepository.name,
    Class: ThreadCommentRepliesRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool,
        },
        {
          name: 'idGen',
          internal: IdGenerator.name,
        },
        {
          name: 'date',
          internal: Datetime.name,
        },
      ],
    },
  },
  {
    key: UserThreadCommentLikesRepository.name,
    Class: UserThreadCommentLikesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          internal: IdGenerator.name,
        },
      ],
    },
  },
]);

// Services, Managers, etc Registration
container.register([
  {
    key: PasswordEncryption.name,
    Class: BcryptPasswordEncryption,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: CredentialValidation.name,
    Class: CredentialValidationImpl,
    parameter: {
      dependencies: [
        {
          internal: UsersRepository.name,
        },
        {
          internal: PasswordEncryption.name,
        },
      ],
    },
  },
  {
    key: AuthTokenManager.name,
    Class: AuthTokenManagerImpl,
    parameter: {
      dependencies: [
        {
          concrete: HapiJwt,
        },
      ],
    },
  },
  {
    key: IdGenerator.name,
    Class: IdGeneratorImpl,
    parameter: {
      dependencies: [
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: Datetime.name,
    Class: DatetimeImpl,
    parameter: {
      dependencies: [
        {
          concrete: Date,
        },
      ],
    },
  },
]);

// Use Cases Registration
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      dependencies: [
        {
          internal: UsersRepository.name,
        },
        {
          internal: PasswordEncryption.name,
        },
      ],
    },
  },
  {
    key: UserLoginUseCase.name,
    Class: UserLoginUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'credentialValidation',
          internal: CredentialValidation.name,
        },
        {
          name: 'authTokenManager',
          internal: AuthTokenManager.name,
        },
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshTokenUseCase.name,
    Class: RefreshTokenUseCase,
    parameter: {
      dependencies: [
        {
          internal: AuthRepository.name,
        },
        {
          internal: AuthTokenManager.name,
        },
      ],
    },
  },
  {
    key: UserLogoutUseCase.name,
    Class: UserLogoutUseCase,
    parameter: {
      dependencies: [
        {
          internal: AuthRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      dependencies: [
        {
          internal: ThreadsRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadCommentUseCase.name,
    Class: AddThreadCommentUseCase,
    parameter: {
      dependencies: [
        {
          internal: ThreadsRepository.name,
        },
        {
          internal: ThreadCommentsRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteThreadCommentUseCase.name,
    Class: DeleteThreadCommentUseCase,
    parameter: {
      dependencies: [
        {
          internal: ThreadsRepository.name,
        },
        {
          internal: ThreadCommentsRepository.name,
        },
      ],
    },
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
        {
          name: 'userThreadCommentLikesRepository',
          internal: UserThreadCommentLikesRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadCommentReplyUseCase.name,
    Class: AddThreadCommentReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteThreadCommentReplyUseCase.name,
    Class: DeleteThreadCommentReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
      ],
    },
  },
  {
    key: UserThreadCommentLikeUseCase.name,
    Class: UserThreadCommentLikeUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'userThreadCommentLikesRepository',
          internal: UserThreadCommentLikesRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
