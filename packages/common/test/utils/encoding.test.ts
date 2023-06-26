import { unicodeToBase64, base64ToUnicode } from "../../src/utils/encoding";

describe("encoding", () => {
  // expected values taken from:
  // https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
  const unicodeString = "a Ā 𐀀 文 🦄";
  const encodedString = "YSDEgCDwkICAIOaWhyDwn6aE";
  it("unicodeToBase64", () => {
    expect(unicodeToBase64(unicodeString)).toBe(encodedString);
  });
  it("base64ToUnicode", () => {
    const results = base64ToUnicode(encodedString);
    expect(results).toBe(unicodeString);
  });
});
