import { getAllExportItemFormats } from "../../../../src/downloads/_internal/format-fetchers/getAllExportItemFormats";
import { EXPORT_ITEM_FORMATS } from "../../../../src/downloads/_internal/_types";
describe("getAllExportItemFormats", () => {
  it("should return all export item formats", () => {
    const result = getAllExportItemFormats();
    expect(result.map((r) => r.format)).toEqual(EXPORT_ITEM_FORMATS);
  });
});
