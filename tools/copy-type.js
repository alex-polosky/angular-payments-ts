const config = require('../config-library');
const PATH_DIST = config.PATH_DIST;
const PATH_BUILD = config.PATH_BUILD;

const fs = require('fs');

fs.readdirSync(PATH_BUILD).forEach(file => {
    if (file.endsWith('.d.ts')) {
        var contents = fs.readFileSync(PATH_BUILD + file).toString();
        fs.writeFileSync(PATH_DIST + file, contents);
    }
});