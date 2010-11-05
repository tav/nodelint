/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var formatter = require('../formatter');

/**
 * Formatter constructor
 * 
 * @constructor
 * @extends lint.formatter.Base
 * @param {Object} options
 */
function Formatter(options) {
    formatter.Base.call(this, options);
}
util.inherits(Formatter, formatter.Base);

/**
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
    var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, length = data.length, output = '', file, error;

    if (length > 0) {
        for (i = 0; i < length; i += 1) {
            file = data[i].file;
            error = data[i].error;

            output += file;
            output += ' line ' + error.line;
            output += ' column ' + error.character;
            output += ' Error: ' + error.reason + ' ' + (error.evidence || '').replace(error_regexp, "$1");

            output += (i === length - 1) ? '' : this._eol;
        }
    }
    return output;
};

/**
 * Exports
 */
exports.Formatter = Formatter;