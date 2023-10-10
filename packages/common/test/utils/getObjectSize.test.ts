import { getObjectSize } from "../../src";

describe("getObjectSize:", () => {
  it("returns size in b, kb, mb", () => {
    const chk = getObjectSize({ test: "object" });
    expect(chk.bytes).toBe(34);
    expect(chk.kilobytes).toBeCloseTo(0.0332, 4);
    expect(chk.megabytes).toBeCloseTo(0.000032, 5);
  });
  it("verify large object", () => {
    const data = {
      fake: new Array(200000).fill({ key: "value" }),
    };
    const chk = getObjectSize(data);
    expect(chk.megabytes).toBeGreaterThan(6);
  });
});
