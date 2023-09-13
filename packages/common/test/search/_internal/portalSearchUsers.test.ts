import { cloneObject, IHubSearchOptions, IQuery } from "../../../src";
import {
  portalSearchUsers,
  communitySearchUsers,
  portalSearchUsersLegacy,
} from "../../../src/search/_internal/portalSearchUsers";
import * as Portal from "@esri/arcgis-rest-portal";
import * as users from "../../../src/users";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as SimpleResponse from "../../mocks/user-search/simple-response.json";

describe("portalSearchUsersLegacy module:", () => {
  describe("portalSearchUsersLegacy:", () => {
    it("throws if requestOptions not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {};

      try {
        await portalSearchUsersLegacy(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe(
          "requestOptions: IHubRequestOptions is required."
        );
      }
    });
    it("throws if requestOptions.auth not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://myserver.com/sharing/rest",
        },
      };

      try {
        await portalSearchUsersLegacy(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe("requestOptions must pass authentication.");
      }
    });
    it("simple search", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        users,
        "enrichUserSearchResult"
      ).and.callFake(() => Promise.resolve({}));
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                firstname: "Jane",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };

      await portalSearchUsersLegacy(qry, opts);

      expect(searchUsersSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchUsersSpy.calls.argsFor(0);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.q).toEqual(`(firstname:"Jane")`);
      expect(expectedParams.authentication).toEqual(
        opts.requestOptions?.authentication
      );
      expect(expectedParams.countFields).not.toBeDefined();
      expect(enrichUserSearchResultSpy.calls.count()).toBe(
        10,
        "should call enrichUserSearchResult for each result"
      );
    });
  });
  describe("portalSearchUsers:", () => {
    it("throws if requestOptions not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {};

      try {
        await portalSearchUsers(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe(
          "requestOptions: IHubRequestOptions is required."
        );
      }
    });
    it("throws if requestOptions.auth not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://myserver.com/sharing/rest",
        },
      };

      try {
        await portalSearchUsers(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe("requestOptions must pass authentication.");
      }
    });
    it("simple search", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        users,
        "enrichUserSearchResult"
      ).and.callFake(() => Promise.resolve({}));
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                firstname: "Jane",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };

      await portalSearchUsers(qry, opts);

      expect(searchUsersSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchUsersSpy.calls.argsFor(0);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.q).toEqual(`(firstname:"Jane")`);
      expect(expectedParams.authentication).toEqual(
        opts.requestOptions?.authentication
      );
      expect(expectedParams.countFields).not.toBeDefined();
      expect(enrichUserSearchResultSpy.calls.count()).toBe(
        10,
        "should call enrichUserSearchResult for each result"
      );
    });
  });
  describe("communitySearchUsers:", () => {
    it("throws if requestOptions not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {};

      try {
        await communitySearchUsers(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe(
          "requestOptions: IHubRequestOptions is required."
        );
      }
    });
    it("throws if requestOptions.auth not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://myserver.com/sharing/rest",
        },
      };

      try {
        await communitySearchUsers(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe("requestOptions must pass authentication.");
      }
    });
    it("simple search", async () => {
      const searchCommunityUsersSpy = spyOn(
        Portal,
        "searchCommunityUsers"
      ).and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        users,
        "enrichUserSearchResult"
      ).and.callFake(() => Promise.resolve({}));
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                firstname: "Jane",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };

      await communitySearchUsers(qry, opts);

      expect(searchCommunityUsersSpy.calls.count()).toBe(
        1,
        "should call searchItems"
      );
      const [expectedParams] = searchCommunityUsersSpy.calls.argsFor(0);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.q).toEqual(`(firstname:"Jane")`);
      expect(expectedParams.authentication).toEqual(
        opts.requestOptions?.authentication
      );
      expect(expectedParams.countFields).not.toBeDefined();
      expect(enrichUserSearchResultSpy.calls.count()).toBe(
        10,
        "should call enrichUserSearchResult for each result"
      );
    });
  });
});
