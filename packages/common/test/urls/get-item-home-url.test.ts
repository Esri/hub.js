import { IPortal } from "@esri/arcgis-rest-portal";
import { getItemHomeUrl } from "../../src";

describe("getItemHomeUrl", () => {
  const portalHostname = "portal-hostname.com";
  const portalSelfResponse: IPortal = {
    isPortal: true,
    id: "some-id",
    name: "Portal Name",
    portalHostname,
    urlKey: "www",
    customBaseUrl: "custom-base-url.com"
  };
  const itemId = "foo";
  const portalUrl = `https://${portalHostname}`;
  it("handles an item id and portalUrl", () => {
    const url = getItemHomeUrl(itemId, portalUrl);
    expect(url).toBe(`${portalUrl}/home/item.html?id=${itemId}`);
  });
  it("handles an item id and portal", () => {
    const url = getItemHomeUrl(itemId, portalSelfResponse);
    expect(url).toBe(`${portalUrl}/home/item.html?id=${itemId}`);
  });
});
