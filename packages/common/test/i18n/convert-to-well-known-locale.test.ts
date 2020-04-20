import { convertToWellKnownLocale } from "../../src";

describe("convertToWellKnownLocale", function() {
  it("leaves the locale alone if supported", function() {
    const supportedLocale = "da";
    expect(convertToWellKnownLocale(supportedLocale)).toBe(supportedLocale);
  });

  it("returns locale root if supported", function() {
    const root = "da";
    const localeWithSupportedRoot = `${root}-foobar`;
    expect(convertToWellKnownLocale(localeWithSupportedRoot)).toBe(root);
  });

  it('falls back to "en"', function() {
    const unsupportedLocale = "foo-bar";
    expect(convertToWellKnownLocale(unsupportedLocale)).toBe("en");
  });
});
