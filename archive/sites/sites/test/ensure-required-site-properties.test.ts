import { ensureRequiredSiteProperties } from "../src";
import { IModel } from "@esri/hub-common";

describe("ensureRequiredSiteProperties", () => {
  it("ensures properties - simple", function () {
    const model = {
      item: {},
      data: {
        values: {
          subdomain: "name-org",
          defaultHostname: "name-org.hub.arcgis.com",
        },
      },
    } as unknown as IModel;

    const chk = ensureRequiredSiteProperties(model, "vader");
    expect(chk.item.owner).toBe("vader", "sets owner");
    expect(chk.item.access).toBe("private", "sets access");
    expect(chk.data.values.updatedAt).toBeTruthy("sets updatedAt");
    expect(chk.data.values.updatedBy).toBe("vader", "sets updatedBy");
    expect(chk.item.url).toBe("https://name-org.hub.arcgis.com", "sets url");
    expect(Array.isArray(chk.data.values.pages)).toBeTruthy(
      "sets pages if not set"
    );
    expect(Array.isArray(chk.data.values.capabilities)).toBeTruthy(
      "sets capabilities if not set"
    );
    expect(chk.data.values.uiVersion).toBeTruthy("sets uiVersion");
    expect(chk.item.type).toBe("Hub Site Application", "should set the type");
    expect(chk.item.typeKeywords).toContain(
      "hubSite",
      "should add the typeKeyword"
    );
  });

  it("ensures properties - custom hostname", function () {
    const model = {
      item: {},
      data: {
        values: {
          subdomain: "name-org",
          defaultHostname: "name-org.hub.arcgis.com",
          customHostname: "my-site.com",
          pages: [{ id: "bc2", slug: "about" }],
        },
      },
    } as unknown as IModel;
    const chk = ensureRequiredSiteProperties(model, "vader");
    expect(chk.item.owner).toEqual("vader", "sets owner");
    expect(chk.item.access).toEqual("private", "sets access");
    expect(chk.data.values.updatedAt).toBeTruthy("sets updatedAt");
    expect(chk.data.values.updatedBy).toEqual("vader", "sets updatedBy");
    expect(chk.item.url).toEqual(
      "http://my-site.com",
      "sets url to custom hostname"
    );
    expect(chk.data.values.pages.length).toEqual(1, "retains pages if set");
    expect(chk.data.values.uiVersion).toBeTruthy("sets uiVersion");
    expect(chk.item.type).toEqual(
      "Hub Site Application",
      "should set the type"
    );
    expect(chk.item.typeKeywords).toContain(
      "hubSite",
      "should add the typeKeyword"
    );
    expect(Array.isArray(chk.data.values.capabilities)).toBeTruthy(
      "sets capabilities if not set"
    );
    expect(chk.data.values.capabilities).toContain("socialSharing");
    expect(chk.data.values.capabilities).toContain("underlinedLinks");
  });

  it("ensures properties - portal w url", function () {
    const model = {
      item: {
        url: "https://portal.org/instance/apps/sites/#/sitename",
        typeKeywords: [],
      },
      data: {
        values: {
          subdomain: "sitename",
        },
      },
    } as unknown as IModel;
    const chk = ensureRequiredSiteProperties(model, "vader", true);
    expect(chk.item.owner).toBe("vader", "sets owner");
    expect(chk.item.access).toBe("private", "sets access");
    expect(chk.data.values.updatedAt).toBeTruthy("sets updatedAt");
    expect(chk.data.values.updatedBy).toBe("vader", "sets updatedBy");
    expect(chk.item.url).toBe(
      "https://portal.org/instance/apps/sites/#/sitename",
      "keeps url"
    );
    expect(Array.isArray(chk.data.values.pages)).toBeTruthy(
      "sets pages if not set"
    );
    expect(chk.data.values.uiVersion).toBeTruthy("sets uiVersion");
    expect(chk.item.type).toBe("Site Application", "should set the type");
    expect(chk.item.typeKeywords).toContain(
      "hubSite",
      "should add the typeKeyword"
    );
    expect(chk.item.typeKeywords).toContain(
      "hubsubdomain|sitename",
      "should add the hubsubdomain keyword"
    );
    expect(Array.isArray(chk.data.values.capabilities)).toBeTruthy(
      "sets capabilities if not set"
    );
    expect(chk.data.values.capabilities).not.toContain("socialSharing");
  });

  it("keeps capabilities in model while ensuring default capabilities", function () {
    const model = {
      item: {},
      data: {
        telemetry: {},
        values: {
          subdomain: "name-org",
          defaultHostname: "name-org.hub.arcgis.com",
          capabilities: ["my_data", "disableDiscussions"],
        },
      },
    } as unknown as IModel;

    const chk = ensureRequiredSiteProperties(model, "vader");
    expect(chk.data.values.capabilities).toContain("my_data");
    expect(chk.data.values.capabilities).toContain("disableDiscussions");
  });
});
