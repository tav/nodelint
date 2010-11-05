/*jslint indent:4 */
/**
 * Imports
 */
var formatter = require('./formatter');
var parser = require('./parser');
var fs = require('fs');

function isValid(content, options) {
    var parser = new parser.Parser(options);
    return parser.update(content).isValid();
}

function isValidFile(filePath, options, callback) {
    fs.readFile(filePath, function (error, data) {
        var parser;

        if (error) {
            throw error;
        } else {
            parser = new parser.Parser(options);
            parser.update(data).isValid();
        }
        console.log(data);
    });
}

function isValidFileSync(filePath, options) {

}

exports.Formatter = formatter.Formatter;
exports.Launcher = parser.Launcher;
exports.Parser = parser.Parser;
