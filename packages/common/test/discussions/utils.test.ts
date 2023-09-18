import {
  CANNOT_DISCUSS,
  isDiscussable,
  setDiscussableKeyword,
  searchChannelUsers,
  SharingAccess,
  IHubRequestOptions,
  isPublicChannel,
  isOrgChannel,
  isPrivateChannel,
  getChannelAccess,
  getChannelGroupIds,
  getChannelOrgIds,
  IChannel,
  AclCategory,
  AclSubCategory,
} from "../../src";
import * as hubSearchModule from "../../src/search";

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
    it("returns true if typeKeywords property does not exist", () => {
      const subject = {};
      const result = isDiscussable(subject);
      expect(result).toBeTruthy();
    });
  });
  describe("setDiscussableKeyword", () => {
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
          channelAcl: [{ category: AclCategory.ORG }],
        } as IChannel)
      ).toBe(true);
    });
    it("should return false for acl", () => {
      expect(
        isOrgChannel({
          channelAcl: [{ category: AclCategory.GROUP }],
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
          channelAcl: [{ category: AclCategory.ORG }],
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
          channelAcl: [{ category: AclCategory.ORG }],
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
  describe("searchChannelUsers", () => {
    const results: hubSearchModule.IHubSearchResponse<hubSearchModule.IHubSearchResult> =
      {
        total: 0,
        results: [],
        hasNext: false,
        next: () => Promise.resolve(results),
      };
    const searchOptions: hubSearchModule.IHubSearchOptions = {
      num: 10,
      start: 1,
      sortField: "fullName",
      sortOrder: "desc",
      requestOptions: { isPortal: false },
    };
    let hubSearchSpy: jasmine.Spy;

    beforeEach(() => {
      hubSearchSpy = spyOn(hubSearchModule, "hubSearch").and.returnValue(
        Promise.resolve(results)
      );
    });

    afterEach(() => {
      hubSearchSpy.calls.reset();
    });

    describe("legacy permissions", () => {
      it("should search for users for a private channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              access: SharingAccess.PRIVATE,
              orgs: ["org1", "org2"],
              groups: ["group1", "group2"],
            } as IChannel,
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an org-only channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              access: SharingAccess.ORG,
              orgs: ["org1", "org2"],
              groups: [] as string[],
            } as IChannel,
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
                predicates: [{ orgid: ["org1", "org2"] }, null],
              },
              {
                operation: "AND",
                predicates: [{ username: { not: "currentUser" } }],
              },
            ],
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an org channel with groups", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              access: SharingAccess.ORG,
              orgs: ["org1", "org2"],
              groups: ["group1", "group2"],
            } as IChannel,
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an public channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              access: SharingAccess.PUBLIC,
              orgs: ["org1", "org2"],
              groups: [] as string[],
            } as IChannel,
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users and not filter out the authenticated user", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              access: SharingAccess.PUBLIC,
              orgs: ["org1", "org2"],
              groups: ["group1", "group2"],
            } as IChannel,
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
    });
    describe("acl", () => {
      it("should search for users for a private channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
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
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an org-only channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
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
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
                predicates: [{ orgid: ["org1", "org2"] }, null],
              },
              {
                operation: "AND",
                predicates: [{ username: { not: "currentUser" } }],
              },
            ],
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an org channel with groups", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
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
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users for an public channel", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
            } as IChannel,
            currentUsername: "currentUser",
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
      it("should search for users and not filter out the authenticated user", async () => {
        const res = await searchChannelUsers(
          {
            users: ["user1", "user2"],
            channel: {
              channelAcl: [{ category: AclCategory.AUTHENTICATED_USER }],
            } as IChannel,
          },
          searchOptions
        );
        expect(hubSearchSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchSpy).toHaveBeenCalledWith(
          {
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
          },
          searchOptions
        );
        expect(res).toEqual(results);
      });
    });
  });
});
