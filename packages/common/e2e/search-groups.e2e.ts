/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";
import { Filter, IHubSearchOptions, _searchGroups } from "../src/search";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

describe("SearchGroups:", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });
  describe("simple filter", () => {
    it("unauthd", async () => {
      const f: Filter<"group"> = {
        filterType: "group",
        owner: "dbouwman_dc",
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
      };
      const response = await _searchGroups(f, opts);
      expect(response.results.length).toBeGreaterThan(1);
    });
    it("unauthd next", async () => {
      const f: Filter<"group"> = {
        filterType: "group",
        owner: "dbouwman_dc",
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
      };
      const response = await _searchGroups(f, opts);
      expect(response.results.length).toBeGreaterThan(1);
      const response2 = await response.next();
      expect(response2.results.length).toBeGreaterThan(1);
    });
    it("authd", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"group"> = {
        filterType: "group",
        owner: {
          exact: ["qa_bas_sol_admin"],
        },
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const response = await _searchGroups(f, opts);
      expect(response.results.length).toBe(10);
    });
    it("typeKeyword", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"group"> = {
        filterType: "group",
        tags: {
          all: ["Hub Content Group", "Hub Initiative Group"],
        },
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const response = await _searchGroups(f, opts);
      expect(response.results.length).toBe(10);
    });
    it("searchUserAccess", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"group"> = {
        filterType: "group",
        searchUserAccess: "groupMember",
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const response = await _searchGroups(f, opts);
      expect(response.results.length).toBe(10);
      // response.results.map((g) => console.log(g.thumbnailUrl));
    });
  });
});
