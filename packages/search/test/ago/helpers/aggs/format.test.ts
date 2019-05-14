import { format } from "../../../../src/ago/helpers/aggs/format";

describe("format aggs test", () => {
  it("formats raw counts into aggs like v3", () => {
    const rawCounts = {
      hasApi: { true: 2, false: 4 },
      downloadable: { true: 7, false: 0 }
    };
    const actual = format(rawCounts);
    const expected = {
      hasApi: [{ key: "false", docCount: 4 }, { key: "true", docCount: 2 }],
      downloadable: [
        { key: "true", docCount: 7 },
        { key: "false", docCount: 0 }
      ]
    };
    expect(actual).toEqual(expected);
  });
});
