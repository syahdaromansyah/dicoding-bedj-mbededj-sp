module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['unused-imports'],
  overrides: [
    {
      files: ['src/**/*.test.js', 'src/**/*.spec.js'],
      env: {
        jest: true,
      },
    },
    {
      files: [
        'src/Domains/**/*Repository.js',
        'src/Domains/**/entities/*.js',
        'src/Applications/**/*.js',
      ],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
    {
      files: ['src/app.js', 'tests/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
