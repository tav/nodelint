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
        var parser, result;

        if (error) {
            if (callback) {
                callback(error);
            }
        } else {
            parser = new parser.Parser(options);
            result = parser.update(data).isValid();
            if (callback) {
                callback(undefined, result);
            }
        }
    });
}

function isValidFileSync(filePath, options) {
    var data, parser, result;
    data = fs.readFileSync(filePath);
    parser = new parser.Parser(options);
    result = parser.update(data).isValid();
    
    return result;
}

exports.Formatter = formatter.Formatter;
exports.Launcher = parser.Launcher;
exports.Parser = parser.Parser;
