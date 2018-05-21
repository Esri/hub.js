import config from './umd-base-profile.js';
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";

// add '.min' to the minified UMD filename (and sourcemap)
config.output.file = config.output.file.replace(".umd.", ".umd.min.");

config.plugins.push(filesize());
config.plugins.push(uglify());

export default config;