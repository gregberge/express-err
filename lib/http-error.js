'use strict';
/*jshint -W098 */

var statusCodes = require('http').STATUS_CODES;

/**
 * Expose middleware.
 */

module.exports = httpErrorFactory;

/**
 * HTTP error middleware.
 *
 * @param {Number} status
 * @param {String} message
 */

function httpErrorFactory(status, message) {
  var err = new Error();
  err.status = status;
  err.message = message || statusCodes[status];

  return function httpError(req, res, next) {
    next(err);
  };
}