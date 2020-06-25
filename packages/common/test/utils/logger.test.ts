import { Logger } from "../../src/utils/logger";

import * as moduleToMock from '../../src/utils/get-query-params';

enum Level {
  log = 'log',
  warn = 'warn',
  info = 'info',
  error = 'error'
}

describe("Logger", function() {
  const levels: Level[] = [Level.log, Level.warn, Level.info, Level.error]
  levels.forEach((level: Level) => testLogLevel(level));
});

function testLogLevel(level: Level) {

  it(`Doesn't log to ${level} when debug flag is non-existant`, () => {
    spyOn(moduleToMock, "getQueryParams").and.callFake(() => ({}));
    spyOn(console, level);
    Logger[level](null, 'This should not log');
    expect(console[level]).toHaveBeenCalledTimes(0)
  });

  it(`Log to ${level} when debug flag is truthy`, () => {
    const flagValues = [true, 'true', 1];
    const getQueryParamsSpy = spyOn(moduleToMock, "getQueryParams");
    spyOn(console, level);
    flagValues.forEach((flagValue) => {
      getQueryParamsSpy.and.callFake(() => ({debug: flagValue}));
      Logger[level](null, 'This should log');
    });
    expect(console[level]).toHaveBeenCalledTimes(flagValues.length);
    expect(console[level]).toHaveBeenCalledWith('This should log');
    
  });

  it(`Log to ${level} with multiple arguments`, () => {
    const obj = { name: 'test' };
    spyOn(moduleToMock, "getQueryParams").and.callFake(() => ({debug: true}));
    spyOn(console, level);
    Logger[level](null, 'This should log', 1, obj);
    expect(console[level]).toHaveBeenCalledWith('This should log', 1, obj);
  });
}