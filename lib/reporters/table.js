/*
 * Nodelint IDEA reporter
 *
 * Reporter for working with external tools within the Idea IDEs
 * Only tested with RubyMine
 * For setup instructions see: https://github.com/tav/nodelint/wiki/Editor-and-IDE-integration
 *
 * Released into the Public Domain by tav <tav@espians.com>
 * See the README.md for full credits of the awesome contributors!
 */

/**
 * Module dependencies
 */
var _ = require('underscore'),
  CliTable = require('cli-table');

/**
 * Reporter info string
 */
exports.info = "Table reporter";

/**
 * Report linting results to the command-line as a table.
 *
 * @api public
 *
 * @param {Array} results
 */
exports.report = function report(results) {
  var len = results.length,
    groupedResults = _.groupBy(results, function (error) {
      return error.file;
    });
  _.each(groupedResults, function (fileErrors, index) {
    var table = new CliTable({
      head: ['Line', 'Character', 'Reason'],
      colWidths: [10, 15, 150]
    });
    console.log(' %s , total errors (%s)', index, groupedResults[index].length);
    _.each(groupedResults[index], function (result) {
      var row = [];
      row.push(result.error.line);
      row.push(result.error.character);
      row.push(result.error.reason);
      table.push(row);
    });

    console.log(table.toString());
  });

  if (len > 0) {
    console.log('total errors : (%s)', len);
  }
};
