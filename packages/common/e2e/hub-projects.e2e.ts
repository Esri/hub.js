import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubProjectManager, IHubProject } from "../src";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

describe("Hub Projects", () => {
  let factory: Artifactory;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
  });

  it("create, update, get destroy", async () => {
    // create session
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    // create store
    const mgr = HubProjectManager.init(ctxMgr);

    // create a project
    const newProj: Partial<IHubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const p = await mgr.create(newProj);
    // inspect and ensure we have what we expect
    expect(p.typeKeywords).toBeDefined();
    // get the slug keyword
    const slug = (p.typeKeywords || []).find((e) => e.indexOf("slug|") === 0);
    expect(slug).toEqual(`slug|${p.slug}`);
    // update the item
    p.status = "active";
    p.description = "This is the long description";
    p.culture = "en-us";

    const updatedProject = await mgr.update(p);
    // should return a new object
    expect(updatedProject).not.toBe(p);
    // get a project via the slug
    const chk = await mgr.fetch(p.slug as string);
    expect(chk.id).toBe(p.id);
    // add a thumbnail
    // loaded from the karma server so we need to get some info
    const imgSrc = `http://${window.location.host}/base/e2e/test-images/test-thumbnail.jpg`;
    const tnImage = await fetchImage(imgSrc);
    const updated = await mgr.updateThumbnail(chk, tnImage, "kitteh.jpg");
    expect(updated.thumbnailUrl).toBeDefined();

    // destroy the project
    await mgr.destroy(p.id);
  });
});

// Quick and dirty fetch image fn
function fetchImage(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    return response.blob();
  });
}
