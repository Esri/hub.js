import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { IQuery, hubSearch } from "../src/search";

fdescribe("Hub User search", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  describe("Search for Portal Users", () => {
    it("can issue portal user search", async () => {
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      const ctx = ctxMgr.context;
      const qry: IQuery = {
        targetEntity: "user",
        filters: [
          {
            predicates: [
              {
                term: "dave",
              },
            ],
          },
        ],
      };

      const response = await hubSearch(qry, {
        requestOptions: ctx.hubRequestOptions,
      });
      expect(response.results).toBeDefined();
      expect(response.results.length).toBe(1);
      expect(response.results[0].owner).toBe("dave_pub_qa_pre");
    });
  });

  describe("Search for Group Users", () => {
    it("can search for users in group by member type", async () => {
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      const ctx = ctxMgr.context;
      const qry: IQuery = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                memberType: "admin",
                email: "d@b.com",
              },
              {
                name: "e2e",
              },
            ],
          },
        ],
        properties: {
          groupId: "c08c260d3fbc4da384061b48652972e5",
        },
      };

      const response = await hubSearch(qry, {
        requestOptions: ctx.hubRequestOptions,
      });
      expect(response.results).toBeDefined();
      expect(response.results.length).toBe(2);
      response.results.map((r) => {
        expect(r.owner).toContain("e2e");
        expect(r.memberType).toEqual("admin");
      });
    });
    it("can search for users in group by member type without auth", async () => {
      const ctxMgr = await factory.getAnonContextManager("hubPremium");
      const ctx = ctxMgr.context;
      const qry: IQuery = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                memberType: "admin",
                email: "d@b.com",
              },
              {
                name: "e2e",
              },
            ],
          },
        ],
        properties: {
          groupId: "e59cab1c38e14a79a4ee36389632106c",
        },
      };

      const response = await hubSearch(qry, {
        requestOptions: ctx.hubRequestOptions,
      });
      expect(response.results).toBeDefined();
      expect(response.results.length).toBe(2);
    });
  });
});
