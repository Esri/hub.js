import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager, IHubProject } from "../../../src";
import { MOCK_AUTH } from "../../mocks/mock-auth";

import * as GetCategoryItemsModule from "../../../src/core/schemas/internal/getCategoryItems";
import * as GetFeaturedContentCatalogsModule from "../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import * as GetFeaturedImageUrlModule from "../../../src/core/schemas/internal/getFeaturedImageUrl";
import * as GetLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as GetLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as GetTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import { getProjectEditorConfigOptions } from "../../../src/projects/_internal/getProjectEditorConfigOptions";

/**
 * NOTE: This is not exhaustively validating the entire hash - just that the helper functions are called
 * and that the result is a valid hash
 */

describe("getProjectEditorConfigOptions", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        groups: [
          { id: "efView", capabilities: [] },
          { id: "efUpdate", capabilities: ["updateitemcontrol"] },
        ],
        privileges: [],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        customBaseUrl: "fakemaps.arcgis.com",
      } as unknown as IPortal,
    });
  });
  it("happy path", async () => {
    // setup spies
    const getCategoryItemsSpy = spyOn(
      GetCategoryItemsModule,
      "getCategoryItems"
    ).and.returnValue(Promise.resolve([]));
    const getFeaturedContentCatalogsSpy = spyOn(
      GetFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).and.returnValue(Promise.resolve([]));
    const getFeaturedImageUrlSpy = spyOn(
      GetFeaturedImageUrlModule,
      "getFeaturedImageUrl"
    ).and.callThrough();
    const getLocationExtentSpy = spyOn(
      GetLocationExtentModule,
      "getLocationExtent"
    ).and.returnValue(Promise.resolve({}));
    const getLocationOptionsSpy = spyOn(
      GetLocationOptionsModule,
      "getLocationOptions"
    ).and.returnValue(Promise.resolve([]));
    const getTagItemsSpy = spyOn(
      GetTagItemsModule,
      "getTagItems"
    ).and.returnValue(Promise.resolve(["tag2"]));

    // construct IHupProject
    const entity = {
      type: "Hub Project",
      id: "00c",
      tags: [],
      view: {
        featuredImageUrl:
          "https://www.arcgis.com/sharing/rest/content/items/1234567890abcdef1234567890abcdef/info/thumbnail/ago_downloaded.png",
      },
    } as unknown as IHubProject;

    // call method
    const result = await getProjectEditorConfigOptions(
      entity,
      authdCtxMgr.context
    );

    // ensure spies were called
    expect(getCategoryItemsSpy).toHaveBeenCalled();
    expect(getFeaturedContentCatalogsSpy).toHaveBeenCalled();
    expect(getFeaturedImageUrlSpy).toHaveBeenCalled();
    expect(getLocationExtentSpy).toHaveBeenCalled();
    expect(getLocationOptionsSpy).toHaveBeenCalled();
    expect(getTagItemsSpy).toHaveBeenCalled();

    // ensure result is correct
    expect(result.length).toEqual(7);

    // check things by scope
    const accessScope = result.find((r) => r.scope === "/properties/access");

    expect(accessScope).toBeDefined();
    expect(accessScope?.options).toBeDefined();
    expect(accessScope?.options?.orgName).toEqual("DC R&D Center");

    const locationScope = result.find(
      (r) => r.scope === "/properties/location"
    );

    expect(locationScope).toBeDefined();
    expect(locationScope?.options).toBeDefined();

    const tagsScope = result.find((r) => r.scope === "/properties/tags");

    expect(tagsScope).toBeDefined();
    expect(tagsScope?.options).toBeDefined();
    expect(tagsScope?.options?.items).toEqual(["tag2"]);

    const categoriesScope = result.find(
      (r) => r.scope === "/properties/categories"
    );

    expect(categoriesScope).toBeDefined();
    expect(categoriesScope?.options).toBeDefined();

    const featuredImageScope = result.find(
      (r) => r.scope === "/properties/view/properties/featuredImage"
    );

    expect(featuredImageScope).toBeDefined();
    expect(featuredImageScope.options).toBeDefined();
    const imgSrc = featuredImageScope.options?.imgSrc;
    expect(
      imgSrc.includes(
        "https://www.arcgis.com/sharing/rest/content/items/1234567890abcdef1234567890abcdef/info/thumbnail/ago_downloaded.png"
      )
    ).toBeTruthy();

    expect(imgSrc.includes("?token=fake-token")).toBeTruthy();
    expect(imgSrc.includes("&v=")).toBeTruthy();

    const featuredContentIdsScope = result.find(
      (r) => r.scope === "/properties/view/properties/featuredContentIds"
    );

    expect(featuredContentIdsScope).toBeDefined();

    const groupsScope = result.find((r) => r.scope === "/properties/groups");

    expect(groupsScope).toBeDefined();
    expect(groupsScope?.options).toBeDefined();
  });

  it("works without view", async () => {
    const getCategoryItemsSpy = spyOn(
      GetCategoryItemsModule,
      "getCategoryItems"
    ).and.returnValue(Promise.resolve([]));
    const getFeaturedContentCatalogsSpy = spyOn(
      GetFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).and.returnValue(Promise.resolve([]));
    const getFeaturedImageUrlSpy = spyOn(
      GetFeaturedImageUrlModule,
      "getFeaturedImageUrl"
    ).and.callThrough();
    const getLocationExtentSpy = spyOn(
      GetLocationExtentModule,
      "getLocationExtent"
    ).and.returnValue(Promise.resolve({}));
    const getLocationOptionsSpy = spyOn(
      GetLocationOptionsModule,
      "getLocationOptions"
    ).and.returnValue(Promise.resolve([]));
    const getTagItemsSpy = spyOn(
      GetTagItemsModule,
      "getTagItems"
    ).and.returnValue(Promise.resolve(["tag2"]));

    // construct IHupProject
    const entity = {
      type: "Hub Project",
      id: "00c",
      tags: [],
    } as unknown as IHubProject;

    // call method
    const result = await getProjectEditorConfigOptions(
      entity,
      authdCtxMgr.context
    );

    expect(getCategoryItemsSpy).toHaveBeenCalled();
    expect(getFeaturedContentCatalogsSpy).toHaveBeenCalled();
    expect(getFeaturedImageUrlSpy).not.toHaveBeenCalled();
    expect(getLocationExtentSpy).toHaveBeenCalled();
    expect(getLocationOptionsSpy).toHaveBeenCalled();
    expect(getTagItemsSpy).toHaveBeenCalled();

    const featuredImageScope = result.find(
      (r) => r.scope === "/properties/view/properties/featuredImage"
    );

    expect(featuredImageScope).toBeDefined();
    expect(featuredImageScope?.options).toBeDefined();
    expect(featuredImageScope?.options?.imgSrc).toBeUndefined();
  });
});
