const shell = require('shelljs');

shell.rm('-rf', './dist/lib');
shell.mkdir('./dist/lib');
shell.cp('-R', './src/lib', './dist');
