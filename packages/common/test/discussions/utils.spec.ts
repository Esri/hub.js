// make arcgis-rest-portal exports configurable for spying in ESM
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
vi.mock("@esri/arcgis-rest-portal", async () => {
  const original = await vi.importActual("@esri/arcgis-rest-portal");
  return { ...(original as any) };
});
import * as restPortal from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  channelToSearchResult,
  getChannelAccess,
  getChannelGroupIds,
  getChannelOrgIds,
  getChannelUsersQuery,
  getPostCSVFileName,
  isDiscussable,
  isOrgChannel,
  isPrivateChannel,
  isPublicChannel,
  setDiscussableKeyword,
} from "../../src/discussions/utils";
import { CANNOT_DISCUSS } from "../../src/discussions/constants";
import { IChannel } from "../../src/discussions/api/types";
import { SharingAccess } from "../../src/discussions/api/enums/sharingAccess";
import { AclCategory } from "../../src/discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../src/discussions/api/enums/aclSubCategory";
import { Role } from "../../src/discussions/api/enums/role";

describe("discussions utils", () => {
  describe("isDiscussable", () => {
    it("returns true if CANNOT_DISCUSS is not present", () => {
      const subject = {
        typeKeywords: ["some keyword"],
      };
      const result = isDiscussable(subject);
      expect(result).toBeTruthy();
    });
    it("returns false if CANNOT_DISCUSS is present", () => {
      const subject = {
        typeKeywords: [CANNOT_DISCUSS],
      };
      const result = isDiscussable(subject);
      expect(result).toBeFalsy();
    });
    it("returns false when subject is falsey", () => {
      const result = isDiscussable(null);
      expect(result).toBeFalsy();
    });
    it("returns true if typeKeywords property does not exist", () => {
      const subject = {};
      const result = isDiscussable(subject);
      expect(result).toBeTruthy();
    });
  });
  describe("setDiscussableKeyword", () => {
    it("handles falsey typeKeywords value", () => {
      const result = setDiscussableKeyword(null, true);
      expect(result).toEqual([]);
    });
    it("returns array without CANNOT_DISCUSS when isDiscussable is true", () => {
      const result = setDiscussableKeyword([CANNOT_DISCUSS], true);
      expect(result).toEqual([]);
    });
    it("returns array with CANNOT_DISCUSS when isDiscussable is false", () => {
      const result = setDiscussableKeyword([], false);
      expect(result).toEqual([CANNOT_DISCUSS]);
    });
  });
  describe("isPublicChannel", () => {
    it("should return true for legacy permissions", () => {
      expect(
        isPublicChannel({ access: SharingAccess.PUBLIC } as IChannel)
      ).toBe(true);
    });
    it("should return false for legacy permissions", () => {
      expect(isPublicChannel({ access: SharingAccess.ORG } as IChannel)).toBe(
        false
      );
    });
    it("should return true for acl", () => {
      expect(
        isPublicChannel({
          channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
        } as IChannel)
      ).toBe(true);
      expect(
        isPublicChannel({
          channelAcl: [{ category: AclCategory.ANONYMOUS_USER }],
        } as IChannel)
      ).toBe(true);
    });
    it("should return false for acl", () => {
      expect(
        isPublicChannel({
          channelAcl: [{ category: AclCategory.ORG }],
        } as IChannel)
      ).toBe(false);
    });
  });
  describe("isOrgChannel", () => {
    it("should return true for legacy permissions", () => {
      expect(isOrgChannel({ access: SharingAccess.ORG } as IChannel)).toBe(
        true
      );
    });
    it("should return false for legacy permissions", () => {
      expect(isOrgChannel({ access: SharingAccess.PUBLIC } as IChannel)).toBe(
        false
      );
    });
    it("should return true for acl", () => {
      expect(
        isOrgChannel({
          channelAcl: [
            { category: AclCategory.ORG, subCategory: AclSubCategory.MEMBER },
          ],
        } as IChannel)
      ).toBe(true);
    });
    it("should return false for acl", () => {
      expect(
        isOrgChannel({
          channelAcl: [
            { category: AclCategory.GROUP, subCategory: AclSubCategory.MEMBER },
          ],
        } as IChannel)
      ).toBe(false);
    });
  });
  describe("isPrivateChannel", () => {
    it("should return true for legacy permissions", () => {
      expect(
        isPrivateChannel({ access: SharingAccess.PRIVATE } as IChannel)
      ).toBe(true);
    });
    it("should return false for legacy permissions", () => {
      expect(
        isPrivateChannel({ access: SharingAccess.PUBLIC } as IChannel)
      ).toBe(false);
    });
    it("should return true for acl", () => {
      expect(
        isPrivateChannel({
          channelAcl: [{ category: AclCategory.GROUP }],
        } as IChannel)
      ).toBe(true);
    });
    it("should return false for acl", () => {
      expect(
        isPrivateChannel({
          channelAcl: [
            { category: AclCategory.ORG, subCategory: AclSubCategory.MEMBER },
          ],
        } as IChannel)
      ).toBe(false);
    });
  });
  describe("getChannelAccess", () => {
    it("should return public for legacy permissions", () => {
      expect(
        getChannelAccess({ access: SharingAccess.PUBLIC } as IChannel)
      ).toBe(SharingAccess.PUBLIC);
    });
    it("should return public for acl", () => {
      expect(
        getChannelAccess({
          channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
        } as IChannel)
      ).toBe(SharingAccess.PUBLIC);
    });
    it("should return org for legacy permissions", () => {
      expect(getChannelAccess({ access: SharingAccess.ORG } as IChannel)).toBe(
        SharingAccess.ORG
      );
    });
    it("should return org for acl", () => {
      expect(
        getChannelAccess({
          channelAcl: [
            { category: AclCategory.ORG, subCategory: AclSubCategory.MEMBER },
          ],
        } as IChannel)
      ).toBe(SharingAccess.ORG);
    });
    it("should return private for legacy permissions", () => {
      expect(
        getChannelAccess({ access: SharingAccess.PRIVATE } as IChannel)
      ).toBe(SharingAccess.PRIVATE);
    });
    it("should return private for acl", () => {
      expect(
        getChannelAccess({
          channelAcl: [{ category: AclCategory.GROUP }],
        } as IChannel)
      ).toBe(SharingAccess.PRIVATE);
    });
  });
  describe("getChannelOrgIds", () => {
    it("should return channel.orgs for legacy permissions", () => {
      expect(getChannelOrgIds({ orgs: ["31c"] } as IChannel)).toEqual(["31c"]);
    });
    it("should return org ids from acl records", () => {
      expect(
        getChannelOrgIds({
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "31c",
              role: Role.READWRITE,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: "31c",
              role: Role.MODERATE,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: "31c",
              role: Role.OWNER,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "31d",
              role: Role.READ,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "31e",
              role: Role.OWNER,
            },
          ],
        } as IChannel)
      ).toEqual(["31c", "31d", "31e"]);
    });
  });
  describe("getChannelGroupIds", () => {
    it("should return channel.groups for legacy permissions", () => {
      expect(getChannelGroupIds({ groups: ["31c"] } as IChannel)).toEqual([
        "31c",
      ]);
    });
    it("should return group ids from acl records", () => {
      expect(
        getChannelGroupIds({
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "31c",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "31c",
            },
          ],
        } as IChannel)
      ).toEqual(["31c"]);
    });
  });
  describe("getChannelUsersQuery", () => {
    const REQUEST_OPTIONS = {} as unknown as IRequestOptions;
    let getGroupUsersSpy: any;

    beforeEach(() => {
      getGroupUsersSpy = vi
        .spyOn(restPortal, "getGroupUsers")
        .mockImplementation((groupId: string) => {
          const lookup: Record<string, restPortal.IGroupUsersResult> = {
            group1: {
              owner: "ownerUser1",
              admins: ["admin1", "admin2"],
              users: ["user1", "user2"],
            },
            group2: {
              owner: "ownerUser2",
              admins: ["admin3", "admin4", "ownerUser2"],
              users: ["user3", "user4"],
            },
          };
          return Promise.resolve(lookup[groupId]);
        });
    });

    it("should resolve an IQuery for a public channel (AclCategory.AUTHENTICATED_USER)", async () => {
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.AUTHENTICATED_USER,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "group2",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "AND",
            predicates: [{ orgid: { from: "0", to: "{" } }],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });

    it("should resolve an IQuery for a public channel (AclCategory.ANONYMOUS_USER)", async () => {
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.ANONYMOUS_USER,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "group2",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "AND",
            predicates: [{ orgid: { from: "0", to: "{" } }],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });

    it("should resolve an IQuery for a org channel", async () => {
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "org1",
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: "org1",
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "org2",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "OR",
            predicates: [
              { orgid: ["org1", "org2"] },
              { orgid: ["org1"], role: "org_admin" },
            ],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });

    it("should resolve an IQuery for a group channel", async () => {
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "group1",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "group1",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "group2",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "OR",
            predicates: [
              { group: ["group1"] },
              {
                group: "group2",
                username: ["ownerUser2", "admin3", "admin4"],
              },
            ],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).toHaveBeenCalledTimes(1);
      expect(getGroupUsersSpy).toHaveBeenCalledWith("group2", REQUEST_OPTIONS);
    });

    it("should resolve an IQuery for an org channel with groups", async () => {
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "org1",
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: "org1",
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: "org2",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "group1",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "group1",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "OR",
            predicates: [
              { orgid: ["org1"] },
              {
                orgid: ["org1", "org2"],
                role: "org_admin",
              },
              { group: ["group1"] },
            ],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });
    it("should not filter out the authenticated user", async () => {
      const res = await getChannelUsersQuery(["user1", "user2"], {
        channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
      } as IChannel);
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "AND",
            predicates: [{ orgid: { from: "0", to: "{" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });
    it("should not add predicates for falsey terms", async () => {
      const res = await getChannelUsersQuery(["user1", ""], {
        channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
      } as IChannel);
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "AND",
            predicates: [{ orgid: { from: "0", to: "{" } }],
          },
          {
            operation: "OR",
            predicates: [{ username: "user1" }, { fullname: "user1" }],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });
    it("should not add filter for terms when no terms provided", async () => {
      const res = await getChannelUsersQuery([], {
        channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
      } as IChannel);
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "AND",
            predicates: [{ orgid: { from: "0", to: "{" } }],
          },
        ],
      });
      expect(getGroupUsersSpy).not.toHaveBeenCalled();
    });
    it("should not add group admin predicates for inaccessible groups", async () => {
      getGroupUsersSpy.mockRejectedValue(new Error("404"));
      const res = await getChannelUsersQuery(
        ["user1", "user2"],
        {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: "group1",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "group1",
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: "group2",
            },
          ],
        } as IChannel,
        "currentUser",
        REQUEST_OPTIONS
      );
      expect(res).toEqual({
        targetEntity: "communityUser",
        filters: [
          {
            operation: "OR",
            predicates: [{ group: ["group1"] }],
          },
          {
            operation: "AND",
            predicates: [{ username: { not: "currentUser" } }],
          },
          {
            operation: "OR",
            predicates: [
              { username: "user1" },
              { fullname: "user1" },
              { username: "user2" },
              { fullname: "user2" },
            ],
          },
        ],
      });
      expect(getGroupUsersSpy).toHaveBeenCalledTimes(1);
      expect(getGroupUsersSpy).toHaveBeenCalledWith("group2", REQUEST_OPTIONS);
    });
  });
  describe("getPostCSVFileName", () => {
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(1711987200000));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("constructs file name", () => {
      const result = getPostCSVFileName(
        " Some really-really really--REALLY long title with non alpha-numeric characters!@ I can't believe how long this title is. It exceeds 250 characters yet we're still able to produce a reasonable file name from it. Geesh, I'm running out of things to type to reach 250 characters "
      );
      expect(result).toEqual(
        "some-really-really-really-really-long-title-with-non-alpha-numeric-characters-i-can-t-believe-how-long-this-title-is-it-exceeds-250-characters-yet-we-re-still-able-to-produce-a-reasonable-file-name-from-it-geesh-i-m-runni_2024-04-01T16-00-00-000Z.csv"
      );
    });
  });
  describe("channelToSearchResult", () => {
    it("should transform an IChannel and array of IGroup objects into an IHubSearchResult", () => {
      const channel: IChannel = {
        id: "c1",
        access: "private",
        name: "My channel",
        createdAt: new Date("2021-09-23T15:16:27.166Z"),
        updatedAt: new Date("2025-03-31T06:52:58.476Z"),
        creator: "juliana",
        blockWords: ["bad"],
      } as unknown as IChannel;
      const groups: restPortal.IGroup[] = [];
      const result = channelToSearchResult(channel, groups);
      expect(result).toEqual({
        ...channel,
        id: channel.id,
        name: channel.name,
        createdDate: channel.createdAt,
        createdDateSource: "channel",
        updatedDate: channel.updatedAt,
        updatedDateSource: "channel",
        type: "channel",
        access: "private",
        family: "channel",
        owner: channel.creator,
        links: {
          thumbnail: null,
          self: null,
          siteRelative: null,
        },
        includes: { groups },
        rawResult: channel,
      });
    });
  });
});
