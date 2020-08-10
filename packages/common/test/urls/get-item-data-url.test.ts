import { IItem, IPortal } from "@esri/arcgis-rest-portal";
import { getItemDataUrl } from "../../src";

describe("getItemDataUrl", () => {
  const portalHostname = "portal-hostname.com";
  const portalSelfResponse: IPortal = {
    isPortal: true,
    id: "some-id",
    name: "Portal Name",
    portalHostname,
    urlKey: "www",
    customBaseUrl: "custom-base-url.com"
  };
  let item: IItem;
  beforeEach(() => {
    item = {
      id: "foo"
    } as IItem;
  });
  const portalUrl = `https://${portalHostname}`;
  it("handles a public item and portalUrl", () => {
    item.access = "public";
    const url = getItemDataUrl(item, portalUrl);
    expect(url).toBe(`${portalUrl}/sharing/rest/content/items/${item.id}/data`);
  });
  it("handles a non-public item and portalUrl", () => {
    item.access = "org";
    const token = "notARealToken";
    const url = getItemDataUrl(item, portalUrl, token);
    expect(url).toBe(
      `${portalUrl}/sharing/rest/content/items/${item.id}/data?token=${token}`
    );
  });
  it("handles a public item and portal", () => {
    item.access = "public";
    const url = getItemDataUrl(item, portalSelfResponse);
    expect(url).toBe(`${portalUrl}/sharing/rest/content/items/${item.id}/data`);
  });
});
