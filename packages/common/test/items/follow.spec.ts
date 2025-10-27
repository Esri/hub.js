import {
  getEntityFollowersGroupId,
  isUserFollowing,
  followEntity,
  unfollowEntity,
} from "../../src/items/follow";
import * as fetchHubEntityModule from "../../src/core/fetchHubEntity";
// make portal spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    joinGroup: vi.fn(),
    leaveGroup: vi.fn(),
  });
});
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContext } from "../../src/ArcGISContext";
import { IWithFollowers } from "../../src/core/traits/IWithFollowers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("follow", function () {
  let sampleUser: PortalModule.IUser;
  let sampleEntity: IWithFollowers;
  let sampleEntityId: string;

  beforeEach(() => {
    sampleUser = {
      groups: [{ id: "12345" } as PortalModule.IGroup],
      username: "sampleUsername",
    } as any;
    sampleEntity = {
      followersGroupId: "12345",
    } as any;
    sampleEntityId = "3ef";

    vi.spyOn(fetchHubEntityModule as any, "fetchHubEntity").mockResolvedValue({
      followersGroupId: "12345",
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getEntityFollowersGroupId", function () {
    it("fetches for the entity followers group id", async function () {
      const result = await getEntityFollowersGroupId(
        sampleEntityId,
        "site",
        {} as ArcGISContext
      );
      expect((fetchHubEntityModule as any).fetchHubEntity).toHaveBeenCalled();
      expect(result).toBe("12345");
    });
    it("throws if it fails to fetch the entity.", async function () {
      (fetchHubEntityModule as any).fetchHubEntity.mockRejectedValue("error");
      try {
        await followEntity(sampleEntityId, sampleUser as any, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        const error = e as { message?: string };
        expect(error.message).toBe(
          "Error fetching entity followers group ID: error"
        );
      }
    });
  });

  describe("isUserFollowing", function () {
    it("checks with entity", async function () {
      let result = await isUserFollowing(
        sampleEntity,
        sampleUser as any,
        "site",
        {} as ArcGISContext
      );
      expect(result).toBeTruthy();

      sampleUser.groups = [{ id: "67890" } as PortalModule.IGroup] as any;
      result = await isUserFollowing(
        sampleEntity,
        sampleUser as any,
        "site",
        {} as ArcGISContext
      );
      expect(result).toBeFalsy();
    });

    it("checks with entity id", async function () {
      let result = await isUserFollowing(
        sampleEntityId,
        sampleUser as any,
        "site",
        {} as ArcGISContext
      );
      expect((fetchHubEntityModule as any).fetchHubEntity).toHaveBeenCalled();
      expect(result).toBeTruthy();

      (fetchHubEntityModule as any).fetchHubEntity.mockResolvedValue({
        followersGroupId: "67890",
      } as any);
      result = await isUserFollowing(
        sampleEntityId,
        sampleUser as any,
        "site",
        {} as ArcGISContext
      );
      expect((fetchHubEntityModule as any).fetchHubEntity).toHaveBeenCalled();
      expect(result).toBeFalsy();
    });
  });

  describe("followEntity", function () {
    beforeEach(() => {
      vi.spyOn(PortalModule as any, "joinGroup").mockResolvedValue(
        undefined as any
      );
    });

    it("throws if the user is already following the entity.", async function () {
      try {
        await followEntity(sampleEntityId, sampleUser as any, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        const error = e as string;
        expect(error).toBe("User is already following this entity.");
      }
    });

    it("follows the entity if user is currently not following the entity.", async function () {
      (fetchHubEntityModule as any).fetchHubEntity.mockResolvedValue({
        followersGroupId: "67890",
      } as any);
      const result = await followEntity(
        sampleEntityId,
        sampleUser as any,
        "site",
        { hubRequestOptions: { authentication: {} } } as any
      );
      expect((PortalModule as any).joinGroup).toHaveBeenCalled();
      expect(result).toEqual({ success: true, username: "sampleUsername" });
    });

    it("throws if failed to join the group", async function () {
      (fetchHubEntityModule as any).fetchHubEntity.mockResolvedValue({
        followersGroupId: "67890",
      } as any);
      (PortalModule as any).joinGroup.mockRejectedValue("error");
      try {
        await followEntity(sampleEntityId, sampleUser as any, "site", {
          hubRequestOptions: {},
        } as any);
      } catch (e) {
        const error = e as Error;
        expect(error.message).toBe("Error joining group: error");
      }
    });
  });

  describe("unfollowEntity", function () {
    beforeEach(() => {
      vi.spyOn(PortalModule as any, "leaveGroup").mockResolvedValue(
        undefined as any
      );
    });

    it("throws if the user is not following the entity.", async function () {
      (fetchHubEntityModule as any).fetchHubEntity.mockResolvedValue({
        followersGroupId: "67890",
      } as any);
      try {
        await unfollowEntity(sampleEntityId, sampleUser as any, "site", {
          hubRequestOptions: {},
        } as any);
      } catch (e) {
        const error = e as string;
        expect(error).toBe("User is not following this entity.");
      }
    });

    it("unfollows the entity if user is currently following the entity.", async function () {
      const result = await unfollowEntity(
        sampleEntityId,
        sampleUser as any,
        "site",
        { hubRequestOptions: { authentication: {} } } as any
      );
      expect((PortalModule as any).leaveGroup).toHaveBeenCalled();
      expect(result).toEqual({ success: true, username: "sampleUsername" });
    });

    it("throws if failed to leave the group", async function () {
      (PortalModule as any).leaveGroup.mockRejectedValue("error");
      try {
        await unfollowEntity(sampleEntityId, sampleUser as any, "site", {
          hubRequestOptions: {},
        } as any);
      } catch (e) {
        const error = e as Error;
        expect(error.message).toBe("Error leaving group: error");
      }
    });
  });
});
