import { isPage } from "../../src/pages";
import { IItem } from "@esri/arcgis-rest-portal";

const randomItem = {
  type: "Form"
} as IItem;

const hubPage = {
  type: "Hub Page"
} as IItem;

const portalPage = {
  type: "Site Page"
} as IItem;

const oldPage = {
  type: "Web Mapping Application",
  typeKeywords: ["hubPage"]
} as IItem;

const randomApplication = {
  type: "Web Mapping Application",
  typeKeywords: ["foo", "bar"]
} as IItem;

describe("isPage", () => {
  it("works on hub", async () => {
    expect(isPage(hubPage)).toBeTruthy();
    expect(isPage(randomItem)).toBeFalsy();
  });

  it("works on portal", async () => {
    expect(isPage(portalPage)).toBeTruthy();
    expect(isPage(randomItem)).toBeFalsy();
  });

  it("works for old pages", async () => {
    expect(isPage(oldPage)).toBeTruthy();
    expect(isPage(randomApplication)).toBeFalsy();
  });
});
