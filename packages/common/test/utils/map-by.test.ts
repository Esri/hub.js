import { mapBy } from "../../src/utils/map-by";

describe("mapBy", function () {
  it("maps by prop", function () {
    const arr = [{ foo: "bar" }, { foo: "baz" }];
    const res = mapBy("foo", arr);
    expect(res).toEqual(["bar", "baz"]);
  });

  it("defaults to empty array", function () {
    const res = mapBy("foo");
    expect(res).toEqual([]);
  });
});
