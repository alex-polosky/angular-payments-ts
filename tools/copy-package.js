const config = require('../config-library');
const PATH_DIST = config.PATH_DIST;

const fs = require('fs');
var contents = fs.readFileSync('./package.json').toString();
fs.writeFileSync(PATH_DIST + 'package.json', contents);

contents = fs.readFileSync('./README.md').toString();
fs.writeFileSync(PATH_DIST + 'README.md', contents);