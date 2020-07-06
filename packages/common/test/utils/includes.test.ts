import { includes } from "../../src";

describe("includes", function() {
  it("returns TRUE when val exists in array", function() {
    const arr = ["a", "b", "c", "d"];
    const val = "b";
    expect(includes(arr, val)).toBeTruthy();
  });

  it("returns FALSE when val does NOT exist in array", function() {
    const arr = ["a", "b", "c", "d"];
    const val = "e";
    expect(includes(arr, val)).toBeFalsy();
  });
});
