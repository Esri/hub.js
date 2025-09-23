import { withoutByProp } from "../../src/utils/without-by-prop";

describe("withoutByProp", function () {
  it("removes correct entries", function () {
    const arr = [
      { foo: "remove" },
      { foo: "keep" },
      { foo: "keep2" },
      { foo: "remove" },
      { foo: "keep3" },
    ];

    const res = withoutByProp("foo", "remove", arr);

    expect(res).toEqual([{ foo: "keep" }, { foo: "keep2" }, { foo: "keep3" }]);
  });
});
