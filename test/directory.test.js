//
// # Test Directory
//

var assert = require('assert');
var Dir    = require('./../lib/directory');

suite('Directory:', function () {
  test('Works without directory scanner.', function (done) {
    var d = new Dir(__dirname + '/foo/bar');
    d.scan();
    d.on('done', function () {
      done();
    });
  });

  test('Correctly finds subdirs.', function (done) {
    var d = new Dir(__dirname + '/foo/bar');
    d.scan();
    d.on('done', function () {
      assert(d.dirs[__dirname + '/foo/bar/1']);
      assert(d.dirs[__dirname + '/foo/bar/2']);
      done();
    });
  });

  test('Correctly finds files.', function (done) {
    var d = new Dir(__dirname + '/foo/bar');
    d.scan();
    d.on('done', function () {
      assert(d.files[__dirname + '/foo/bar/3.txt']);
      assert(d.dirs[__dirname + '/foo/bar/1'].files[__dirname + '/foo/bar/1/1.txt']);
      done();
    });
  });
});

