/**
 * Imports
 */
var formatter = require('./formatter');
var parser = require('./parser');


function isValid(content, options) {
	var parser = new parser.Parser(options);
	return parser.update(content).isValid();
}

function isValidFile(filePath, options, callback) {
	
}

function isValidFileSync(filePath) {
	
}

exports.Formatter = formatter.Formatter;
exports.Launcher = parser.Launcher;
exports.Parser = parser.Parser;
