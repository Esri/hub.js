import {
  _includeListFromItemType,
  SITE_DRAFT_INCLUDE_LIST,
  PAGE_DRAFT_INCLUDE_LIST
} from "../../src/drafts";
import { IItem } from "@esri/arcgis-rest-portal";

const hubSite = {
  type: "Hub Site Application"
} as IItem;

const hubPage = {
  type: "Hub Page"
} as IItem;

const randomItem = {
  type: "Form",
  typeKeywords: []
} as IItem;

describe("_includeListFromItemType", () => {
  it("returns the correct include list", async () => {
    expect(_includeListFromItemType(hubSite)).toEqual(SITE_DRAFT_INCLUDE_LIST);
    expect(_includeListFromItemType(hubPage)).toEqual(PAGE_DRAFT_INCLUDE_LIST);
  });
  it("throws error when unsupported item type", async () => {
    expect(() => _includeListFromItemType(randomItem)).toThrowError();
  });
});
