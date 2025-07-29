import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubDiscussion } from "../../src/discussions/HubDiscussion";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as discussionsFetchModule from "../../src/discussions/fetch";
import * as discussionsEditModule from "../../src/discussions/edit";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { IHubDiscussion } from "../../src/core/types";
import { HubItemEntity } from "../../src/core/HubItemEntity";

describe("HubDiscussion Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  describe("ctor:", () => {
    it("loads from minimal json", () => {
      const createSpy = spyOn(discussionsEditModule, "createDiscussion");
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
      const fetchSpy = spyOn(
        discussionsFetchModule,
        "fetchDiscussion"
      ).and.callFake((id: string) => {
        return Promise.resolve({
          id,
          name: "Test Discussion",
        });
      });

      const chk = await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Discussion");
    });

    it("handle load missing Discussions", async () => {
      const fetchSpy = spyOn(
        discussionsFetchModule,
        "fetchDiscussion"
      ).and.callFake(() => {
        const err = new Error(
          "CONT_0001: Item does not exist or is inaccessible."
        );
        return Promise.reject(err);
      });
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("Discussion not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(
        discussionsFetchModule,
        "fetchDiscussion"
      ).and.callFake(() => {
        const err = new Error("ZOMG!");
        return Promise.reject(err);
      });
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  it("save call createDiscussion if object does not have an id", async () => {
    const createSpy = spyOn(
      discussionsEditModule,
      "createDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      return Promise.resolve(p);
    });
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Discussion");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(
      discussionsEditModule,
      "createDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      p.id = "3ef";
      return Promise.resolve(p);
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
    const createSpy = spyOn(discussionsEditModule, "createDiscussion");
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
    const updateSpy = spyOn(
      discussionsEditModule,
      "updateDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      return Promise.resolve(p);
    });
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
    const deleteSpy = spyOn(
      discussionsEditModule,
      "deleteDiscussion"
    ).and.callFake(() => {
      return Promise.resolve();
    });
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
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
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
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
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
      let parentSpy: jasmine.Spy;
      beforeEach(() => {
        parentSpy = spyOn(
          HubItemEntity.prototype as any,
          "_fromEditor"
        ).and.callThrough();
      });
      it("delegates to the parent class to handle shared logic", async () => {
        const chk = HubDiscussion.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        spyOn(chk, "save").and.returnValue(Promise.resolve());
        const editor = await chk.toEditor();
        await chk.fromEditor(editor);
        expect(parentSpy).toHaveBeenCalledTimes(1);
      });
      it("handles simple prop change", async () => {
        const chk = HubDiscussion.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });
    });
  });
});
