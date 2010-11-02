/**
 * Imports
 */
var parser = require('./parser');
var formatter = require('./formatter');

/**
 * Launcher constructor
 * 
 * @constructor
 */
function Launcher(options) {

}

Launcher.prototype.buildParser = function (options) {
	return new parser.Parser(options);
};

Launcher.prototype.buildFormatter = function (options) {
	return new formatter.Formatter(options);
};

/**
 * 
 * 
 * @param {Object} args
 * @return {int} code
 */
Launcher.prototype.run = function (args) {
	return 0;
};

/**
 * Exports
 */
exports.Launcher = Launcher;