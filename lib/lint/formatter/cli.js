/*jslint indent:4 */
/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var formatter = require('../formatter');

var CONSOLE_STYLES = {
    'font-weight:normal' : null,
    'font-weight:bold' : [1, 22],
    'text-decoration:italic' : [3, 23],
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
        throw new Error('Undefined style "' + style+'"');
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
    this._config.colors = this._vt100;
    this._config.tab = '  ';
    this._config.styles = {
        '*': {
            'font-weight' : 'normal',
            'color' :  'default',
            'text-decoration' :  []
        },
        'file': {
            'font-weight' : 'bold',
            'text-decoration' : ['underline']
        },
        'result': {
            'font-weight' : 'bold'
        },
        'result-valid': {
            'color' : 'green'
        },
        'result-invalid': {
            'color' : 'red'
        },
        'result-error-count': {
            'font-weight' : 'bold'
        },
        
        'error-line': {
            'font-weight' : 'bold'
        },
        'error-evidence': {
            'font-weight' : 'bold',
            'color' : 'yellow'
        },
        'error-character': {
            'font-weight' : 'bold'
        },
        'error-reason': {
            'color' : 'grey'
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

        Formatter.super_.prototype.configure.call(this, options);

        if (options.colors !== undefined) {
            this._config.colors = options.colors;
        }

        if (options.styles) {
            for (styleClass in options.styles) {
                styleClassAttributes = options.styles[styleClass];
                
                this._config.styles[styleClass] = this._config.styles[styleClass] || {};
                
                for (styleClassAttribute in styleClassAttributes) {
                    this._config.styles[styleClass][styleClassAttribute] = styleClassAttributes[styleClassAttribute];
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
    var errorCount, hasError, output;
    
    errorCount = data.length;
    hasError = errorCount === 0;
    
    output = '';
    output += this._stylize(this._stylize(hasError ? '✓ Valid' : '✗ Invalid', 'result'), hasError ? 'result-valid' : 'result-invalid') + ' » ';
    output += this._stylize(errorCount, 'result-error-count') + ' error' + ((errorCount === 1) ? '' : 's');

    return output;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
    var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, length, output, file, error, reportIndexed, hasError;

    errorCount = data.length;
    hasError = errorCount === 0;
        
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
            output += this._line(0, '♢ ' + this._stylize(file, 'file'));
            output += this._line(0);
            
            reportIndexed[file].forEach(function (error, errorIndex) {
                output += this._line(1, 
                        this._stylize(errorIndex + ')', 'error-index') + ' ' +
        
                        this._stylize((error.evidence || '').replace(error_regexp, "$1"), 'error-evidence') + ' ' + 
                        this._stylize('//' + error.reason, 'error-reason') 
                );
        
                output += this._line(2, 'At line ' + this._stylize(error.line, 'error-line') + 
                        ', ' + 
                        'character ' + this._stylize(error.character, 'error-character')
                );
                output += this._line(0);
            }.bind(this));
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
        return this._config.eol;
    }
    return this._indent(indentation, content + this._config.eol);
};

Formatter.prototype._indent = function (count, content) {
    if (this._config.tab === '') {
        return content;
    }

    var output = '';
    while (count > 0) {
        output += this._config.tab;
        count -= 1;
    }
    output += content;
    return output;
};

Formatter.prototype._stylize = function (str, klass) {
    if (!this._config.colors) {
        return str;
    }
    var output, style, styleRoot, styleClass, styleAttribute;
    
    style = this._styleCache[klass];
    if (!style) {
        this._styleCache[klass] = {};
        
        style = this._styleCache[klass];
        styleRoot = this._config.styles['*'];
        styleClass = this._config.styles[klass];
        
        if(styleRoot) {
            for (styleAttribute in styleRoot) {
                style[styleAttribute] = styleRoot[styleAttribute];
            }
        }
        
        if(styleClass) {
            for (styleAttribute in styleClass) {
                style[styleAttribute] = styleClass[styleAttribute];
            }
        }
    }

    output = str;
    output = stylize(output, 'font-weight:' + style['font-weight']);
    output = stylize(output, 'color:' + style['color']);
    
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
