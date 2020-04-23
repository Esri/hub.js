import { ensureUniqueString } from "../../src";

describe("ensureUniqueString", function() {
  it("returns unmodified string when unique", function() {
    const entries = ["apple", "orange", "grape", "cherry"];
    const res = ensureUniqueString(entries, "pineapple");
    expect(res).toEqual("pineapple");
  });

  it("adds appropriate number to string when not unique", function() {
    const res = ensureUniqueString(
      ["apple", "orange", "grape", "cherry"],
      "cherry"
    );
    expect(res).toEqual("cherry-1");

    const res2 = ensureUniqueString(
      ["apple", "orange", "grape", "grape-1"],
      "grape"
    );
    expect(res2).toEqual("grape-2");
  });
});
