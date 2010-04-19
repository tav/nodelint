// example shell call: $ node nodelint.js nodelint.js --reporter reporters/summarize.js

var sys = require('sys');

function reporter(results) {
  var len = results.length;
  sys.puts(len + ' error' + ((len === 1) ? '' : 's'));
}