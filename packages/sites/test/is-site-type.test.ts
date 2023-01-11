import { isSiteType } from "../src";
import { IItem } from "@esri/arcgis-rest-portal";

const randomItem = {
  type: "Form",
} as IItem;

const hubSite = {
  type: "Hub Site Application",
} as IItem;

const portalSite = {
  type: "Site Application",
} as IItem;

const oldSite = {
  type: "Web Mapping Application",
  typeKeywords: ["hubSite"],
} as IItem;

const randomApplication = {
  type: "Web Mapping Application",
  typeKeywords: ["foo", "bar"],
} as IItem;

describe("isSite", () => {
  it("works on hub", async () => {
    expect(isSiteType(hubSite.type, hubSite.typeKeywords)).toBeTruthy();
    expect(isSiteType(randomItem.type, randomItem.typeKeywords)).toBeFalsy();
  });

  it("works on portal", async () => {
    expect(isSiteType(portalSite.type, portalSite.typeKeywords)).toBeTruthy();
    expect(isSiteType(randomItem.type, randomItem.typeKeywords)).toBeFalsy();
  });

  it("works for old sites", async () => {
    expect(isSiteType(oldSite.type, oldSite.typeKeywords)).toBeTruthy();
    expect(
      isSiteType(randomApplication.type, randomApplication.typeKeywords)
    ).toBeFalsy();
  });
});
