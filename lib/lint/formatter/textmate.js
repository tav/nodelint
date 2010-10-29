var util = require('util');
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
Formatter.prototype.formatSimple = function () {
	return this.formatNormal();
};

Formatter.prototype.formatNormal = function() {
	var len = results.length, output = '', printer = {
		getOutput: function(){
			var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, len = results.length, output = '', file, error;
			
			for (i = 0; i < len; i += 1) {
				file = results[i].file;
				file = file.substring(file.lastIndexOf('/') + 1, file.length);
				error = results[i].error;
				
				output += file + ': line ' + error.line +
				', character ' +
				error.character +
				', ' +
				error.reason +
				'\n' +
				(error.evidence || '').replace(error_regexp, "$1") +
				'\n\n';
			}
			return output;
		}
	};
	
	if (len > 0 && len < 2) {
		output += printer.getOutput(results);
	}
	output += len + ' error' + ((len === 1) ? '' : 's');
	
	if (len > 0) {
		sys.puts(output);
	}
};

Formatter.prototype.formatFull = function () {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
      i,
      length = results.length,
      output = '',
      html = '',
      file,
      error,
      reason,
      line,
      character;

  for (i = 0; i < length; i += 1) {
    file = results[i].file;
    error = results[i].error;
    reason = error.reason;
    line = error.line;
    character = error.character;
    output += '<li>' + 
                '<a href="txmt://open?url=file://' + file + '&line=' + 
                                line + '&column=' + character + '">' +
                  '<strong>' + reason + '</strong>' +
                  ' <em>line ' + line + 
                  ', character ' + character + '</em>' +
                '</a>' +
                '<pre><code>' + 
                  (error.evidence || '').replace(error_regexp, "$1") +
                '</pre></code>' +
              '</li>';
  }
  
  html += '<html>' +
            '<head>' +
              '<style type="text/css">' +
                'body {font-size: 14px;}' +
                'pre { background-color: #eee; color: #400; margin: 3px 0;}' +
                'h1, h2 { font-family:"Arial, Helvetica"; margin: 0 0 5px; }' +
                'h1 { font-size: 20px; }' +
                'h2 { font-size: 16px;}' +
                'a { font-family:"Arial, Helvetica";}' +
                'ul { margin: 10px 0 0 20px; padding: 0; list-style: none;}' +
                'li { margin: 0 0 10px; }' +
              '</style>' +
            '</head>' +
            '<body>' +
              '<h1>' + length + ' Error' + ((length === 1) ? '' : 's') + '</h1>' +
              '<hr/>' +
              '<ul>' +
                output +
              '</ul>' +
            '</body>' +
          '</html>';
	return html;
};





