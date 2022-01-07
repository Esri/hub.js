import { URLify } from "../../src";

fdescribe("URLify", function () {
  it("converts the url in a string to hyperlink", function () {
    const content = "Hello, https://foo.bar is supposed to be a hyperlink";
    expect(URLify(content)).toBe(
      'Hello, <a target="_blank" href="https://foo.bar">https://foo.bar</a> is supposed to be a hyperlink'
    );
  });

  it("converts multiple urls in a string to hyperlinks", function () {
    const content =
      "Hello, https://foo.baz and https://bar.baz are supposed to be hyperlinks";
    expect(URLify(content)).toBe(
      'Hello, <a target="_blank" href="https://foo.baz">https://foo.baz</a> and <a target="_blank" href="https://bar.baz">https://bar.baz</a> are supposed to be hyperlinks'
    );
  });
});
