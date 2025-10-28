import { describe, it, expect } from "vitest";
import { IPortal } from "@esri/arcgis-rest-portal";
import { getOrgThumbnailUrl } from "../../src/resources/get-org-thumbnail-url";

describe("getPortalThumbnailUrl:", () => {
  const token = "FAKE_TOKEN";
  it("returns null if no thumbnail present", () => {
    const portal = {} as IPortal;
    expect(getOrgThumbnailUrl(portal, token)).toBeNull();
  });
  it("constructs url without token for public portals", () => {
    const portal = {
      id: "abc123",
      access: "public",
      thumbnail: "photo.jpg",
      isPortal: true,
      name: "jsmith",
    } as IPortal;
    expect(getOrgThumbnailUrl(portal, token)).toEqual(
      "https://www.arcgis.com/sharing/rest/portals/abc123/resources/photo.jpg"
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
    expect(getOrgThumbnailUrl(portal, token)).toEqual(
      "https://www.arcgis.com/sharing/rest/portals/abc123/resources/photo.jpg?token=FAKE_TOKEN"
    );
  });
});
