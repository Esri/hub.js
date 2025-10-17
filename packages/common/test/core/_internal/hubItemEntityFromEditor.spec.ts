import { vi } from "vitest";
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
import * as getTemplateModule from "../../../src/core/_internal/getTemplate";

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
    const truncateSpy = vi
      .spyOn(slugsModule, "truncateSlug")
      .mockReturnValue("truncated");
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
    vi.spyOn(upsertResourceModule, "upsertResource").mockResolvedValue("url");
    vi.spyOn(doesResourceExistModule, "doesResourceExist").mockResolvedValue(
      true
    );
    vi.spyOn(removeResourceModule, "removeResource").mockResolvedValue(
      undefined
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
    vi.spyOn(initCatalogModule, "initCatalogOnEntityCreate").mockResolvedValue(
      fakeCatalog as any
    );
    vi.spyOn(Catalog, "fromJson").mockReturnValue("catalogInstance" as any);
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
    vi.spyOn(metricsModule, "editorToMetric").mockReturnValue({
      metric: { id: "m" },
      displayConfig: { foo: 1 },
    } as any);
    vi.spyOn(
      setMetricAndDisplayModule,
      "setMetricAndDisplay"
    ).mockImplementation(
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
    vi.spyOn(upsertResourceModule, "upsertResource").mockResolvedValue(
      "mock-url"
    );
    vi.spyOn(doesResourceExistModule, "doesResourceExist").mockResolvedValue(
      false
    );
    vi.spyOn(removeResourceModule, "removeResource").mockResolvedValue(
      undefined
    );
    vi.spyOn(initCatalogModule, "initCatalogOnEntityCreate").mockResolvedValue(
      {} as any
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

  describe("hubItemEntityFromEditor layout setup", () => {
    let context: IArcGISContext;
    let getTemplateSpy: any;

    beforeEach(() => {
      context = {
        portal: { urlKey: "testorg" },
        userRequestOptions: {},
      } as any;
      getTemplateSpy = vi.spyOn(getTemplateModule, "getTemplate");
    });

    function makeEditor(
      props: Partial<IHubItemEntityEditor<IHubItemEntity>>
    ): IHubItemEntityEditor<IHubItemEntity> {
      return {
        view: {},
        location: {},
        ...props,
      } as IHubItemEntityEditor<IHubItemEntity>;
    }

    it("uses specified simple layout when provided", async () => {
      getTemplateSpy.mockResolvedValue("simple-layout");
      const editor = makeEditor({
        _layoutSetup: { layout: "simple" },
        orgUrlKey: "TestOrg",
      });
      const result = await hubItemEntityFromEditor(editor, context);
      expect(getTemplateSpy).toHaveBeenCalledWith(
        "simpleSiteOrPageLayout",
        context
      );
      expect(result.entity.layout).toBe("simple-layout");
    });

    it("uses specified blank layout when provided", async () => {
      getTemplateSpy.mockResolvedValue("blank-layout");
      const editor = makeEditor({
        _layoutSetup: { layout: "blank" },
        orgUrlKey: "TestOrg",
      });
      const result = await hubItemEntityFromEditor(editor, context);
      expect(getTemplateSpy).toHaveBeenCalledWith(
        "blankSiteOrPageLayout",
        context
      );
      expect(result.entity.layout).toBe("blank-layout");
    });

    it("does not update layout when _layoutSetup is undefined", async () => {
      getTemplateSpy.mockResolvedValue("blank-layout");
      const editor = makeEditor({
        orgUrlKey: "TestOrg",
        layout: { the: "original layout" } as any,
      });
      const result = await hubItemEntityFromEditor(editor, context);
      expect(getTemplateSpy).not.toHaveBeenCalled();
      expect(result.entity.layout).toEqual({ the: "original layout" });
    });
  });
});
