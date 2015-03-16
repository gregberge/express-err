/**
 * Expose middlewares.
 */

module.exports = module.exports.errorHandler = require('./lib/error-handler');
module.exports.httpError = require('./lib/http-error');
module.exports.HttpError = require('./lib/http-error').HttpError;
