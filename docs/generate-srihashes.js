/**
 * Generate a JSON file containing hash of packages and sha384 hashes of minified umd dist files.
 */
const { join } = require("path");
const { readFile, writeFile } = require("fs");
const { generate } = require("sri-toolbox");
const OUTPUT = join(process.cwd(), "docs", "src", `srihashes.json`);
const version = require(join(process.cwd(), "lerna.json")).version;
const fs = require("fs");
const path = require("path");

/**
 * Now we need to discover all the `@esri/hub-*` package names so we can create
 * the `globals` and `externals` to pass to Rollup.
 */
const packages = fs
  .readdirSync(path.join(__dirname, "../packages"))
  .filter(p => p[0] !== ".")
  .map(p => {
    return require(path.join(__dirname, "../packages", p, "package.json")).name/*.replace("@esri/hub-", "")*/;
  }, {});

const promises = [];

packages.forEach(package => {
  const pkg = package.replace("@esri/hub-", "");
  const promise = new Promise((resolve, reject) => {
    readFile(path.join(__dirname, `../packages/${pkg}/dist/umd/${pkg}.umd.min.js`), (err, data) => {
      err ? resolve({
        package,
        hash: false
      }) : resolve({
        package,
        hash: generate({
          algorithms: ["sha384"]
        }, data)
      });
    });
  });
  promises.push(promise);
});

Promise.all(promises).then((res) => {
  const json = {
    version,
    packages: {}
  };
  res.forEach((r) => {
    if (r.hash) json.packages[r.package] = r.hash;
  });
  writeFile(OUTPUT, JSON.stringify(json, null, '  '), "utf8", (err) => {
    if (err) throw err;
  });
}).catch((err) => {
  // make node happy to see `catch()`
});