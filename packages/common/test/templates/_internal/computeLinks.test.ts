import { IItem } from "@esri/arcgis-rest-types";
import { computeLinks } from "../../../src/templates/_internal/computeLinks";
import { ArcGISContextManager, setProp } from "../../../src";
import { initContextManager } from "../fixtures";
import * as getItemThumbnailUrlModule from "../../../src/resources/get-item-thumbnail-url";

describe("templates: computeLinks", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  let item: IItem;

  beforeEach(async () => {
    item = {
      type: "Solution",
      id: "00c",
    } as IItem;
    authdCtxMgr = await initContextManager();
    unauthdCtxMgr = await ArcGISContextManager.create();
  });

  it("generates a links hash using the template's slug", () => {
    setProp("properties.slug", "mock-slug", item);
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/templates/mock-slug/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/mock-slug");
  });
  it("generates a links hash using the templates's id when no slug is available", () => {
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/templates/00c/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/00c");
  });
  it("Deployed templates are redirected to the generic content route", () => {
    setProp("typeKeywords", ["Deployed"], item);
    const chk = computeLinks(item, unauthdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/content/00c/about");
  });
});
