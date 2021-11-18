/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  Filter,
  IAuthenticatedHubSearchOptions,
  _searchContent,
  _searchUsers,
} from "../src/search";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

fdescribe("searchUsers:", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });
  describe("authd:", () => {
    it("simple search", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"user"> = {
        filterType: "user",
      };
      const opts: IAuthenticatedHubSearchOptions = {
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const results = await _searchUsers(f, opts);
      expect(results.results.length).toBe(10);
      const r2 = await results.next();
      expect(r2.results.length).toBe(10);
    });
    it("username", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"user"> = {
        filterType: "user",
        username: "loadtester",
      };
      const opts: IAuthenticatedHubSearchOptions = {
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const results = await _searchUsers(f, opts);
      expect(results.results.length).toBeGreaterThan(3);
      expect(results.hasNext).toBe(false);
    });

    it("last login", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"user"> = {
        filterType: "user",
        lastlogin: {
          type: "relative-date",
          num: 7,
          unit: "days",
        },
      };
      const opts: IAuthenticatedHubSearchOptions = {
        authentication: adminSession,
        sortField: "created",
        sortOrder: "desc",
      };
      const results = await _searchUsers(f, opts);
      expect(results.results.length).toBeGreaterThan(1);
      expect(results.hasNext).toBe(false);
    });
  });
});
