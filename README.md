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


config
------

You can set JSLINT options by modifying the default `config.js` file.
Also, you can override it by passing another config file
with the optional `--config` parameter, e.g.

    $ nodelint.js file1 file2 --config path/to/your/config/file.js

For example, if you have config.js:

    var options = {
        adsafe     : false,
        bitwise    : true,
        error_prefix: "\u001b[1m",
        error_suffix: ":\u001b[0m "
    };

and you own path/to/your/config/file.js:

    var options = {
        bitwise    : false,
        browser    : false,
    };

then actual options with this run command will be:

    var options = {
        adsafe     : false,
        bitwise    : false,
        browser    : false,
        error_prefix: "\u001b[1m",
        error_suffix: ":\u001b[0m "
    };

Take a look at [JSLINT's Options] to see what to put in the `options` variable.


contribute
----------

To contribute any patches, simply fork this repository using GitHub and send a
pull request to me <<http://github.com/tav>>. Thanks!


credits
-------

- [tav], wrote nodelint.js

- [Felix Geisendörfer][felixge], clarified Node.js specific details

- [Douglas Crockford], wrote the original JSLint and rhino.js runner

- [Nathan Landis][my8bird], updated nodelint.js to Node's new API.

- [Oleg Efimov][Sannis], updated nodelint.js to be run from a symlink.

- [Corey Hart], updated nodelint.js with multiple files and config support.

[tav]: http://tav.espians.com
[felixge]: http://debuggable.com
[Douglas Crockford]: http://www.crockford.com
[my8bird]: http://github.com/my8bird
[Sannis]: http://github.com/Sannis
[Corey Hart]: http://www.codenothing.com

[JSLINT's Options]: http://www.jslint.com/lint.html#options
