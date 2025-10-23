import * as PortalModule from "@esri/arcgis-rest-portal";
import { vi, afterEach } from "vitest";
import { createMockContext } from "../mocks/mock-auth";
import { HubDiscussion } from "../../src/discussions/HubDiscussion";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as discussionsFetchModule from "../../src/discussions/fetch";
import * as discussionsEditModule from "../../src/discussions/edit";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as slugsModule from "../../src/items/_internal/slugs";
import {
  IHubDiscussion,
  IHubDiscussionEditor,
} from "../../src/core/types/IHubDiscussion";

describe("HubDiscussion Class:", () => {
  afterEach(() => vi.restoreAllMocks());
  let authdCtxMgr: any;
  beforeEach(async () => {
    // Use a mocked ArcGISContext for tests instead of calling the async
    // ArcGISContextManager.create which may perform network operations.
    const ctx = createMockContext({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portalSelf: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
    authdCtxMgr = { context: ctx } as any;
  });

  describe("ctor:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(discussionsEditModule, "createDiscussion");
      const chk = HubDiscussion.fromJson(
        { name: "Test Discussion" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Discussion");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
    });
    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(discussionsFetchModule, "fetchDiscussion")
        .mockImplementation(async (id: string) => ({
          id,
          name: "Test Discussion",
        }));

      const chk = await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Discussion");
    });

    it("handle load missing Discussions", async () => {
      const fetchSpy = vi
        .spyOn(discussionsFetchModule, "fetchDiscussion")
        .mockRejectedValue(
          new Error("CONT_0001: Item does not exist or is inaccessible.")
        );
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("Discussion not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(discussionsFetchModule, "fetchDiscussion")
        .mockRejectedValue(new Error("ZOMG!"));
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  it("save call createDiscussion if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(discussionsEditModule, "createDiscussion")
      .mockImplementation(async (p: IHubDiscussion) => p);
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Discussion");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(discussionsEditModule, "createDiscussion")
      .mockImplementation(async (p: IHubDiscussion) => {
        p.id = "3ef";
        return p;
      });
    const chk = await HubDiscussion.create(
      { name: "Test Discussion" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Discussion");
  });
  it("create does not save by default", async () => {
    const createSpy = vi.spyOn(discussionsEditModule, "createDiscussion");
    const chk = await HubDiscussion.create(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Discussion");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Discussion 2",
      permissions: [
        {
          permission: "hub:project:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
    });
    expect(chk.toJson().name).toEqual("Test Discussion 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = vi
      .spyOn(discussionsEditModule, "updateDiscussion")
      .mockImplementation(async (p: IHubDiscussion) => p);
    const chk = HubDiscussion.fromJson(
      {
        id: "bc3",
        name: "Test Discussion",
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = vi
      .spyOn(discussionsEditModule, "deleteDiscussion")
      .mockResolvedValue(undefined);
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Discussion 2" } as IHubDiscussion);
    }).toThrowError("HubDiscussion is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect((e as Error).message).toEqual(
        "HubDiscussion is already destroyed."
      );
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as Error).message).toEqual(
        "HubDiscussion is already destroyed."
      );
    }
  });
  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockResolvedValue({ fake: "config" });
      const chk = HubDiscussion.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:discussion:edit"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:discussion:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule, "enrichEntity")
          .mockResolvedValue({});
        const chk = HubDiscussion.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("converts entity to correct structure", async () => {
        const chk = HubDiscussion.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        // NOTE: If additional transforms are added in the class they should have tests here
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
      });
    });

    describe("fromEditor:", () => {
      let chk: HubDiscussion;
      let saveSpy: any;
      let editor: IHubDiscussionEditor;
      beforeEach(async () => {
        chk = HubDiscussion.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        saveSpy = vi.spyOn(chk, "save").mockResolvedValue(undefined) as any;
        editor = await chk.toEditor();
      });
      it("handles simple prop change", async () => {
        // make changes to the editor
        editor.name = "new name";
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });

      it("sets extent correctly", async () => {
        const mockExtent = [[5], [6]];
        const result = await chk.fromEditor({
          ...editor,
          location: { extent: mockExtent },
        } as IHubDiscussionEditor);

        expect(result.extent).toEqual(mockExtent);
      });

      it("handles slug truncation and empty slug", async () => {
        const truncateSpy = vi
          .spyOn(slugsModule, "truncateSlug")
          .mockReturnValue("truncated");
        const result = await chk.fromEditor({
          ...editor,
          _slug: "slug",
        } as IHubDiscussionEditor);
        expect(truncateSpy).toHaveBeenCalledWith("slug", "fake-org");
        expect(result.slug).toBe("truncated");

        const result2 = await chk.fromEditor(editor);
        expect(result2.slug).toBe("");
      });

      it("handles thumbnail cache with and without blob", async () => {
        const result = await chk.fromEditor({
          _thumbnail: { blob: {} as Blob, fileName: "file.png" },
        } as IHubDiscussionEditor);
        expect(result._thumbnail).toBeUndefined();

        const result2 = await chk.fromEditor({
          _thumbnail: {},
        } as IHubDiscussionEditor);
        expect(result2._thumbnail).toBeUndefined();
      });

      it("sets orgUrlKey to empty string if not present on context.portal", async () => {
        // Create a context with no portal.urlKey
        const contextWithoutUrlKey = {
          ...authdCtxMgr.context,
          portal: {}, // no urlKey
        };
        const chk = HubDiscussion.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            orgUrlKey: undefined,
          },
          contextWithoutUrlKey
        );
        vi.spyOn(chk, "save").mockResolvedValue(undefined);
        const editor = await chk.toEditor();
        // Remove orgUrlKey from editor to simulate missing value
        delete editor.orgUrlKey;
        const result = await chk.fromEditor(editor);
        expect(result.orgUrlKey).toBe("");
      });
    });
  });
});
