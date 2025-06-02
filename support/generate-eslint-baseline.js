const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// RUN npx eslint --ext .ts --format json ./packages > eslint-errors.json
const eslintOutput = fs.readFileSync("./eslint-errors.json", "utf8");
const eslintResults = JSON.parse(eslintOutput);
console.log(`ESLint completed with, starting generation of baseline...`);
// Files with errors
const filesWithErrors = eslintResults
  .filter((result) => result.messages.length > 0)
  .map((result) => path.relative(process.cwd(), result.filePath));

// Write to a config file
const config = {
  plugins: ["disable"],
  processor: "disable/disable",
  overrides: [
    {
      files: filesWithErrors,
      rules: {
        // Convert all errors to warnings for these files
      },
    },
  ],
};

// Get all rule IDs that were triggered
const allRules = new Set();
eslintResults.forEach((result) => {
  result.messages.forEach((msg) => {
    if (msg.ruleId) {
      allRules.add(msg.ruleId);
    }
  });
});

// Create rule warnings
const ruleWarnings = {};
Array.from(allRules).forEach((rule) => {
  ruleWarnings[rule] = "warn";
});

// Add rules to config
config.overrides[0].rules = ruleWarnings;

fs.writeFileSync(
  ".eslintrc-baseline.js",
  `module.exports = ${JSON.stringify(config, null, 2)};`
);

console.log(
  `ESLint baseline generated with ${filesWithErrors.length} files and ${allRules.size} rules.`
);
