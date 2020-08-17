/* tslint:disable no-console */

import { Logger, Level } from "../../src/utils/logger";

describe("Logger |", function() {
  beforeEach(() => {
    spyOn(console, "log")
      .and.stub()
      .calls.reset();
    spyOn(console, "debug")
      .and.stub()
      .calls.reset();
    spyOn(console, "info")
      .and.stub()
      .calls.reset();
    spyOn(console, "warn")
      .and.stub()
      .calls.reset();
    spyOn(console, "error")
      .and.stub()
      .calls.reset();
  });

  const levels: Level[] = [
    Level.all,
    Level.debug,
    Level.warn,
    Level.info,
    Level.error,
    Level.off
  ];
  levels.forEach((level: Level) => testLogLevel(level));
});

function testLogLevel(testLevel: Level) {
  const isAvailable = (fnLevel: Level) => testLevel <= fnLevel;
  describe(`Test ${Level[testLevel]} Log Level |`, () => {
    beforeEach(() => {
      Logger.setLogLevel(testLevel);
    });
    it(`Logger.log ${
      isAvailable(Level.debug) ? "does" : "does not"
    } log when level set to ${Level[testLevel]}`, () => {
      const numCalls = +isAvailable(Level.debug);
      Logger.log("message");
      expect(console.log).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.debug ${
      isAvailable(Level.debug) ? "does" : "does not"
    } log when level set to ${Level[testLevel]}`, () => {
      const numCalls = +isAvailable(Level.debug);
      Logger.debug("message");
      expect(console.debug).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.info ${
      isAvailable(Level.info) ? "does" : "does not"
    } log when level set to ${Level[testLevel]}`, () => {
      const numCalls = +isAvailable(Level.info);
      Logger.info("message");
      expect(console.info).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.warn ${
      isAvailable(Level.warn) ? "does" : "does not"
    } log when level set to ${Level[testLevel]}`, () => {
      const numCalls = +isAvailable(Level.warn);
      Logger.warn("message");
      expect(console.warn).toHaveBeenCalledTimes(numCalls);
    });
    it(`Logger.error ${
      isAvailable(Level.error) ? "does" : "does not"
    } log when level set to ${Level[testLevel]}`, () => {
      const numCalls = +isAvailable(Level.error);
      Logger.error("message");
      expect(console.error).toHaveBeenCalledTimes(numCalls);
    });
  });
}
