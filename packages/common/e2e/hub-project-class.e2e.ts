import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubProject, IHubProject } from "../src";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

describe("HubProject Class", () => {
  let factory: Artifactory;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
  });
  it("can set thumbnail on a project", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create a project
    const newProj: Partial<IHubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const project = await HubProject.create(newProj, ctxMgr.context);

    const imgSrc = `http://${window.location.host}/base/e2e/test-images/test-thumbnail.jpg`;
    const tnImage = await fetchImage(imgSrc);
    project.setThumbnail(tnImage, "test-thumbnail.jpg");
    await project.save();
    //
    const chk = project.getThumbnailUrl(800);
    expect(chk).toContain("test-thumbnail.jpg");
    expect(chk).toContain("w=800");
    // refetch the project
    const p2 = await HubProject.fetch(project.id, ctxMgr.context);
    expect(p2.getThumbnailUrl(800)).toEqual(chk);
    await project.delete();
  });
  it("crud project", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create a project
    const newProj: Partial<IHubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const project = await HubProject.create(newProj, ctxMgr.context);
    // at this point we have a HubProject instance, but it is not yet saved

    // Set some more props on the project via the Json
    project.update({
      name: "Oak Street Plaza",
      tags: ["tag1", "tag2"],
    });
    // save it, which actually creates the item and
    // updates the internal project object
    await project.save();
    // verify some server set props are set
    const pojo = project.toJson();
    expect(pojo.owner).toBe(ctxMgr.context.currentUser.username || "");
    expect(pojo.createdDate).toBeDefined();

    const groups = ctxMgr.context.currentUser.groups || [];
    const group = groups[0];
    if (group) {
      // add the project to the project
      project.addPermissionPolicy({
        permission: "hub:project:edit",
        collaborationType: "group",
        collaborationId: group.id,
      });

      // verify that it works
      const canCreateEvent = project.checkPermission("hub:project:edit");
      expect(canCreateEvent.access).toBe(true);

      // save project and verify that the permission is there
      await project.save();

      const json = project.toJson();
      expect(json.permissions).toBeDefined();
      const p = json.permissions || [];
      expect(p[0].collaborationId).toBe(group.id);
    }

    // change something else and save it again
    project.update({ summary: "This is the new summary" });
    await project.save();
    // verify the change
    expect(project.toJson().summary).toBe("This is the new summary");

    // Get the project by id, from Hub
    const projectById = await HubProject.fetch(
      project.toJson().id,
      ctxMgr.context
    );
    expect(projectById.toJson().id).toBe(project.toJson().id);
    // ensure differnet instance
    expect(projectById).not.toBe(project);
    const id = projectById.toJson().id;
    // delete project via Hub
    await project.delete();

    // try to get it again - should fail
    try {
      await HubProject.fetch(id, ctxMgr.context);
    } catch (ex) {
      expect(ex.message).toBe("Project not found.");
    }
  });
  it("ensure unique slug", async () => {
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
    const json = oakTreesProject.toJson();
    expect(json.slug).toBe(`${orgUrlKey}|trees-1`);

    await treesProject.delete();
    await oakTreesProject.delete();

    // expect project to throw if we try to save after destroy
    try {
      await treesProject.save();
    } catch (ex) {
      expect(ex.message).toBe("HubProject is already destroyed.");
    }
  });
  it("catalog manipulation", async () => {
    // ------------
    // Simulate assiging specific content in a group to the project catalog
    // ------------
    // create project
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create a project
    const newProj: Partial<IHubProject> = {
      name: "E2E Test Project",
      summary: "This is the summary. Delete me",
    };
    const project = await HubProject.create(newProj, ctxMgr.context);
    // use End to End Test Harness Site Content group
    const groupId = "22d25224451847679bb2ce92ae687792";

    // add group to catalog item scope, with type & keyword specifiers
    project.catalog.setScope("item", {
      targetEntity: "item",
      filters: [
        {
          operation: "OR",
          predicates: [
            {
              group: groupId,
              type: "Feature Service",
              tags: "approved",
            },
          ],
        },
      ],
    });
    // execute search on catalog and get items
    const response = await project.catalog.searchItems("e2e");
    expect(response.results.length).toBe(1);

    // save the item and verify that the scope is there
    await project.save();
    // debugger;

    // clean up
    await project.delete();
  });
});

// Quick and dirty fetch image fn
function fetchImage(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    return response.blob();
  });
}
