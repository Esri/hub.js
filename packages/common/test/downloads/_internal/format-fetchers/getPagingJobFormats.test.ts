import { HUB_PAGING_JOB_FORMATS } from "../../../../src/downloads/_internal/_types";
import { getPagingJobFormats } from "../../../../src/downloads/_internal/format-fetchers/getPagingJobFormats";

describe("getPagingJobFormats", () => {
  it("should return paging job formats", () => {
    const result = getPagingJobFormats();
    expect(result.map((r) => r.format)).toEqual(HUB_PAGING_JOB_FORMATS);
  });
});
