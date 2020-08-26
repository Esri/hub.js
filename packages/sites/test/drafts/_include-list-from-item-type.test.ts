import {
  _includeListFromItemType,
  SITE_DRAFT_INCLUDE_LIST,
  PAGE_DRAFT_INCLUDE_LIST
} from "../../src/drafts";

describe("_includeListFromItemType", () => {
  it("returns the correct include list", async () => {
    expect(_includeListFromItemType("Hub Site Application", false)).toEqual(
      SITE_DRAFT_INCLUDE_LIST
    );
    expect(_includeListFromItemType("Hub Page", false)).toEqual(
      PAGE_DRAFT_INCLUDE_LIST
    );
  });
  it("throws error when unsupported item type", async () => {
    expect(() => _includeListFromItemType("Form", false)).toThrowError();
  });
});
