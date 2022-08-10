import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { Hub, HubProject } from "../src";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

fdescribe("HubProject Class", () => {
  let factory: Artifactory;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
  });
  it("crud project", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create Hub
    const myHub = await Hub.create({ contextManager: ctxMgr });
    // create a project
    const newProj: Partial<HubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const project = await HubProject.create(newProj, ctxMgr.context);
    // at this point we have a HubProject instance, but it is not yet saved
    // set some more props on the project
    project.name = "Oak Street Plaza";
    project.tags = ["tag1", "tag2"];
    // save it, which actually creates the item and
    // updates the internal project object
    await project.save();
    // verify some server set props are set
    expect(project.owner).toBe("admin");
    expect(project.createdDate).toBeDefined();

    // change something else and save it again
    project.summary = "This is the new summary";
    await project.save();
    // verify the change
    expect(project.summary).toBe("This is the new summary");

    // Get the project by id, from Hub
    const projectById = await myHub.fetchProject(project.id);
    expect(projectById.id).toBe(project.id);
    // ensure differnet instance
    expect(projectById).not.toBe(project);

    // delete project via Hub
    await myHub.destroyProject(project.id);
    debugger;
    // try to get it again - should fail
    try {
      await myHub.fetchProject(project.id);
    } catch (ex) {
      expect(ex.message).toBe("Project not found");
    }
  });
  fit("ensure unique slug", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");

    // create a project
    const orgUrlKey = ctxMgr.context.portal.urlKey;
    const treesProject = await HubProject.create(
      {
        name: "Trees Project",
        summary: "This is the summary. Delete me",
        slug: `${orgUrlKey}|trees`,
      },
      ctxMgr.context
    );

    await treesProject.save();

    // Add a wait here b/c the item is not indexed yet so the slug check on second create
    // will return incorrect results
    await delay(2000);

    const oakTreesProject = await HubProject.create(
      {
        name: "Oak Trees Project",
        summary: "slug for this shoujld be trees-1",
        slug: `${orgUrlKey}|trees`,
      },
      ctxMgr.context
    );
    await oakTreesProject.save();

    expect(oakTreesProject.slug).toBe(`${orgUrlKey}|trees-1`);
    debugger;

    await treesProject.destroy();
    await oakTreesProject.destroy();

    // expect project to throw if we try to save after destroy
    try {
      await treesProject.save();
    } catch (ex) {
      expect(ex.message).toBe("HubProject is already destroyed");
    }
  });
});
