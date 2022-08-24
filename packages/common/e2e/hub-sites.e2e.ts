import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubSiteManager, IHubSite } from "../src";

describe("Hub Sites", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  it("create, update, get destroy", async () => {
    // create session
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    // create store
    const mgr = HubSiteManager.init(ctxMgr);
    // create a Site
    const newSite: Partial<IHubSite> = {
      name: "E2E Test Site",
      summary: "This is the summary. Delete me",
    };
    try {
      const site = await mgr.create(newSite);
      // inspect and ensure we have what we expect
      expect(site.typeKeywords).toBeDefined();
      // get the slug keyword
      const slug = site.typeKeywords?.find((e) => e.indexOf("slug|") === 0);
      expect(slug).toEqual(`slug|${site.slug}`);
      // update the item
      site.description = "This is the long description";
      site.culture = "en-us";

      const updatedSite = await mgr.update(site);
      // should return a new object
      expect(updatedSite).not.toBe(site);
      // get a Site via the slug
      const chk = await mgr.fetch(site.defaultHostname);
      expect(chk.id).toBe(site.id);
      // add a thumbnail
      // loaded from the karma server so we need to get some info
      const imgSrc = `http://${window.location.host}/base/e2e/test-images/test-thumbnail.jpg`;
      const tnImage = await fetchImage(imgSrc);
      const updated = await mgr.updateThumbnail(chk, tnImage, "kitteh.jpg");
      expect(updated.thumbnailUrl).toBeDefined();

      // destroy the Site
      await mgr.destroy(site.id);
    } catch (ex) {
      throw ex;
    }
  });
  it("can search", async () => {
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    // create store
    const mgr = HubSiteManager.init(ctxMgr);
    try {
      const response = await mgr.search(
        {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  owner: "dbouwman_dc",
                },
              ],
            },
          ],
        },
        { num: 3 }
      );
      // Note: Since this depends on random items
      // this may break
      expect(response.results.length).toBe(3);
      if (response.hasNext) {
        const page2 = await response.next();
        expect(page2.results.length).toBeGreaterThan(0);
      }
    } catch (ex) {
      throw ex;
    }
  });
});

// Quick and dirty fetch image fn
function fetchImage(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    return response.blob();
  });
}
