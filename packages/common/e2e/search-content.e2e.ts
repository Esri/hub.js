/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";
import { Filter, IHubSearchOptions, _searchContent } from "../src/search";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

fdescribe("SearchContent:", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });
  describe("simple filter", () => {
    it("unauthd", async () => {
      const f: Filter<"content"> = {
        filterType: "content",
        owner: "dbouwman_dc",
      };
      const opts: IHubSearchOptions = {
        apis: ["arcgisQA"],
      };
      const results = await _searchContent(f, opts);
      expect(results.results.length).toBeGreaterThan(1);
    });
    it("authd", async () => {
      const orgName = "hubBasic";
      let adminSession: UserSession;
      adminSession = factory.getSession(orgName, "admin");
      const f: Filter<"content"> = {
        filterType: "content",
        owner: {
          exact: ["qa_bas_sol_admin"],
        },
      };
      const opts: IHubSearchOptions = {
        apis: ["arcgisQA"],
        authentication: adminSession,
        aggregations: ["tags", "access"],
        sortField: "created",
        sortOrder: "desc",
      };
      const results = await _searchContent(f, opts);
      expect(results.results.length).toBe(10);
      expect(results.facets?.length).toBe(2);
    });
  });
});
