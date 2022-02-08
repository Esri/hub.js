import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";
import { ArcGISContextManager } from "../src/ArcGISContextManager";
import { HubProjectStore, IHubProject } from "../src";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

fdescribe("Hub Projects", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });

  it("create, update, get destroy", async () => {
    // create session
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    // create store
    const store = HubProjectStore.create(ctxMgr);
    // create a project
    const newProj: Partial<IHubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const p = await store.create(newProj);
    // inspect and ensure we have what we expect
    expect(p.typeKeywords).toBeDefined();
    // get the slug keyword
    const slug = p.typeKeywords.find((e) => e.indexOf("slug|") === 0);
    expect(slug).toEqual("slug|qa-bas-hub-e2e-test-project");
    // update the item
    p.status = "active";
    p.description = "This is the long description";
    p.culture = "en-us";
    const updatedProject = await store.update(p);
    // should return a new object
    expect(updatedProject).not.toBe(p);
    // get a project via the slug
    const chk = await store.get("qa-bas-hub-e2e-test-project");
    expect(chk.id).toBe(p.id);
    // destroy the project
    await store.destroy(p.id);
  });
});
