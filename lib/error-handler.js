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

  // Default status to 500
  options.status = options.status || 500;

  // Default formatters
  options.formatters = options.formatters || ['json', 'text', 'html'];

  // Default formatter
  options.defaultFormatter = options.defaultFormatter || 'html';

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
    var status = err.status || options.status;

    if (options.exitOnUncaughtException && ! isClientError(status)) {
      res.once('finish', process.exit.bind(process, options.exitCode));
    }

    // Send status code.
    res.status(status);

    // Set available formatters
    var availableFormatters = {
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
    };

    var formatters = {}
    options.formatters.forEach(function(f) {
      if (f in availableFormatters) {
        formatters[f] = availableFormatters[f];
      }
    });

    // Set default formatter
    if (options.defaultFormatter in formatters) {
      formatters.default = formatters[options.defaultFormatter];
    }

    // Format error according to accepted format.
    res.format(formatters);
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

