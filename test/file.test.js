//
// # Test File
//

var assert = require('assert');
var File   = require('./../lib/file');

suite('File:', function () {
  test('Path set correctly', function () {
    var path = __dirname + '/foo/a.txt';
    var f = File(path);
    assert.equal(path, f.path);
  });

  test('Parent set correctly', function () {
    var path = __dirname + '/foo/a.txt';
    var f = File(path, {foo: 'bar'});
    assert.equal('bar', f.parent.foo);
  });

  test('Read stream correctly created.', function (done) {
    var path = __dirname + '/foo/a.txt';
    var f = File(path);
    var s = f.readStream();
    var buff = '';
    s.on('data', function (data) {
      buff += data.toString();
    });
    s.on('end', function () {
      assert.equal('aaa\n', buff);
      done();
    });
  });
});

