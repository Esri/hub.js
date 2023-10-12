import { IItem } from "@esri/arcgis-rest-types";
import { computeLinks } from "../../../src/templates/_internal/computeLinks";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEntityLinks } from "../../../src/core/types";
import { setProp } from "../../../src/objects";
import { initContextManager } from "../fixtures";
import * as getItemThumbnailUrlModule from "../../../src/resources/get-item-thumbnail-url";
import * as urlsModule from "../../../src/urls";

describe("templates: computeLinks", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  let item: IItem;
  let getItemHomeUrlSpy: jasmine.Spy;
  let getItemThumbnailUrlSpy: jasmine.Spy;

  beforeEach(async () => {
    item = {
      type: "Solution",
      id: "00c",
    } as IItem;
    authdCtxMgr = await initContextManager();
    unauthdCtxMgr = await ArcGISContextManager.create();

    getItemHomeUrlSpy = spyOn(urlsModule, "getItemHomeUrl").and.returnValue(
      "/some-item-home-url"
    );
    getItemThumbnailUrlSpy = spyOn(
      getItemThumbnailUrlModule,
      "getItemThumbnailUrl"
    ).and.returnValue("/some-thumbnail-url");
  });

  it("generates a links hash using the template's slug", () => {
    setProp("properties.slug", "mock-slug", item);
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.self).toBe("/some-item-home-url");
    expect(chk.siteRelative).toBe("/templates/mock-slug/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/mock-slug");
    expect(chk.advancedEditRelative).toBe(
      "/templates/mock-slug/about/edit/advanced"
    );
    expect(chk.thumbnail).toBe("/some-thumbnail-url");
  });
  it("generates a links hash using the templates's id when no slug is available", () => {
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.self).toBe("/some-item-home-url");
    expect(chk.siteRelative).toBe("/templates/00c/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/00c");
    expect(chk.advancedEditRelative).toBe("/templates/00c/about/edit/advanced");
    expect(chk.thumbnail).toBe("/some-thumbnail-url");
  });
  describe("Deployed templates", () => {
    let chk: IHubEntityLinks;
    beforeEach(() => {
      setProp("typeKeywords", ["Deployed"], item);
      chk = computeLinks(item, unauthdCtxMgr.context.requestOptions);
    });
    it("the siteRelative url redirects users to the generic content route", () => {
      expect(chk.siteRelative).toBe("/content/00c/about");
    });
    it("the workspace relative url redirects users to the item home in AGO", () => {
      expect(chk.workspaceRelative).toBe("/some-item-home-url");
    });
  });
});
