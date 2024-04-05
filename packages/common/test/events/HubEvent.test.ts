import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as eventEditModule from "../../src/events/edit";
import * as eventFetchModule from "../../src/events/fetch";
import * as eventModule from "../../src/events/api/events";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { HubEvent } from "../../src/events/HubEvent";
import { IHubEvent } from "../../src/core/types/IHubEvent";

describe("HubEvent Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
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

  it("update applies partial changes to internal state", () => {
    const chk = HubEvent.fromJson({ name: "Test Event" }, authdCtxMgr.context);
    chk.update({
      name: "Test Event 2",
      permissions: [
        {
          permission: "hub:event:edit",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
    });
    expect(chk.toJson().name).toEqual("Test Event 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const createSpy = spyOn(eventEditModule, "createHubEvent");
    const updateSpy = spyOn(eventEditModule, "updateHubEvent").and.callFake(
      (p: IHubEvent) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubEvent.fromJson(
      {
        id: "bc3",
        name: "Test Event",
        orgUrlKey: "fake-org",
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("creates if no id", async () => {
    const updateSpy = spyOn(eventEditModule, "updateHubEvent");
    const createSpy = spyOn(eventEditModule, "createHubEvent");
    const chk = HubEvent.fromJson(
      {
        name: "Test Event",
        orgUrlKey: "fake-org",
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(eventModule, "deleteEvent").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubEvent.fromJson({ name: "Test Event" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Event 2" } as IHubEvent);
    }).toThrowError("HubEvent is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubEvent is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubEvent is already destroyed.");
    }
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubEvent.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:event:create"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:event:create",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("converts entity to correct structure", async () => {
        const chk = HubEvent.fromJson(
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
      it("handles simple prop change", async () => {
        const chk = HubEvent.fromJson(
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

      it("throws if creating", async () => {
        const chk = HubEvent.fromJson(
          {
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
        try {
          await chk.fromEditor(editor);
        } catch (ex) {
          expect(ex.message).toContain("Cannot create");
          expect(saveSpy).toHaveBeenCalledTimes(0);
        }
      });
    });
  });

  describe("shareWithGroup", () => {
    it("should reject for now", async () => {
      const chk = HubEvent.fromJson(
        {
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      try {
        await chk.shareWithGroup("123");
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("not implemented");
      }
    });
  });

  describe("unshareWithGroup", () => {
    it("should reject for now", async () => {
      const chk = HubEvent.fromJson(
        {
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      try {
        await chk.unshareWithGroup("123");
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("not implemented");
      }
    });
  });

  describe("setAccess", () => {
    it("should reject for now", async () => {
      const chk = HubEvent.fromJson(
        {
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      try {
        await chk.setAccess("private");
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("not implemented");
      }
    });
  });

  describe("sharedWith", () => {
    it("should reject for now", async () => {
      const chk = HubEvent.fromJson(
        {
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      try {
        await chk.sharedWith();
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("not implemented");
      }
    });
  });

  describe("fetch", () => {
    it("should fetch the event", async () => {
      const fetchEventSpy = spyOn(
        eventFetchModule,
        "fetchEvent"
      ).and.returnValue(
        new Promise((resolve) => resolve({ name: "my event" }))
      );
      const res = await HubEvent.fetch("31c", authdCtxMgr.context);
      expect(fetchEventSpy).toHaveBeenCalledTimes(1);
      expect(fetchEventSpy).toHaveBeenCalledWith(
        "31c",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(res instanceof HubEvent).toBe(true);
    });
    it("should reject when an error occurs", async () => {
      spyOn(eventFetchModule, "fetchEvent").and.throwError("fail");
      try {
        await HubEvent.fetch("31c", authdCtxMgr.context);
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("Event not found.");
      }
    });
  });
});
