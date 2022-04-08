import * as Portal from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  Filter,
  IAuthenticatedHubSearchOptions,
  IModel,
  _searchUsers,
} from "../../src";
import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "../mocks/mock-auth";
import * as SimpleResponse from "../mocks/portal-users-search/simple-response.json";

describe("_searchUsers:", () => {
  describe("hub api:", () => {
    it("throws not implemented", async () => {
      const f: Filter<"user"> = {
        filterType: "user",
        term: "dave",
      };
      const o: IAuthenticatedHubSearchOptions = {
        api: "hub",
        authentication: MOCK_AUTH,
      };
      try {
        await _searchUsers(f, o);
      } catch (ex) {
        expect(ex.message).toBe(
          "_searchUsers is not implemented for non-arcgis apis"
        );
      }
    });
  });
  describe("portal:", () => {
    it("throws if auth not passed", async () => {
      const f: Filter<"user"> = {
        filterType: "user",
        term: "dave",
      };
      // force typescript to allow passing of options that does not include auth
      const o = {} as unknown as IAuthenticatedHubSearchOptions;
      try {
        await _searchUsers(f, o);
      } catch (ex) {
        expect(ex.message).toBe("Authentication required to search for users.");
      }
    });
    it("defaults to ago prod", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"user"> = {
        filterType: "user",
        term: "dave",
      };
      const o: IAuthenticatedHubSearchOptions = {
        authentication: MOCK_AUTH,
      };
      await _searchUsers(f, o);
      expect(searchUsersSpy.calls.count()).toBe(1, "should call searchUsers");
      const [expectedParams] = searchUsersSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("(dave)");
      expect(expectedParams.authentication).toBe(MOCK_AUTH);
    });
    it("search enterprise", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"user"> = {
        filterType: "user",
        term: "dave",
      };
      const o: IAuthenticatedHubSearchOptions = {
        authentication: MOCK_ENTERPRISE_AUTH,
      };
      await _searchUsers(f, o);
      expect(searchUsersSpy.calls.count()).toBe(1, "should call searchUsers");
      const [expectedParams] = searchUsersSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("(dave)");
      expect(expectedParams.authentication).toBe(MOCK_ENTERPRISE_AUTH);
    });
    it("passes through various options, adds urls", async () => {
      const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"user"> = {
        filterType: "user",
        term: "dave",
      };
      const site = { item: { url: "https://data.dc.gov" } } as IModel;
      const o: IAuthenticatedHubSearchOptions = {
        authentication: MOCK_ENTERPRISE_AUTH,
        sortOrder: "desc",
        sortField: "username",
        num: 11,
        site,
        start: 2,
      };

      const chk = await _searchUsers(f, o);
      expect(searchUsersSpy.calls.count()).toBe(1, "should call searchUsers");
      const [expectedParams] = searchUsersSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("(dave)");
      expect(expectedParams.num).toEqual(11);
      expect(expectedParams.sortOrder).toEqual("desc");
      expect(expectedParams.sortField).toEqual("username");
      expect(expectedParams.start).toEqual(2);
      expect(expectedParams.site).toEqual(site);
      expect(expectedParams.authentication).toBe(MOCK_ENTERPRISE_AUTH);
      const u1 = chk.results[0];
      expect(u1.username).toBe("t.hervey");
      expect(u1.thumbnailUrl).toBeDefined();
      expect(u1.profileUrl).toBe("https://data.dc.gov/people/t.hervey/profile");
    });
  });
});
