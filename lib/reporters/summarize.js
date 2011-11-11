/*
 * Nodelint summarize reporter
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
exports.info = "Summarize reporter";

/**
 * Report linting results to the command-line.
 *
 * @api public
 *
 * @param {Array} results
 */
exports.report = function report(results) {
  var len = results.length;
  util.puts(len + ' error' + ((len === 1) ? '' : 's'));
};
