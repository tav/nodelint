/*
 * Nodelint default reporter
 *
 * Released into the Public Domain by tav <tav@espians.com>
 * See the README.md for full credits of the awesome contributors!
 */

/**
 * Module dependencies
 */
var util = require('util');

/**
 * Reporter info string
 */
exports.info = "Default reporter";

/**
 * Report linting results to the command-line.
 *
 * @api public
 *
 * @param {Array} results
 * @param {Array} options
 */
exports.report = function report(results, options) {
  var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
      i,
      len = results.length,
      str = '',
      error;

  for (i = 0; i < len; i += 1) {
    error = results[i].error;
    str += options.error_prefix + results[i].file  + ', line ' + error.line +
           ', character ' + error.character + options.error_suffix +
            error.reason + '\n' +
            (error.evidence || '').replace(error_regexp, "$1") + '\n';
  }

  str += len + ' error' + ((len === 1) ? '' : 's');

  util.puts(str);
};
