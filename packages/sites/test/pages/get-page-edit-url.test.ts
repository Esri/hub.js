import { getPageEditUrl } from "../../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("getPageEditUrl", () => {
  it("gets edit url", function() {
    const item = {
      id: "foo"
    } as IItem;
    const siteUrl = "https://broda-dc.hubqa.arcgis.com";
    let result = getPageEditUrl(item, false, siteUrl);
    expect(result).toBe("/edit?pageId=foo", "correct for non portal site");
    result = result = getPageEditUrl(item, true, siteUrl);
    expect(result).toBe(
      "https://broda-dc.hubqa.arcgis.com/edit?pageId=foo",
      "correct for portal site"
    );
  });
});
