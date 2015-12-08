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
  return function httpErrorMiddleware(req, res, next) {
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
  // Import everything needed into 'this' so it "duck type" an Error object.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
  this.name = 'HttpError';
  this.message = message || statusCodes[status];
  this.stack = (new Error()).stack;

  this.status = status; // non-standard : hint at http status code
}

// REM "Error" always returns a new object
// cf. http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
