import { vi } from "vitest";
import type { IItem } from "@esri/arcgis-rest-portal";
import { computeLinks } from "../../../src/templates/_internal/computeLinks";
import { createMockContext } from "../../mocks/mock-auth";
import type { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { setProp } from "../../../src/objects/set-prop";
import { initContextManager } from "../fixtures";
import * as getItemThumbnailUrlModule from "../../../src/resources/get-item-thumbnail-url";
import * as getItemHomeUrlModule from "../../../src/urls/get-item-home-url";
import { IHubEntityLinks } from "../../../src/core/types/IHubEntityBase";

describe("templates: computeLinks", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;
  let unauthdCtxMgr: Partial<ArcGISContextManager>;
  let item: IItem;

  beforeEach(async () => {
    item = {
      type: "Solution",
      id: "00c",
    } as IItem;
    authdCtxMgr = initContextManager();
    unauthdCtxMgr = {
      context: createMockContext(),
    } as Partial<ArcGISContextManager>;

    vi.spyOn(getItemHomeUrlModule, "getItemHomeUrl").mockReturnValue(
      "/some-item-home-url"
    );
    vi.spyOn(getItemThumbnailUrlModule, "getItemThumbnailUrl").mockReturnValue(
      "/some-thumbnail-url"
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a links hash using the template's slug", () => {
    setProp("properties.slug", "mock-slug", item);
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.self).toBe("/some-item-home-url");
    expect(chk.siteRelative).toBe("/templates/mock-slug/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/00c");
    expect(chk.advancedEditRelative).toBe("/templates/mock-slug/edit/advanced");
    expect(chk.thumbnail).toBe("/some-thumbnail-url");
  });
  it("generates a links hash using the templates's id when no slug is available", () => {
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.self).toBe("/some-item-home-url");
    expect(chk.siteRelative).toBe("/templates/00c/about");
    expect(chk.workspaceRelative).toBe("/workspace/templates/00c");
    expect(chk.advancedEditRelative).toBe("/templates/00c/edit/advanced");
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
