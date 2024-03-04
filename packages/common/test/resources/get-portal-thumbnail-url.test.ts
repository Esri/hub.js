import { getPortalThumbnailUrl } from "../../src";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("getPortalThumbnailUrl:", () => {
  const portalUrl = "https://foo.com/sharing/rest";
  const token = "FAKE_TOKEN";
  it("returns null if no thumbnail present", () => {
    const portal = {} as IPortal;
    expect(getPortalThumbnailUrl(portalUrl, portal, token)).toBeNull();
  });
  it("constructs url without token for public portals", () => {
    const portal = {
      id: "abc123",
      access: "public",
      thumbnail: "photo.jpg",
      isPortal: true,
      name: "jsmith",
    } as IPortal;
    expect(getPortalThumbnailUrl(portalUrl, portal, token)).toEqual(
      "https://foo.com/sharing/rest/portals/self/resources/photo.jpg"
    );
  });
  it("constructs url with token for non-public portals", () => {
    const portal = {
      id: "abc123",
      access: "org",
      thumbnail: "photo.jpg",
      isPortal: true,
      name: "jsmith",
    } as IPortal;
    expect(getPortalThumbnailUrl(portalUrl, portal, token)).toEqual(
      "https://foo.com/sharing/rest/portals/self/resources/photo.jpg?token=FAKE_TOKEN"
    );
  });
});
