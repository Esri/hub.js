import { convertUrlsToAnchorTags } from "../../src/urls/convert-urls-to-anchor-tags";
import { describe, it, expect } from "vitest";

describe("convertUrlsToAnchorTags", function () {
  it("converts the url in a string to hyperlink", function () {
    const content = "Hello, https://foo.bar is supposed to be a hyperlink";
    expect(convertUrlsToAnchorTags(content)).toBe(
      'Hello, <a target="_blank" href="https://foo.bar">https://foo.bar</a> is supposed to be a hyperlink'
    );
  });

  it("converts multiple urls in a string to hyperlinks", function () {
    const content =
      "Hello, https://foo.baz and https://bar.baz are supposed to be hyperlinks";
    expect(convertUrlsToAnchorTags(content)).toBe(
      'Hello, <a target="_blank" href="https://foo.baz">https://foo.baz</a> and <a target="_blank" href="https://bar.baz">https://bar.baz</a> are supposed to be hyperlinks'
    );
  });

  it("returns the same string if a string does not contain any url", function () {
    const content = "Hello, there is no urls here";
    expect(convertUrlsToAnchorTags(content)).toBe(
      "Hello, there is no urls here"
    );
  });
});
