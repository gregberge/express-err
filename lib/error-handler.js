var statusCodes = require('http').STATUS_CODES;

/**
 * Expose middleware.
 */

module.exports = errorHandlerFactory;

/**
 * Error middleware.
 */

function errorHandlerFactory(options) {

  options = options || {};

  // Default view to `"error"`.
  options.view = options.view || 'error';

  // Default exitOnUncaughtException to `true`.
  options.exitOnUncaughtException = options.exitOnUncaughtException !== undefined ?
    options.exitOnUncaughtException :
    true;

  // Default exitCode to `1`.
  options.exitCode = options.exitCode !== undefined ?
    options.exitCode :
    1;

  return function errorHandler(err, req, res, next) {
    // Default statusCode to 500.
    var status = err.status || 500;

    if (options.exitOnUncaughtException && ! isClientError(status)) {
      res.once('finish', process.exit.bind(process, options.exitCode));
    }

    // Send status code.
    res.status(status);

    // Format error according to accepted format.
    res.format({
      'json': function () {
        res.send(status, errorToJson(err));
      },
      'html': function () {
        res.render(options.view, {
          error: err,
          status: status,
          statusMessage: statusCodes[status]
        });
      },
      'text': function () {
        res.send(status, err.message || statusCodes[status]);
      }
    });
  };
}

/**
 * Format an error in JSON plain object.
 *
 * @param {Error|mixed} error
 * @returns {Object}
 */

function errorToJson(error) {
  return { error : { message: error.message || error, code: error.code || null } };
}

/**
 * Test if it's a client error.
 *
 * @param {String} status
 * @returns {Boolean}
 */

function isClientError(status) {
  return (status >= 400 && status <= 499);
}