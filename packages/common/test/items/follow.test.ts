import {
  getEntityFollowersGroupId,
  isUserFollowing,
  followEntity,
  unfollowEntity,
} from "../../src/items/follow";
import * as CoreModule from "../../src/core";
import { IGroup, ISearchOptions, IUser } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContext } from "../../src";
import { IWithFollowers } from "../../src/core/traits/IWithFollowers";

describe("follow", function () {
  let sampleUser: IUser;
  let sampleEntity: IWithFollowers;
  let sampleEntityId: string;
  let fetchHubEntitySpy: jasmine.Spy;

  beforeEach(() => {
    sampleUser = {
      groups: [{ id: "12345" } as IGroup],
      username: "sampleUsername",
    };
    sampleEntity = {
      followersGroupId: "12345",
    };
    sampleEntityId = "3ef";

    fetchHubEntitySpy = spyOn(CoreModule, "fetchHubEntity").and.returnValue(
      Promise.resolve({ followersGroupId: "12345" })
    );
  });

  afterEach(() => {
    fetchHubEntitySpy.calls.reset();
  });

  describe("getEntityFollowersGroupId", function () {
    it("fetches for the entity followers group id", async function () {
      const result = await getEntityFollowersGroupId(
        sampleEntityId,
        "site",
        {} as ArcGISContext
      );
      expect(fetchHubEntitySpy).toHaveBeenCalled();
      expect(result).toBe("12345");
    });
  });

  describe("isUserFollowing", function () {
    it("checks with entity", async function () {
      let result = await isUserFollowing(
        sampleEntity,
        sampleUser,
        "site",
        {} as ArcGISContext
      );
      expect(result).toBeTruthy();

      // check with a different user
      sampleUser.groups = [{ id: "67890" } as IGroup];
      result = await isUserFollowing(
        sampleEntity,
        sampleUser,
        "site",
        {} as ArcGISContext
      );
      expect(result).toBeFalsy();
    });

    it("checks with entity id", async function () {
      let result = await isUserFollowing(
        sampleEntityId,
        sampleUser,
        "site",
        {} as ArcGISContext
      );
      expect(fetchHubEntitySpy).toHaveBeenCalled();
      expect(result).toBeTruthy();

      // switch to a different entity
      fetchHubEntitySpy.and.returnValue(
        Promise.resolve({ followersGroupId: "67890" })
      );
      result = await isUserFollowing(
        sampleEntityId,
        sampleUser,
        "site",
        {} as ArcGISContext
      );
      expect(fetchHubEntitySpy).toHaveBeenCalled();
      expect(result).toBeFalsy();
    });
  });

  describe("followEntity", function () {
    let joinGroupSpy: jasmine.Spy;
    beforeEach(() => {
      joinGroupSpy = spyOn(PortalModule, "joinGroup").and.callFake(() =>
        Promise.resolve()
      );
    });

    afterEach(() => {
      joinGroupSpy.calls.reset();
    });

    it("throws if the user is already following the entity.", async function () {
      try {
        await followEntity(sampleEntityId, sampleUser, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        expect(e).toBe("User is already following this entity.");
      }
    });

    it("follows the entity if user is currently not following the entity.", async function () {
      // switch to a different entity
      fetchHubEntitySpy.and.returnValue(
        Promise.resolve({ followersGroupId: "67890" })
      );
      const result = await followEntity(sampleEntityId, sampleUser, "site", {
        hubRequestOptions: { authentication: {} },
      } as ArcGISContext);
      expect(joinGroupSpy).toHaveBeenCalled();
      expect(result).toEqual({ success: true, username: "sampleUsername" });
    });

    it("throws if failed to join the group", async function () {
      fetchHubEntitySpy.and.returnValue(
        Promise.resolve({ followersGroupId: "67890" })
      );
      // rejects the join request
      joinGroupSpy.and.returnValue(Promise.reject("error"));
      try {
        await followEntity(sampleEntityId, sampleUser, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        expect(e.message).toBe("Error joining group: error");
      }
    });
  });

  describe("unfollowEntity", function () {
    let leaveGroupSpy: jasmine.Spy;
    beforeEach(() => {
      leaveGroupSpy = spyOn(PortalModule, "leaveGroup").and.callFake(() =>
        Promise.resolve()
      );
    });

    afterEach(() => {
      leaveGroupSpy.calls.reset();
    });

    it("throws if the user is not following the entity.", async function () {
      // switch to a different entity
      fetchHubEntitySpy.and.returnValue(
        Promise.resolve({ followersGroupId: "67890" })
      );
      try {
        await unfollowEntity(sampleEntityId, sampleUser, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        expect(e).toBe("User is not following this entity.");
      }
    });

    it("unfollows the entity if user is currently following the entity.", async function () {
      const result = await unfollowEntity(sampleEntityId, sampleUser, "site", {
        hubRequestOptions: { authentication: {} },
      } as ArcGISContext);
      expect(leaveGroupSpy).toHaveBeenCalled();
      expect(result).toEqual({ success: true, username: "sampleUsername" });
    });

    it("throws if failed to leave the group", async function () {
      // rejects the join request
      leaveGroupSpy.and.returnValue(Promise.reject("error"));
      try {
        await unfollowEntity(sampleEntityId, sampleUser, "site", {
          hubRequestOptions: {},
        } as ArcGISContext);
      } catch (e) {
        expect(e.message).toBe("Error leaving group: error");
      }
    });
  });
});
