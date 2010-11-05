/*jslint indent:4 */
/**
 * Imports
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var fs = require('fs');
var parser = require('./parser');
var formatter = require('./formatter');

/**
 * Launcher constructor
 * 
 * @constructor
 * @param {Object} options
 */
function Launcher(options) {
    this._config = {};

    this._parser = null;
    this._formatter = null;

    this.configure(options);
}

/**
 * Configure the launcher
 *  
 * @param {Object} options
 * @return this
 */
Launcher.prototype.configure = function (options) {
    if (options) {

        if (options.parser !== undefined) {
            this._getParser(options.parser);
        }

        if (options.formatter !== undefined) {
            this._getFormatter(options.formatter);
        }
    }
    return this;
};

/**
 * 
 * @param {Array} files
 * @param {Function} callback
 * @return
 */
Launcher.prototype.validateFiles = function (files, callback) {
    var report, onValidateFileCount, onValidateFile;

    report = [];
    parser = this._getParser();

    onValidateFileCount = files.length;
    onValidateFile = function (error, reportFile) {
        onValidateFileCount -= 1;

        if (reportFile) {
            report = report.concat(reportFile);
        }

        if (onValidateFileCount <= 0) {
            if (callback) {
                callback(null, report);
            }
        }
    };

    files.forEach(function (file) {
        this._validateFile(file,  onValidateFile);
    }.bind(this));
};

/**
 * Run the executer with specified args
 * 
 * @param {Object} args
 * @return {int} code
 */
Launcher.prototype.run = function (args) {

    var thisLauncher = this;

    this._findFiles(args, function (error, files) {
        var report, onValidateFileCount, onValidateFile;
        if (error) {
            thisLauncher._printError(error);
        } else {

            thisLauncher.validateFiles(files, function (error, report) {
                thisLauncher._printMessage(thisLauncher._formatReport(report));
                process.exit(0);
            });
        }
    });
    return 0;
};

Launcher.prototype._findFiles = function (args, callback) {
    callback(undefined, [__filename]);//TODO: implement this
};

Launcher.prototype._validateFile = function (filePath, callback) {
    fs.readFile(filePath, function (error, data) {
        var report, reportContent;

        if (error) {
            callback(error);
        } else {
            parser = this._getParser();

            report = [];
            reportContent = parser.reset().update(data).getReport();
            reportContent.forEach(function (error) {
                report.push({
                    file: filePath,
                    error: error
                });
            });
            callback(undefined, report);
        }
    }.bind(this));
};

Launcher.prototype._formatReport = function (report) {
    formatter = this._getFormatter();
    return formatter.format(report);
};

Launcher.prototype._getParser = function (options) {
    if (!this._parser) {
        this._parser = new parser.Parser(options);
    } else if (options) {
        this._parser.configure(options);
    }
    return this._parser;
};

Launcher.prototype._getFormatter = function (options) {
    if (!this._formatter) {
        this._formatter = new formatter.Formatter(options);
    } else if (options) {
        this._formatter.configure(options);
    }
    return this._formatter;
};

Launcher.prototype._printMessage = function (message) {
    util.puts(message);
    return this;
};

Launcher.prototype._printError = function (error) {
    util.puts(error);
    return this;
};


/**
 * Exports
 */
exports.Launcher = Launcher;


if (__filename === process.ARGV[1]) {
    //called as main executable

    var usage = "Usage: " + process.ARGV[0] + " file.js [file2 file3 ...] [options]\n" +
    "Options:\n\n" +
    "  --config FILE     the path to a config.js file with JSLINT options\n" +
    "  --reporter FILE   optional path to a reporter.js file to customize the output\n" +
    "  -h, --help        display this help and exit\n" +
    "  -v, --version     output version information and exit";

    var args = process.ARGV.splice(2);
    var options = {
            formatter: {},
            parser: {}
    };

    args.forEach(function (arg) {
        switch(arg) {
        case '--pretty':
            options.formatter.pretty = true;
            break;
        case '--colors':
            options.formatter.colors = true;
            break;
        default:

            if (arg.indexOf('--format') >= 0) {
                options.formatter.type = arg.split('=')[1];
            }
        }
    });


    var launcher = new Launcher(options);

    launcher.run(args);
}

