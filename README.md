nodelint.js
-----------

- [Node] is a [V8] based framework for writing Javascript applications outside
  the browser.

- [JSLint] is a code quality tool that checks for problems in Javascript programs.

- **nodelint.js** lets you run JSLint from the command line.

[Node]: http://nodejs.org/
[V8]: http://code.google.com/p/v8/
[JSLint]: http://www.jslint.com/lint.html


usage
-----

You can use `nodelint.js` directly if you have `node` in your $PATH:

    $ nodelint.js path/to/your/file.js

Otherwise, you need to run it with node:

    $ node nodelint.js path/to/your/file.js

Enjoy!


contribute
----------

To contribute any patches, simply fork this repository using GitHub and send a
pull request to me <<http://github.com/tav>>. Thanks!


credits
-------

- [tav], wrote nodelint.js

- [Felix Geisendörfer][felixge], clarified Node.js specific details

- [Douglas Crockford], wrote the original JSLint and rhino.js runner

[tav]: http://tav.espians.com
[felixge]: http://debuggable.com
[Douglas Crockford]: http://www.crockford.com
