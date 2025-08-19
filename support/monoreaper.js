const fs = require('fs');
const path = require('path');

// update root eslint config (in place)
const eslintConfigPath = path.resolve('./.eslintrc.js');

const eslintConfig = fs.readFileSync(eslintConfigPath, 'utf8');
const updatedConfig = eslintConfig.replace('"./.eslintrc-baseline.js",', '');

fs.writeFileSync(eslintConfigPath, updatedConfig, 'utf8');

// copy root tsconfig to common
const srcConfigPath = path.resolve('./tsconfig.json');
const destConfigPath = path.resolve('./packages/common/tsconfig.json');

const srcConfig = fs.readFileSync(srcConfigPath, 'utf8');
const destConfig = srcConfig.replace('"packages/**/*.ts",', '"./src/**/*.ts",\n   "./types/**/*.ts",');

fs.writeFileSync(destConfigPath, destConfig, 'utf8');

// copy parts of root package.json to common
const srcPackagePath = path.resolve('./package.json');
const destPackagePath = path.resolve('./packages/common/package.json');

const srcPackage = JSON.parse(fs.readFileSync(srcPackagePath, 'utf8'));
const destPackage = JSON.parse(fs.readFileSync(destPackagePath, 'utf8'));

destPackage.repository = srcPackage.repository;
destPackage.husky = srcPackage.husky;
destPackage['lint-staged'] = srcPackage['lint-staged'];
destPackage.volta = srcPackage.volta;

const devDependencies = [
  '@types/jasmine',
  '@types/node',
  '@types/fetch-mock',
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint",
  "eslint-plugin-disable",
  'fetch-mock',
  'lint-staged',
  'prettier'
];
devDependencies.forEach(dep => {
  if (srcPackage.devDependencies[dep]) {
    destPackage.devDependencies[dep] = srcPackage.devDependencies[dep];
  }
});

const scripts = [
  "lint",
  "lint:warnings",
  "lint:fix"
];
scripts.forEach(script => {
  if (srcPackage.scripts[script]) {
    destPackage.scripts[script] = srcPackage.scripts[script].replace("./packages/*/", "./");
  }
});
fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2), 'utf8');
