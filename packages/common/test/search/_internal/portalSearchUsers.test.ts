import {
  searchPortalUsers,
  searchCommunityUsers,
  searchPortalUsersLegacy,
} from "../../../src/search/_internal/portalSearchUsers";
import * as Portal from "@esri/arcgis-rest-portal";
import * as hubUsersModule from "../../../src/users/HubUsers";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as SimpleResponse from "../../mocks/user-search/simple-response.json";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { cloneObject } from "../../../src/util";

describe("searchPortalUsersLegacy module:", () => {
  describe("searchPortalUsersLegacy:", () => {
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
        await searchPortalUsersLegacy(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
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
        await searchPortalUsersLegacy(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
          "requestOptions must pass authentication."
        );
      }
    });
    it("simple search", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        hubUsersModule,
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

      await searchPortalUsersLegacy(qry, opts);

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
  describe("searchPortalUsers:", () => {
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
        await searchPortalUsers(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
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
        await searchPortalUsers(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
          "requestOptions must pass authentication."
        );
      }
    });
    it("simple search", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        hubUsersModule,
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

      await searchPortalUsers(qry, opts);

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
  describe("searchCommunityUsers:", () => {
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
        await searchCommunityUsers(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
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
        await searchCommunityUsers(qry, opts);
      } catch (err) {
        expect((err as Error).name).toBe("HubError");
        expect((err as Error).message).toBe(
          "requestOptions must pass authentication."
        );
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
        hubUsersModule,
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

      await searchCommunityUsers(qry, opts);

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
