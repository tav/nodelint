/*jslint indent:4 */
/**
 * Imports
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var path = require('path');
var fs = require('fs');
var parser = require('./parser');
var formatter = require('./formatter');


var __readDirectory = function (path, callback, filter) {
    if (filter) {
        // process filter. are we too deep yet?
        if (!filter.depthAt) {
            filter.depthAt = 1;// initialize what depth we are at
        }
        if (filter.depth && filter.depth < filter.depthAt) {
            callback(undefined, []);// we are too deep. return "nothing found"
            return;
        }
    }
    // queue up a "readdir" file system call (and return)
    fs.readdir(path, function (err, files) {
        var doHidden, count, countFolders, data;
        
        if (err) {
            callback(err);
            return;
        }
        doHidden = false;               // true means: process hidden files and folders
        if (filter && filter.hidden) {
            doHidden = true;                // filter requests to process hidden files and folders
        }
        count = 0;                      // count the number of "stat" calls queued up
        countFolders = 0;               // count the number of "folders" calls queued up
        data = [];                      // the data to return

        // iterate over each file in the dir
        files.forEach(function (name) {
            var obj, processFile;
            
            // ignore files that start with a "." UNLESS requested to process hidden files and folders
            if (doHidden || name.indexOf(".") !== 0) {
                // queue up a "stat" file system call for every file (and return)
                count += 1;
                fs.stat(path + "/" + name, function (err, stat) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    processFile = true;
                    if (filter && filter.callback) {
                        processFile = filter.callback(name, stat, filter);
                    }
                    if (processFile) {
                        obj = {};
                        obj.name = name;
                        obj.stat = stat;
                        data.push(obj);
                        if (stat.isDirectory()) {
                            
                            countFolders += 1;
                            // perform "readDirectory" on each child folder (which queues up a readdir and returns)
                            (function (obj2) {
                                // obj2 = the "obj" object
                                __readDirectory(path + "/" + name, function (err, data2) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    // entire child folder info is in "data2" (1 fewer child folders to wait to be processed)
                                    countFolders -= 1;
                                    obj2.children = data2;
                                    if (countFolders <= 0) {
                                        // sub-folders found. This was the last sub-folder to processes.
                                        callback(undefined, data);      // callback w/ data
                                    } else {
                                        // more children folders to be processed. do nothing here.
                                    }
                                });
                            })(obj);
                        }
                    }
                    // 1 more file has been processed (or skipped)
                    count -= 1;
                    if (count <= 0) {
                        // all files have been processed.
                        if (countFolders <= 0) {
                            // no sub-folders were found. DONE. no sub-folders found
                            callback(undefined, data);      // callback w/ data
                        } else {
                            // children folders were found. do nothing here (we are waiting for the children to callback)
                        }
                    }
                });
            }
        });
        if (count <= 0) {   // if no "stat" calls started, then this was an empty folder
            callback(undefined, []);        // callback w/ empty
        }
    });
};


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
    var report, onValidateFileCount, onValidateFile, thisLauncher;

    thisLauncher = this;
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
        thisLauncher._validateFile(file,  onValidateFile);
    });
};

/**
 * Run the executer with specified args
 * 
 * @param {Object} args
 * @return {int} code
 */
Launcher.prototype.run = function (args) {
    var thisLauncher, searchFilters, searchRoot;
    
    thisLauncher = this;
    searchRoot = process.cwd();
    searchFilter = function (fileName, fileStat) {
        if (fileName.substring(fileName.length - 3) !== '.js') {
            return false;
        }
        return true;
    };
                   
    this._findFiles(searchRoot, searchFilter, function (error, files) {

        var report, onValidateFileCount, onValidateFile;
        if (error) {
            thisLauncher._printError(error);
        } else {

            thisLauncher.validateFiles(files, function (error, report) {
                thisLauncher._printMessage(thisLauncher._formatReport(report), function (error, result) {
                    process.exit(report.length > 0 ? 1 : 0);
                });
            });
        }
    });
    return 0;
};

Launcher.prototype._findFiles = function (searchRoot, searchFilter, callback) {
    var files, searchFilter;
    
    searchFilter = searchFilter || function () {
        return true;
    };
                          
                          
    files = [];
    searchRoot = searchRoot || process.cwd();
    searchFind = function (result, rootPath, filter) {
        var files = [], i;
        rootPath = rootPath || '/';
        if (! Array.isArray(result)) {
            if (result.stat.isFile()) {
                if (! filter(rootPath, result.stat)) {
                    return files;
                }
                files.push(rootPath);
                
            } else {
                result.children.forEach(function (child) {
                    files = files.concat(searchFind(child, path.join(rootPath, child.name), filter));
                });
            }
        } else {
            result.forEach(function (file) {
                files = files.concat(searchFind(file, path.join(rootPath, file.name), filter));
            });
        }
        return files;
    };

    fs.stat(searchRoot, function (error, stat) {
        if (error) {
            if (callback) {
                callback(error);
            }
        } else {
            if (stat.isDirectory()) {
                __readDirectory(searchRoot, function (error, result) {
                    if (error) {
                        if (callback) {
                            callback(error);
                        }
                    } else {
                        if (result) {
                            files = searchFind(result, searchRoot, searchFilter);
                        }
                        callback(undefined, files);
                    }
                });
                
            } else {
                files.push(searchRoot);
            }
        }
    });
    
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

Launcher.prototype._printMessage = function (message, callback) {
    process.stdout.write(message, this._getFormatter().encoding, callback);
    return this;
};

Launcher.prototype._printError = function (error) {
    util.print(error);
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
        formatter: {

        },
        parser: {
            //Nothing
        }
    };

    args.forEach(function (arg) {
        switch (arg) {
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
        
            if (arg.indexOf('--mode') >= 0) {
                options.formatter.mode = arg.split('=')[1];
            }
        }
    });


    var launcher = new Launcher(options);

    launcher.run(args);
}

