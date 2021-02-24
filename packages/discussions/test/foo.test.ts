import { foo } from "../src";

describe("foo", () => {
  it("returns true", () => {
    expect(foo()).toBeTruthy();
  });
});
