/* tslint:disable no-console */

import { Logger } from "../../src/utils/logger";
import type { LogLevel } from "../../src/utils/LogLevel";
import * as configModule from "../../src/utils/internal/config";

// NOTE: in order for this test to work
// this array must match the names & order of the Level enum
const levels: LogLevel[] = ["all", "debug", "info", "warn", "error", "off"];

import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";

describe("Logger |", function () {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  levels.forEach((level: LogLevel) => testLogLevel(level));
});

function testLogLevel(testLevel: LogLevel) {
  // this is used to restore the logLevel after each test
  let originalLogLevel: LogLevel;
  const isAvailable = (fnLevel: LogLevel) =>
    levels.indexOf(testLevel) <= levels.indexOf(fnLevel);
  describe(`Test ${testLevel} Log Level |`, () => {
    beforeEach(() => {
      // Save the original value of logLevel
      originalLogLevel = configModule.logLevel;
      // Mock the logLevel value
      Object.defineProperty(configModule, "logLevel", {
        value: testLevel,
        writable: true,
      });
    });
    afterEach(() => {
      // Restore the original value of logLevel
      Object.defineProperty(configModule, "logLevel", {
        value: originalLogLevel,
        writable: true, // false?
      });
    });
    it(`Logger.log ${
      isAvailable("debug") ? "does" : "does not"
    } log when level set to ${testLevel}`, () => {
      const numCalls = +isAvailable("debug");
      Logger.log("message");
      expect(console.log).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.debug ${
      isAvailable("debug") ? "does" : "does not"
    } log when level set to ${testLevel}`, () => {
      const numCalls = +isAvailable("debug");
      Logger.debug("message");
      expect(console.debug).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.info ${
      isAvailable("info") ? "does" : "does not"
    } log when level set to ${testLevel}`, () => {
      const numCalls = +isAvailable("info");
      Logger.info("message");
      expect(console.info).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.warn ${
      isAvailable("warn") ? "does" : "does not"
    } log when level set to ${testLevel}`, () => {
      const numCalls = +isAvailable("warn");
      Logger.warn("message");
      expect(console.warn).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.error ${
      isAvailable("error") ? "does" : "does not"
    } log when level set to ${testLevel}`, () => {
      const numCalls = +isAvailable("error");
      Logger.error("message");
      expect(console.error).toHaveBeenCalledTimes(numCalls);
    });
  });
}
