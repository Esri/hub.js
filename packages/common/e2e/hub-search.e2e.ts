import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  hubSearch,
  hubSearchItems,
  hubSearchGroups,
  Filter,
  IHubSearchOptions,
} from "../src";
import { UserSession } from "@esri/arcgis-rest-auth";

fdescribe("hubSearch validation:", () => {
  let factory: Artifactory;
  const orgName = "hubBasic";
  let adminSession: UserSession;
  beforeAll(() => {
    factory = new Artifactory(config);
    adminSession = factory.getSession(orgName, "admin");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  describe("validate hubSearchItems:", () => {
    it("unauthd", async () => {
      const filter: Filter<"item"> = {
        filterType: "item",
        owner: {
          exact: ["qa_bas_sol_admin"],
        },
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        num: 5,
        aggFields: ["tags"],
        sortField: "created",
        sortOrder: "desc",
      };

      const response = await hubSearchItems(filter, opts);
      expect(response.results.length).toBe(5);
      expect(response.facets.length).toBeGreaterThan(0);
    });

    it("authd", async () => {
      const filter: Filter<"item"> = {
        filterType: "item",
        owner: {
          exact: ["qa_bas_sol_admin"],
        },
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        num: 5,
        authentication: adminSession,
        aggFields: ["tags"],
        sortField: "created",
        sortOrder: "desc",
      };

      const response = await hubSearchItems(filter, opts);
      expect(response.results.length).toBe(5);
      expect(response.facets.length).toBeGreaterThan(0);
    });
    it("hub-api authd", () => {});

    fit("hub-api unauthd", async () => {
      const filter: Filter<"item"> = {
        filterType: "item",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        api: {
          label: "hub-beta-dev",
          type: "arcgis-hub",
          url: "https://opendatadev.arcgis.com/api/items/beta/search",
        },
        num: 5,
        aggFields: ["tags"],
        sortField: "created",
        sortOrder: "desc",
      };

      const response = await hubSearchItems(filter, opts);
      debugger;
      expect(response.results.length).toBe(5);
      expect(response.facets.length).toBeGreaterThan(0);
    });
  });

  describe("validate hubSearchGroups:", () => {
    it("authd", async () => {
      const filter: Filter<"group"> = {
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
        num: 5,
      };

      const response = await hubSearchGroups(filter, opts);
      expect(response.results.length).toBe(5);
      expect(response.facets).not.toBeDefined();
    });
  });

  describe("validate hubSearch:", () => {
    it("authd, search items", async () => {
      const filter: Filter<"item"> = {
        filterType: "item",
        owner: {
          exact: ["qa_bas_sol_admin"],
        },
      };
      const opts: IHubSearchOptions = {
        api: "arcgisQA",
        num: 5,
        authentication: adminSession,
        aggFields: ["tags"],
        sortField: "created",
        sortOrder: "desc",
      };

      const response = await hubSearch(filter, opts);
      expect(response.results.length).toBe(5);
      expect(response.facets.length).toBeGreaterThan(0);
    });

    it("authd, search groups", async () => {
      const filter: Filter<"group"> = {
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
        num: 5,
      };

      const response = await hubSearch(filter, opts);
      expect(response.results.length).toBe(5);
      expect(response.facets).not.toBeDefined();
    });
  });
});
