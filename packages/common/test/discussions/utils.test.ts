import {
  CANNOT_DISCUSS,
  isDiscussable,
  setDiscussableKeyword,
  searchChannelUsers,
  SharingAccess,
  IHubRequestOptions,
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

    it("should search for users for a private channel", async () => {
      const res = await searchChannelUsers(
        {
          users: ["user1", "user2"],
          access: SharingAccess.PRIVATE,
          orgs: ["org1", "org2"],
          groups: ["group1", "group2"],
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
          access: SharingAccess.ORG,
          orgs: ["org1", "org2"],
          groups: [],
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
          access: SharingAccess.ORG,
          orgs: ["org1", "org2"],
          groups: ["group1", "group2"],
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
    it("should search for users for an public-only channel", async () => {
      const res = await searchChannelUsers(
        {
          users: ["user1", "user2"],
          access: SharingAccess.PUBLIC,
          orgs: ["org1", "org2"],
          groups: [],
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
              predicates: [{ orgid: { from: "0", to: "{" } }, null],
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
    it("should search for users for an public channel with groups", async () => {
      const res = await searchChannelUsers(
        {
          users: ["user1", "user2"],
          access: SharingAccess.PUBLIC,
          orgs: ["org1", "org2"],
          groups: ["group1", "group2"],
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
                { orgid: { from: "0", to: "{" } },
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
    it("should search for users and not filter out the authenticated user", async () => {
      const res = await searchChannelUsers(
        {
          users: ["user1", "user2"],
          access: SharingAccess.PUBLIC,
          orgs: ["org1", "org2"],
          groups: ["group1", "group2"],
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
                { orgid: { from: "0", to: "{" } },
                { group: ["group1", "group2"] },
              ],
            },
          ],
        },
        searchOptions
      );
      expect(res).toEqual(results);
    });
  });
});
