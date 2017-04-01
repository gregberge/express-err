module.exports = {
  root: true,
  ecmaVersion: 8,
  env: {
    jest: true,
  },
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  rules: {
    'semi': ['error', 'never'],
  },
};
