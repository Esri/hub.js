import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import {
  getUserThumbnailUrl,
  getGroupThumbnailUrl,
} from "../../src/search/utils";

describe("Search Utils:", () => {
  describe("user thumbnails:", () => {
    const portal = "https://foo.com/sharing/rest";
    const token = "FAKE_TOKEN";
    it("returns null if no thumbnail present", () => {
      const user = {} as IUser;
      expect(getUserThumbnailUrl(portal, user, token)).toBeNull();
    });
    it("constructs url without token for public users", () => {
      const user = {
        username: "jsmith",
        access: "public",
        thumbnail: "photo.jpg",
      } as IUser;
      expect(getUserThumbnailUrl(portal, user, token)).toEqual(
        "https://foo.com/sharing/rest/community/users/jsmith/info/photo.jpg"
      );
    });
    it("constructs url with token for non-public users", () => {
      const user = {
        username: "jsmith",
        access: "org",
        thumbnail: "photo.jpg",
      } as IUser;
      expect(getUserThumbnailUrl(portal, user, "FAKE_TOKEN")).toEqual(
        "https://foo.com/sharing/rest/community/users/jsmith/info/photo.jpg?token=FAKE_TOKEN"
      );
    });
  });

  describe("group thumbnails:", () => {
    const portal = "https://foo.com/sharing/rest";
    const token = "FAKE_TOKEN";
    it("returns null if no thumbnail present", () => {
      const g = {} as IGroup;
      expect(getGroupThumbnailUrl(portal, g, token)).toBeNull();
    });
    it("constructs url without token for public groups", () => {
      const group = {
        id: "3ef",
        title: "fake group",
        access: "public",
        thumbnail: "photo.jpg",
      } as IGroup;
      expect(getGroupThumbnailUrl(portal, group, token)).toEqual(
        "https://foo.com/sharing/rest/community/groups/3ef/info/photo.jpg"
      );
    });
    it("constructs url with token for non-public groups", () => {
      const group = {
        id: "3ef",
        title: "fake group",
        access: "org",
        thumbnail: "photo.jpg",
      } as IGroup;
      expect(getGroupThumbnailUrl(portal, group, token)).toEqual(
        "https://foo.com/sharing/rest/community/groups/3ef/info/photo.jpg?token=FAKE_TOKEN"
      );
    });
  });
});
