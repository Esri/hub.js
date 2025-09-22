import { hubItemEntityFromEditor } from "../../../src/core/_internal/hubItemEntityFromEditor";
import { Catalog } from "../../../src/search/Catalog";
import * as slugsModule from "../../../src/items/_internal/slugs";
import * as initCatalogModule from "../../../src/search/initCatalogOnEntityCreate";
import * as setMetricAndDisplayModule from "../../../src/core/schemas/internal/metrics/setMetricAndDisplay";
import { createMockContext } from "../../mocks/mock-auth";
import {
  IHubItemEntity,
  IHubItemEntityEditor,
} from "../../../src/core/types/IHubItemEntity";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import * as doesResourceExistModule from "../../../src/resources/doesResourceExist";
import * as upsertResourceModule from "../../../src/resources/upsertResource";
import * as removeResourceModule from "../../../src/resources/removeResource";
import * as metricsModule from "../../../src/metrics/editorToMetric";
import { IHubCatalog } from "../../../src/search/types/IHubCatalog";

describe("hubItemEntityFromEditor", () => {
  let context: IArcGISContext;
  let editor: IHubItemEntityEditor<IHubItemEntity>;
  beforeEach(() => {
    context = createMockContext();
    editor = {
      id: "id",
      owner: "owner",
      orgUrlKey: "orgKey",
      location: { extent: [1, 2, 3, 4] },
      view: {},
    };
  });

  it("handles slug truncation and empty slug", async () => {
    const truncateSpy = spyOn(slugsModule, "truncateSlug").and.returnValue(
      "truncated"
    );
    const result = await hubItemEntityFromEditor(
      { ...editor, _slug: "slug" },
      context
    );
    expect(truncateSpy).toHaveBeenCalledWith("slug", "orgkey");
    expect(result.entity.slug).toBe("truncated");

    const result2 = await hubItemEntityFromEditor({ ...editor }, context);
    expect(result2.entity.slug).toBe("");
  });

  it("handles thumbnail cache with and without blob", async () => {
    let result = await hubItemEntityFromEditor(
      { ...editor, _thumbnail: { blob: {} as Blob, fileName: "file.png" } },
      context
    );
    expect(result.thumbnailCache).toEqual({
      file: {} as Blob,
      filename: "file.png",
      clear: false,
    });

    result = await hubItemEntityFromEditor(
      { ...editor, _thumbnail: {} },
      context
    );
    expect(result.thumbnailCache).toEqual({ clear: true });
  });

  it("handles featured image upload and removal", async () => {
    spyOn(upsertResourceModule, "upsertResource").and.returnValue(
      Promise.resolve("url")
    );
    spyOn(doesResourceExistModule, "doesResourceExist").and.returnValue(
      Promise.resolve(true)
    );
    spyOn(removeResourceModule, "removeResource").and.returnValue(
      Promise.resolve()
    );

    // With blob
    let result = await hubItemEntityFromEditor(
      {
        ...editor,
        view: { featuredImage: { blob: "blob", fileName: "img.png" } },
      },
      context
    );
    expect(result.entity.view.featuredImageUrl).toBe("url");
    // Without blob, but resource exists
    result = await hubItemEntityFromEditor(
      { ...editor, view: { featuredImage: {} } },
      context
    );
    expect(result.entity.view.featuredImageUrl).toBeNull();
  });

  it("handles catalog setup for new and existing group", async () => {
    const fakeCatalog = {
      schemaVersion: 1,
      scopes: {
        item: {
          targetEntity: "item",
          filters: [{ predicates: [{ group: ["abc"] }] }],
        },
      },
      collections: [],
    } as IHubCatalog;
    spyOn(initCatalogModule, "initCatalogOnEntityCreate").and.returnValue(
      Promise.resolve(fakeCatalog)
    );
    spyOn(Catalog, "fromJson").and.returnValue("catalogInstance");
    // newGroup
    let result = await hubItemEntityFromEditor(
      { ...editor, _catalogSetup: { type: "newGroup" } },
      context
    );
    expect(initCatalogModule.initCatalogOnEntityCreate).toHaveBeenCalled();
    expect(result._catalog).toBe(Catalog.fromJson(fakeCatalog, context));
    // existingGroup
    result = await hubItemEntityFromEditor(
      { ...editor, _catalogSetup: { type: "existingGroup", groupId: ["abc"] } },
      context
    );
    expect(result._catalog).toBe(Catalog.fromJson(fakeCatalog, context));
    // neither
    result = await hubItemEntityFromEditor(
      { ...editor, _catalogSetup: { type: "existingGroup" } },
      context
    );
    expect(result._catalog).toBeUndefined();
  });

  it("handles metrics logic", async () => {
    spyOn(metricsModule, "editorToMetric").and.returnValue({
      metric: { id: "m" },
      displayConfig: { foo: 1 },
    });
    spyOn(setMetricAndDisplayModule, "setMetricAndDisplay").and.callFake(
      (
        entity: IHubItemEntity,
        metric: { [key: string]: any },
        display: { [key: string]: any }
      ): IHubItemEntity & {
        metric: { [key: string]: any };
        display: { [key: string]: any };
      } => ({
        ...entity,
        metric,
        display,
      })
    );
    const result = await hubItemEntityFromEditor(
      { ...editor, _metric: { cardTitle: "title" } },
      context
    );
    expect(result.entity.metric).toEqual({ id: "m" });
    expect(result.entity.display).toEqual({ foo: 1 });
  });

  it("removes ephemeral props from editor", async () => {
    spyOn(upsertResourceModule, "upsertResource").and.returnValue(
      Promise.resolve("mock-url")
    );
    spyOn(doesResourceExistModule, "doesResourceExist").and.returnValue(
      Promise.resolve(false)
    );
    spyOn(removeResourceModule, "removeResource").and.returnValue(
      Promise.resolve()
    );
    spyOn(initCatalogModule, "initCatalogOnEntityCreate").and.returnValue(
      Promise.resolve({})
    );
    const mockEditor = {
      ...editor,
      _groups: ["abc"],
      _thumbnail: {},
      _metric: {},
      _catalogSetup: { type: "newGroup" },
      _slug: "some-slug",
      view: { featuredImage: {} },
    } as IHubItemEntityEditor<IHubItemEntity>;
    await hubItemEntityFromEditor(mockEditor, context);
    expect(mockEditor._groups).toBeUndefined();
    expect(mockEditor._thumbnail).toBeUndefined();
    expect(mockEditor._metric).toBeUndefined();
    expect(mockEditor._catalogSetup).toBeUndefined();
    expect(mockEditor._slug).toBeUndefined();
    expect(mockEditor.view.featuredImage).toBeUndefined();
  });

  it("sets orgUrlKey and extent correctly", async () => {
    context = {
      ...context,
      portal: {
        urlKey: "orgKey",
        isPortal: true,
        name: "mock-portal",
        id: "123",
      },
    };
    const mockExtent = [[5], [6]];
    let result = await hubItemEntityFromEditor(
      { ...editor, orgUrlKey: undefined, location: { extent: mockExtent } },
      context
    );
    expect(result.entity.orgUrlKey).toBe("orgkey");
    expect(result.entity.extent).toEqual(mockExtent);

    context.portal.urlKey = undefined;
    result = await hubItemEntityFromEditor(
      { ...editor, orgUrlKey: undefined },
      context
    );
    expect(result.entity.orgUrlKey).toBe("");
  });

  it("returns correct structure", async () => {
    const result = await hubItemEntityFromEditor(editor, context);
    expect(result.entity).toBeDefined();
    expect(result.thumbnailCache).toBeUndefined();
    expect(result._catalog).toBeUndefined();
  });
});
