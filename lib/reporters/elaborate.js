/*
 * Nodelint VIM elaborate reporter
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
exports.info = "VIM elaborate reporter";

/**
 * Report linting results to the command-line.
 *
 * @api public
 *
 * @param {Array} results
 */
exports.report = function report(results) {
  var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
      i,
      len = results.length,
      str = '',
      file,
      error;

  for (i = 0; i < len; i += 1) {
    file = results[i].file;
    file = file.substring(file.lastIndexOf('/') + 1, file.length);
    error = results[i].error;
    str += file  + ': line ' + error.line +
      ', character ' + error.character + ', ' +
      error.reason + '\n' +
      (error.evidence || '').replace(error_regexp, "$1") + '\n';
  }

  if (len > 0) {
    str += len + ' error' + ((len === 1) ? '' : 's');
    util.error(str);
  } else {
    util.puts('Lint free!');
  }
};
