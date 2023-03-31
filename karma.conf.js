// Karma configuration
// Generated on Thu Jul 13 2017 11:01:30 GMT-0700 (PDT)
const fs = require("fs");

module.exports = function (config) {
  const configObj = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript"],

    // list of files / patterns to load in the browser
    files: ["packages/*/{src,test}/**/*.ts"],

    // list of files to exclude
    exclude: [],

    karmaTypescriptConfig: {
      coverageOptions: {
        // uncomment the next flag to disable coverage, and
        // enable debugging in the browser
        // if left true, the source maps won't actually match up
        // instrumentation: false,

        // don't report coverage on fixtures or tests
        exclude: [
          /\.(d|spec|test|e2e|node-utils)\.ts$/i,
          /fixture*/,
          /mocks*/,
          /test-helpers*/,
        ],
        threshold: {
          global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
            // don't compute coverage for the tests themselves
            excludes: ["packages/*/test/**/*.ts", "packages/*/e2e/**/*.ts"],
          },
        },
      },
      reports: {
        json: {
          directory: "coverage",
          filename: "coverage.json",
        },
        html: "coverage",
      },
      compilerOptions: {
        module: "commonjs",
      },
      tsconfig: "./tsconfig.json",
      bundlerOptions: {
        transforms: [require("karma-typescript-es6-transform")()],
        exclude: ["@esri/arcgis-rest-types"],
        resolve: {
          // karmas resolver cant figure out the symlinked deps from lerna
          // so we need to manually alias each package here.
          alias: fs
            .readdirSync("packages")
            .filter((p) => p[0] !== ".")
            .reduce((alias, p) => {
              alias[`@esri/hub-${p}`] = `packages/${p}/src/index.ts`;
              return alias;
            }, {}),
        },
      },
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      // replace "dots" with "spec" to get verbose info on tests, including timing
      "dots",
      "jasmine-diff",
      "karma-typescript",
    ],

    // NOTE: this is only used when when reporters includes "spec"
    specReporter: {
      // useful for identifying long-running tests
      showSpecTiming: true,
      // useful when using fdescribe() or fit()
      // suppressSkipped: true
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'Chrome',
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      // 'IE'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
  };

  if (process.env.COVERAGE) {
    // send coverage report to terminal
    configObj.karmaTypescriptConfig.reports.text = null;
  }

  config.set(configObj);
};
