const config = require('../config-library');
const PATH_DIST = config.PATH_DIST;

const fs = require('fs');
let contents = fs.readFileSync('./package.json').toString();
fs.writeFileSync(PATH_DIST + 'package.json', contents);