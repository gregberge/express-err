var util = require('util');
var statusCodes = require('http').STATUS_CODES;

/**
 * Expose middleware.
 */

module.exports = httpErrorFactory;
module.exports.HttpError = HttpError;

/**
 * HTTP error middleware.
 *
 * @param {number} status
 * @param {string} message
 */

function httpErrorFactory(status, message) {
  return function httpError(req, res, next) {
    next(new HttpError(status, message));
  };
}

/**
 * Create a new HttpError.
 *
 * @param {number} status
 * @param {string} message
 */

function HttpError(status, message) {
  Error.call(this);
  this.status = status;
  this.message = message || statusCodes[status];
}

util.inherits(HttpError, Error);
