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
 * 
 * @return {string}
 */
Formatter.prototype.formatNormal = function () {
	return JSON.stringify(results);
};

/**
 * Exports
 */
exports.Formatter = Formatter;
