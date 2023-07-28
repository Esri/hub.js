import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../../src";
import { configHelpers } from "../../../../src/core/schemas/internal/configOptionHelpers";
import { MOCK_AUTH } from "../../../mocks/mock-auth";

import * as GetCategoryItemsModule from "../../../../src/core/schemas/internal/getCategoryItems";
import * as GetFeaturedContentCatalogsModule from "../../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import * as GetFeaturedImageUrlModule from "../../../../src/core/schemas/internal/getFeaturedImageUrl";
import * as GetLocationExtentModule from "../../../../src/core/schemas/internal/getLocationExtent";
import * as GetLocationOptionsModule from "../../../../src/core/schemas/internal/getLocationOptions";
import * as GetTagItemsModule from "../../../../src/core/schemas/internal/getTagItems";

import * as GetGroupsToShareToModule from "../../../../src/core/schemas/internal/getSharableGroupsComboBoxItems";

describe("configHelpers:", () => {
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

  it("access", async () => {
    const fakeEntity = { fake: "entity" };
    const chk = await configHelpers.access(fakeEntity, authdCtxMgr.context);
    expect(chk.scope).toEqual("/properties/access");
    expect(chk.options?.orgName).toEqual("DC R&D Center");
  });
  it("thumbnail", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const chk = await configHelpers.thumbnail(fakeEntity, authdCtxMgr.context);
    expect(chk.scope).toEqual("/properties/_thumbnail");
    expect(chk.options?.imgSrc).toEqual("http://foo.com");
  });

  it("location", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const extentSpy = spyOn(
      GetLocationExtentModule,
      "getLocationExtent"
    ).and.callFake(() => {
      return Promise.resolve([
        [1, 2],
        [3, 4],
      ]);
    });
    const optsSpy = spyOn(
      GetLocationOptionsModule,
      "getLocationOptions"
    ).and.callFake(() => {
      return Promise.resolve({} as any);
    });
    const chk = await configHelpers.location(fakeEntity, authdCtxMgr.context);

    expect(chk.scope).toEqual("/properties/location");
    expect(chk.options?.extent).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(extentSpy).toHaveBeenCalled();
    expect(optsSpy).toHaveBeenCalled();
  });

  it("tags", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const spy = spyOn(GetTagItemsModule, "getTagItems").and.callFake(() => {
      return Promise.resolve([]);
    });

    const chk = await configHelpers.tags(fakeEntity, authdCtxMgr.context);
    expect(spy).toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/tags");
    expect(chk.options?.items).toEqual([]);
  });

  it("categories", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const spy = spyOn(GetCategoryItemsModule, "getCategoryItems").and.callFake(
      () => {
        return Promise.resolve([]);
      }
    );

    const chk = await configHelpers.categories(fakeEntity, authdCtxMgr.context);
    expect(spy).toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/categories");
    expect(chk.options?.items).toEqual([]);
  });
  it("featuredImage undefined", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const spy = spyOn(
      GetFeaturedImageUrlModule,
      "getFeaturedImageUrl"
    ).and.callFake(() => {
      return "http://foo.com";
    });

    const chk = await configHelpers.featuredImage(
      fakeEntity,
      authdCtxMgr.context
    );
    expect(spy).not.toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/view/properties/featuredImage");

    expect(chk.options?.imgSrc).not.toBeDefined();
  });
  it("featuredImage defined", async () => {
    const fakeEntity = {
      fake: "entity",
      thumbnailUrl: "http://foo.com",
      view: { featuredImageUrl: "https://bar.com" },
    };
    const spy = spyOn(
      GetFeaturedImageUrlModule,
      "getFeaturedImageUrl"
    ).and.callFake(() => {
      return "http://bar.com?token=123";
    });

    const chk = await configHelpers.featuredImage(
      fakeEntity,
      authdCtxMgr.context
    );
    expect(spy).toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/view/properties/featuredImage");
    expect(chk.options?.imgSrc).toEqual("http://bar.com?token=123");
  });

  it("featuredContentCatalogs", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const spy = spyOn(
      GetFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).and.callFake(() => {
      return [] as any[];
    });

    const chk = await configHelpers.featuredContentCatalogs(
      fakeEntity,
      authdCtxMgr.context
    );
    expect(spy).toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/view/properties/featuredContentIds");
    expect(chk.options).toEqual([]);
  });

  it("groupsToShareTo", async () => {
    const fakeEntity = { fake: "entity", thumbnailUrl: "http://foo.com" };
    const spy = spyOn(
      GetGroupsToShareToModule,
      "getSharableGroupsComboBoxItems"
    ).and.callFake(() => {
      return [] as any[];
    });

    const chk = await configHelpers.groupsToShareTo(
      fakeEntity,
      authdCtxMgr.context
    );
    expect(spy).toHaveBeenCalled();
    expect(chk.scope).toEqual("/properties/_groups");
    expect(chk.options?.items).toEqual([]);
    expect(chk.options?.disabled).toBe(false);
  });
});
