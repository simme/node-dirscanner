DirScanner
----------
Traverses a given directory and builds a tree from its structure.

# Installation

`npm install dirscanner`

# Usage

## API

`dirscanner(target, ignore, start);`

* _target_

  The path to scan.

* _ignore_

  Optional array of regexp objects. Any _basename_ matching this pattern will
  **not** be scanned. Might be expanded to include full paths in the future.

* _start_

  Third optional argument, pass _false_ if you don't want the dirscanner to
  start immediately.

## Example

Start scan in target directory.

```js
var dirscanner = require('dirscanner');
var ds = dirscanner('/path/to/directory/to/scan');
ds.on('done', function (root) {
  console.log('Scan complete\nHere\'s the root obejct:', root);
});
```
