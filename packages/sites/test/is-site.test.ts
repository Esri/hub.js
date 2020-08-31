import { isSite } from "../src";
import { IItem } from "@esri/arcgis-rest-portal";

const randomItem = {
  type: "Form"
} as IItem;

const hubSite = {
  type: "Hub Site Application"
} as IItem;

const portalSite = {
  type: "Site Application"
} as IItem;

const oldSite = {
  type: "Web Mapping Application",
  typeKeywords: ["hubSite"]
} as IItem;

const randomApplication = {
  type: "Web Mapping Application",
  typeKeywords: ["foo", "bar"]
} as IItem;

describe("isSite", () => {
  it("works on hub", async () => {
    expect(isSite(hubSite)).toBeTruthy();
    expect(isSite(randomItem)).toBeFalsy();
  });

  it("works on portal", async () => {
    expect(isSite(portalSite)).toBeTruthy();
    expect(isSite(randomItem)).toBeFalsy();
  });

  it("works for old sites", async () => {
    expect(isSite(oldSite)).toBeTruthy();
    expect(isSite(randomApplication)).toBeFalsy();
  });
});
