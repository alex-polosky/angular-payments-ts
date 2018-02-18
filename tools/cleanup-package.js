const config = require('../config-library');
const PATH_DIST = config.PATH_DIST;

const fs = require('fs');

const packageJSON = JSON.parse(fs.readFileSync(PATH_DIST + 'package.json'));

delete packageJSON.devDependencies;
delete packageJSON.scripts;

fs.writeFileSync(PATH_DIST + 'package.json', JSON.stringify(packageJSON, null, 2));