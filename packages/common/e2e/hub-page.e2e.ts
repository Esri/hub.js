import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubPage, IHubPage } from "../src";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

describe("HubPage Class", () => {
  let factory: Artifactory;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
  });
  it("can set thumbnail on a page", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create a page
    const newPage: Partial<IHubPage> = {
      name: "E2E Test Page",
      summary: "This is the summary. Delete me",
    };
    const page = await HubPage.create(newPage, ctxMgr.context);

    const imgSrc = `http://${window.location.host}/base/e2e/test-images/test-thumbnail.jpg`;
    const tnImage = await fetchImage(imgSrc);
    page.setThumbnail(tnImage, "test-thumbnail.jpg");
    await page.save();
    //
    const chk = page.getThumbnailUrl(800);
    expect(chk).toContain("test-thumbnail.jpg");
    expect(chk).toContain("w=800");
    // refetch the page
    const p2 = await HubPage.fetch(page.id, ctxMgr.context);
    expect(p2.getThumbnailUrl(800)).toEqual(chk);
    await page.delete();
  });
  it("crud page", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // create a page
    const newPage: Partial<IHubPage> = {
      name: "E2E Test Page",
      summary: "This is the summary. Delete me",
    };
    const page = await HubPage.create(newPage, ctxMgr.context);
    // at this point we have a HubPage instance, but it is not yet saved

    // Set some more props on the page via the Json
    page.update({
      name: "Oak Street Plaza",
      tags: ["tag1", "tag2"],
    });
    // save it, which actually creates the item and
    // updates the internal page object
    await page.save();
    // verify some server set props are set
    const pojo = page.toJson();
    expect(pojo.owner).toBe(ctxMgr.context.currentUser.username || "");
    expect(pojo.createdDate).toBeDefined();

    // const groups = ctxMgr.context.currentUser.groups || [];
    // const group = groups[0];
    // if (group) {
    //   // add the page to the page
    //   page.addPermissionPolicy({
    //     permission: "hub:page:edit",
    //     collaborationType: "group",
    //     collaborationId: group.id,
    //   });

    //   // verify that it works
    //   const canEditpage = page.checkPermission("hub:page:edit");
    //   // current user is hub basic and edit page requires premium
    //   expect(canEditpage.access).toBe(false);

    //   // save page and verify that the permission is there
    //   await page.save();

    //   const json = page.toJson();
    //   expect(json.permissions).toBeDefined();
    //   const p = json.permissions || [];
    //   expect(p[0].collaborationId).toBe(group.id);
    // }

    // change something else and save it again
    page.update({ summary: "This is the new summary" });
    await page.save();
    // verify the change
    expect(page.toJson().summary).toBe("This is the new summary");

    // Get the page by id, from Hub
    const pageById = await HubPage.fetch(page.toJson().id, ctxMgr.context);
    expect(pageById.toJson().id).toBe(page.toJson().id);
    // ensure differnet instance
    expect(pageById).not.toBe(page);
    const id = pageById.toJson().id;

    // delete page via Hub
    await page.delete();

    // try to get it again - should fail
    try {
      await HubPage.fetch(id, ctxMgr.context);
    } catch (ex) {
      expect((ex as any).message).toBe("Page not found.");
    }
  });
  it("ensure unique slug", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");

    // create a page
    const orgUrlKey = ctxMgr.context.portal.urlKey;
    const treesPage = await HubPage.create(
      {
        name: "Trees Page",
        summary: "This is the summary. Delete me",
        slug: `${orgUrlKey}|trees`,
      },
      ctxMgr.context
    );

    await treesPage.save();

    // Add a wait here b/c the item is not indexed yet so the slug check on second create
    // will return incorrect results
    await delay(2000);

    const oakTreesPage = await HubPage.create(
      {
        name: "Oak Trees Page",
        summary: "slug for this shoujld be trees-1",
        slug: `${orgUrlKey}|trees`,
      },
      ctxMgr.context
    );
    await oakTreesPage.save();
    const json = oakTreesPage.toJson();
    expect(json.slug).toBe(`${orgUrlKey}|trees-1`);

    await treesPage.delete();
    await oakTreesPage.delete();

    // expect page to throw if we try to save after destroy
    try {
      await treesPage.save();
    } catch (ex) {
      expect((ex as any).message).toBe("HubPage is already destroyed.");
    }
  });
});

// Quick and dirty fetch image fn
function fetchImage(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    return response.blob();
  });
}
