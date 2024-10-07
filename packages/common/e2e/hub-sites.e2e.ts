import { HubSite, IHubSite, lookupDomain, removeDomainsBySiteId } from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

// TODO: RE-WRITE USING HubSite Class

describe("Hub Sites", () => {
  let factory: Artifactory;
  describe("QAEXT:", () => {
    beforeAll(() => {
      factory = new Artifactory(config, "qaext");
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });
    it("create and delete site", async () => {
      // create context
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      // create a site
      const newSite: Partial<IHubSite> = {
        name: "QA E2E Test Site",
        summary: "This is the summary. Delete me",
      };
      const siteInstance = await HubSite.create(newSite, ctxMgr.context);
      await siteInstance.save();
      const pojo = siteInstance.toJson();
      // verify that we have a domain record
      expect(pojo.url).toBeDefined();
      // rip off the protocol and look up the domain record
      const domain = pojo.url?.split("://")[1] || "";

      const domainRecord = await lookupDomain(
        domain,
        ctxMgr.context.hubRequestOptions
      );
      expect(domainRecord).toBeDefined();
      expect(domainRecord.siteId).toEqual(siteInstance.id);
      // delete the site
      try {
        await siteInstance.delete();
      } catch (_e) {
        // debugger;
      }
    });
  });
  describe("DEVEXT:", () => {
    beforeAll(() => {
      factory = new Artifactory(config, "devext");
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });
    it("create and delete site", async () => {
      // create context
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      // create a site
      const newSite: Partial<IHubSite> = {
        name: "DEV E2E Test Site",
        summary: "This is the summary. Delete me",
      };
      const siteInstance = await HubSite.create(newSite, ctxMgr.context);
      await siteInstance.save();
      const pojo = siteInstance.toJson();
      // verify that we have a domain record
      expect(pojo.url).toBeDefined();
      // rip off the protocol and look up the domain record
      const domain = pojo.url?.split("://")[1] || "";

      const domainRecord = await lookupDomain(
        domain,
        ctxMgr.context.hubRequestOptions
      );
      expect(domainRecord).toBeDefined();
      expect(domainRecord.siteId).toEqual(siteInstance.id);
      // delete the site
      try {
        await siteInstance.delete();
      } catch (_e) {
        // debugger;
      }
    });
  });
  describe("PROD:", () => {
    beforeAll(() => {
      factory = new Artifactory(config, "prod");
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });
    it("create and delete site", async () => {
      // create context
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      // create a site
      const newSite: Partial<IHubSite> = {
        name: "PROD E2E Test Site",
        summary: "This is the summary. Delete me",
      };
      const siteInstance = await HubSite.create(newSite, ctxMgr.context);
      await siteInstance.save();
      const pojo = siteInstance.toJson();
      // verify that we have a domain record
      expect(pojo.url).toBeDefined();
      // rip off the protocol and look up the domain record
      const domain = pojo.url?.split("://")[1] || "";

      const domainRecord = await lookupDomain(
        domain,
        ctxMgr.context.hubRequestOptions
      );
      expect(domainRecord).toBeDefined();
      expect(domainRecord.siteId).toEqual(siteInstance.id);
      // delete the site
      await siteInstance.delete();

      // check what happens when we try to remove the domain again
      try {
        await removeDomainsBySiteId(pojo.id, ctxMgr.context.hubRequestOptions);
      } catch (_e) {
        // debugger;
      }
    });
  });
});

// Quick and dirty fetch image fn
function fetchImage(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    return response.blob();
  });
}
