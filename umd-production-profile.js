import config from './umd-base-profile.js';
import filesize from "rollup-plugin-filesize";

// we did this when we were using uglify
// leaving this here in case we do this w/ terser
// add '.min' to the minified UMD filename (and sourcemap)
// config.output.file = config.output.file.replace(".umd.", ".umd.min.");

config.plugins.push(filesize());

export default config;