/*jslint indent:4 */
/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var formatter = require('../formatter');

var CONSOLE_STYLES = {
    'font-weight:normal' : null,
    'font-weight:bold' : [1, 22],
    
    'font-style:normal' : null,
    'font-style:italic' : [3, 23],
    
    'text-decoration:underline' : [4, 24],
    
    'color:default' : null,
    'color:cyan' : [96, 39],
    'color:yellow' : [33, 39],
    'color:green' : [32, 39],
    'color:red' : [31, 39],
    'color:grey' : [90, 39],
    'color:green-hi' : [92, 32]
};

var stylize = function (str, style) {
    
    var styleDefinition = CONSOLE_STYLES[style];
    
    if (styleDefinition === undefined) {
        throw new Error('Undefined style "' + style + '"');
    }
    
    if (styleDefinition === null) {
        return str;
    }
    
    return '\033[' + styleDefinition[0] + 'm' + str +
           '\033[' + styleDefinition[1] + 'm';
};

/**
 * Formatter constructor
 * 
 * @constructor
 * @extends lint.formatter.Base
 * @param {Object} options
 */
function Formatter(options) {
    options = options || {};
    formatter.Base.call(this, options);

    this._vt100 = this._guessVt100();
    
    // customize the error reporting -- the following colours the text red
    this.colors = this._vt100;
    this.tab = '  ';
    this.styles = {
        '*': {
            'font-style' : 'normal',
            'font-weight' : 'normal',
            'color' :  'default',
            'text-decoration' :  []
        },
        'file': {
            'font-weight' : 'bold',
            'text-decoration' : ['underline']
        },
        'file-error-count': {
            'font-weight' : 'bold'
        },
        'summary-result': {
            'font-weight' : 'bold'
        },
        'summary-result-valid': {
            'color' : 'green'
        },
        'summary-result-invalid': {
            'color' : 'red'
        },
        'summary-file-count': {
            'font-weight' : 'bold'
        },
        'summary-error-count': {
            'font-weight' : 'bold'
        },
        
        'error-line': {
            'font-weight' : 'bold'
        },
        'error-character': {
            'font-weight' : 'bold'
        },
        'error-position': {
            'color' : 'grey'
        },
        
        'error-evidence': {
            'font-weight' : 'bold',
            'color' : 'yellow'
        },
        'error-reason': {
            'font-style' : 'italic'
        }
    };
    this._styleCache = {};
    
    this.configure(options);
}
util.inherits(Formatter, formatter.Base);

/**
 * Configure the Formatter
 * 
 * @param {Object} options
 * @return this
 */
Formatter.prototype.configure = function (options) {
    if (options) {
        var styleClass, styleClassAttributes, styleClassAttribute;
        
        Formatter.super_.prototype.configure.call(this, options);

        if (options.colors !== undefined) {
            this.colors = options.colors;
        }

        if (options.styles) {
            for (styleClass in options.styles) {
                styleClassAttributes = options.styles[styleClass];
                
                this.styles[styleClass] = this.styles[styleClass] || {};
                
                for (styleClassAttribute in styleClassAttributes) {
                    this.styles[styleClass][styleClassAttribute] = styleClassAttributes[styleClassAttribute];
                }
                
            }
            this._styleCache = {};
        }
    }
    return this;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatSimple = function (data) {
    var errorCount, fileCount, hasError, output, files;
    
    errorCount = data.length;
    hasError = errorCount === 0;
    
    //Index by files
    files = [];
    data.forEach(function (row) {
        if (files.indexOf(row.file) < 0) {
            files.push(row.file);
        }
    });
    fileCount = files.length;
    
    output = '';
    output += this._stylize(this._stylize(hasError ? '✓ Valid' : '✗ Invalid', 'summary-result'), hasError ? 'summary-result-valid' : 'summary-result-invalid') + ' » ';
    output += this._stylize(fileCount, 'summary-file-count') + ' file' + ((fileCount === 1) ? '' : 's');
    output += ' ∙ ';
    output += this._stylize(errorCount, 'summary-error-count') + ' error' + ((errorCount === 1) ? '' : 's');

    return this._line(0, output);
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
    var thisFormatter, error_regexp, output, file, error, reportIndexed, errorCount, errorCountProcessed, hasError;
    
    thisFormatter = this;
    error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/;
    errorCount = data.length;
    errorCountProcessed = 0;
    hasError = errorCount > 0;
        
    output = '';
    if (hasError) {
        reportIndexed = {};
        data.forEach(function (row) {
            file = row.file;
            error = row.error;
            
            reportIndexed[file] = reportIndexed[file] || [];
            reportIndexed[file].push(error);
        });
         
        for (file in reportIndexed) {
            output += this._line(0, '♢ ' + this._stylize(file, 'file') + ' (' + this._stylize(reportIndexed[file].length, 'file-error-count') + ')');

            reportIndexed[file].forEach(function (error, errorIndex) {
                output += thisFormatter._line(1, 
                    thisFormatter._stylize((errorIndex + 1) + ')', 'error-index') + ' ' +
                    thisFormatter._stylize((error.evidence || '').replace(error_regexp, "$1"), 'error-evidence') + ' ' + 
                    
                    thisFormatter._stylize(' //' +
                        'line ' + thisFormatter._stylize(error.line, 'error-line'), 
                    'error-position')
                        
                    //this._stylize('//' + error.reason, 'error-reason') 
                );
                
                
                
                /*output += this._line(2, 'At line ' + this._stylize(error.line, 'error-line') + 
                        ', ' + 
                        'character ' + this._stylize(error.character, 'error-character')
                ); */
                output += thisFormatter._line(2,  thisFormatter._stylize('» ' + error.reason, 'error-reason'));
                
                errorCountProcessed += 1;
            });
            
            output += this._line(0);
        }
    }
    
    //sum up
    output += this._formatSimple(data);
    return output;
};

/**
 * @return {string}
 */
Formatter.prototype._formatFull = function (data) {
    var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, length = data.length, output = '', file, error;

    for (i = 0; i < length; i += 1) {
        file = data[i].file;
        file = file.substring(file.lastIndexOf('/') + 1, file.length);

        error = data[i].error;
        output += this._line(0, file + ': line ' + error.line + ', character ' + error.character + ', ' + error.reason);
        output += this._line(0, (error.evidence || '').replace(error_regexp, "$1"));
    }

    if (length > 0) {
        output += this._line(0, length + ' error' + ((length === 1) ? '' : 's'));
        return output;
    } else {
        return 'Lint free!';
    }
};

Formatter.prototype._line = function (indentation, content) {
    if (!content || content === '') {
        return this.eol;
    }
    return this._indent(indentation, content + this.eol);
};

Formatter.prototype._indent = function (count, content) {
    if (this.tab === '') {
        return content;
    }

    var output = '';
    while (count > 0) {
        output += this.tab;
        count -= 1;
    }
    output += content;
    return output;
};

Formatter.prototype._stylize = function (str, klass) {
    if (!this.colors) {
        return str;
    }
    var output, style, styleRoot, styleClass, styleAttribute;
    
    style = this._styleCache[klass];
    if (!style) {
        this._styleCache[klass] = {};
        
        style = this._styleCache[klass];
        styleRoot = this.styles['*'];
        styleClass = this.styles[klass];
        
        if (styleRoot) {
            for (styleAttribute in styleRoot) {
                style[styleAttribute] = styleRoot[styleAttribute];
            }
        }
        
        if (styleClass) {
            for (styleAttribute in styleClass) {
                style[styleAttribute] = styleClass[styleAttribute];
            }
        }
    }

    output = str;
    output = stylize(output, 'font-weight:' + style['font-weight']);
    output = stylize(output, 'font-style:' + style['font-style']);
    output = stylize(output, 'color:' + style.color);
    
    //Normalize as array
    if (!Array.isArray(style['text-decoration'])) {
        style['text-decoration'] = [style['text-decoration']];
    }
    
    //do all decoration
    style['text-decoration'].forEach(function (textdecoration) {
        output = stylize(output, 'text-decoration:' + textdecoration);
    });
    
    return output;
};

Formatter.prototype._guessVt100 = function () {
    return false;
};

/**
 * Exports
 */
exports.Formatter = Formatter;
