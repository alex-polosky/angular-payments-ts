import config from './rollup.config.umd.js';
var lib = require('./config-library');
var nameLibrary = lib.nameLibrary;
var PATH_DIST = lib.PATH_DIST;

config.output.format = "es";
config.output.file = PATH_DIST + nameLibrary + ".esm.js";

export default config;