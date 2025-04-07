import { IGroup } from "@esri/arcgis-rest-portal";
import {
  CANNOT_DISCUSS,
  isDiscussable,
  setDiscussableKeyword,
  getChannelUsersQuery,
  SharingAccess,
  isPublicChannel,
  isOrgChannel,
  isPrivateChannel,
  getChannelAccess,
  getChannelGroupIds,
  getChannelOrgIds,
  IChannel,
  AclCategory,
  AclSubCategory,
  getPostCSVFileName,
  channelToSearchResult,
} from "../../src";

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
            },
          ],
        } as IChannel)
      ).toEqual(["31c"]);
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
          ],
        } as IChannel)
      ).toEqual(["31c"]);
    });
  });
  describe("getChannelUsersQuery", () => {
    describe("legacy permissions", () => {
      it("should return a query for users in a private channel", () => {
        const res = getChannelUsersQuery(
          ["user1", "user2"],
          {
            access: SharingAccess.PRIVATE,
            orgs: ["org1", "org2"],
            groups: ["group1", "group2"],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "AND",
              predicates: [{ group: ["group1", "group2"] }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in an org-only channel", () => {
        const res = getChannelUsersQuery(
          ["user1", "user2"],
          {
            access: SharingAccess.ORG,
            orgs: ["org1", "org2"],
            groups: [] as string[],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: ["org1", "org2"] }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in an org channel with groups", () => {
        const res = getChannelUsersQuery(
          ["user1", "user2"],
          {
            access: SharingAccess.ORG,
            orgs: ["org1", "org2"],
            groups: ["group1", "group2"],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [
                { orgid: ["org1", "org2"] },
                { group: ["group1", "group2"] },
              ],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in a public channel", () => {
        const res = getChannelUsersQuery(
          ["user1", "user2"],
          {
            access: SharingAccess.PUBLIC,
            orgs: ["org1", "org2"],
            groups: [] as string[],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: { from: "0", to: "{" } }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should not filter out the authenticated user", () => {
        const res = getChannelUsersQuery(["user1", "user2"], {
          access: SharingAccess.PUBLIC,
          orgs: ["org1", "org2"],
          groups: ["group1", "group2"],
        } as IChannel);
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: { from: "0", to: "{" } }],
            },
          ],
        });
      });
    });
    describe("acl", () => {
      it("should return a query for users in a private channel", () => {
        const res = getChannelUsersQuery(
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
                subCategory: AclSubCategory.MEMBER,
                key: "group2",
              },
            ],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "AND",
              predicates: [{ group: ["group1", "group2"] }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in an org-only channel", () => {
        const res = getChannelUsersQuery(
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
                subCategory: AclSubCategory.MEMBER,
                key: "org2",
              },
            ],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: ["org1", "org2"] }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in an org channel with groups", () => {
        const res = getChannelUsersQuery(
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
                subCategory: AclSubCategory.MEMBER,
                key: "org2",
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "group1",
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "group2",
              },
            ],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [
                { orgid: ["org1", "org2"] },
                { group: ["group1", "group2"] },
              ],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should return a query for users in a public channel", () => {
        const res = getChannelUsersQuery(
          ["user1", "user2"],
          {
            channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
          } as IChannel,
          "currentUser"
        );
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: { from: "0", to: "{" } }],
            },
            {
              operation: "AND",
              predicates: [{ username: { not: "currentUser" } }],
            },
          ],
        });
      });
      it("should not filter out the authenticated user", () => {
        const res = getChannelUsersQuery(["user1", "user2"], {
          channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
        } as IChannel);
        expect(res).toEqual({
          targetEntity: "communityUser",
          filters: [
            {
              operation: "OR",
              predicates: [
                { username: "user1" },
                { fullname: "user1" },
                { username: "user2" },
                { fullname: "user2" },
              ],
            },
            {
              operation: "OR",
              predicates: [{ orgid: { from: "0", to: "{" } }],
            },
          ],
        });
      });
    });
  });
  describe("getPostCSVFileName", () => {
    beforeAll(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(1711987200000));
    });

    afterAll(() => {
      jasmine.clock().uninstall();
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
      const groups: IGroup[] = [];
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
