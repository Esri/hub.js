import { HUB_FGDB_JOB_FORMATS } from "../../../../src/downloads/_internal/_types";
import { getFgdbJobFormats } from "../../../../src/downloads/_internal/format-fetchers/getFgdbJobFormats";

describe("getFgdbJobFormats", () => {
  it("should return fgdb job formats", () => {
    const result = getFgdbJobFormats();
    expect(result.map((r) => r.format)).toEqual(HUB_FGDB_JOB_FORMATS);
  });
});
