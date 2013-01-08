//
// # Represents a file
//

var fs = require('fs');

//
// ## Constructor
//
// Creates a new file with the given path and parent.
//
var File = function (path, parent) {
  this.path   = path;
  this.parent = parent;
};

//
// ## Create read stream
//
// Reurns a read stream for this file.
//
File.prototype.readStream = function() {
  return fs.createReadStream(this._path);
};

//
// ## Export
//
module.exports = function (path, parent) {
  return new File(path, parent);
};

