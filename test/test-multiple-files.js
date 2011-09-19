var spawn = require('child_process').spawn;


exports.VariousIndents = function (test) {
  test.expect(2);

  var
    child = spawn('./nodelint',
                  [__dirname + '/fixtures/node-4-space-indent.js',
                   __dirname + '/fixtures/node-2-space-indent.js',
                   __dirname + '/fixtures/node-4-space-indent.js']),
    stdout_output = '',
    stderr_output = '';

  child.stdout.addListener('data', function (data) {
    stdout_output += data;
  });

  child.stderr.addListener('data', function (data) {
    stderr_output += data;
  });

  child.addListener('exit', function (code) {
    test.equal(code, 0, 'ok');
    test.equal(stderr_output, '0 errors\n', 'passed');
    test.done();
  });
};
