import { generateRandomString } from "../../src";

describe("generateRandomString", function() {
  it("generates a random string", function() {
    const numChars = 23;
    const str1 = generateRandomString(numChars);
    const str2 = generateRandomString(numChars);

    expect(str1.length).toEqual(
      numChars,
      "string 1 has correct number of characters"
    );
    expect(str2.length).toEqual(
      numChars,
      "string 2 has correct number of characters"
    );
    expect(str1).not.toEqual(
      str2,
      "the two strings generated are not the same"
    );
  });
});
