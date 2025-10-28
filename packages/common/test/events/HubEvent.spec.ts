import * as portalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as eventEditModule from "../../src/events/edit";
import * as eventFetchModule from "../../src/events/fetch";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { HubEvent } from "../../src/events/HubEvent";
import { IHubEvent } from "../../src/core/types/IHubEvent";
import * as shareEventWithGroupsModule from "../../src/events/_internal/shareEventWithGroups";
import * as unshareEventWithGroupsModule from "../../src/events/_internal/unshareEventWithGroups";
import * as getEventGroupsModule from "../../src/events/getEventGroups";
import * as eventsModule from "../../src/events/api/events";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import * as hubItemEntityFromEditorModule from "../../src/core/_internal/hubItemEntityFromEditor";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

describe("HubEvent Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  afterEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    // Use a mocked context object instead of creating a real ArcGISContextManager
    // This avoids network or fetch behavior during tests.
    authdCtxMgr = {
      context: {
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
        } as unknown as portalModule.IUser,
        portal: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-Org",
        } as unknown as portalModule.IPortal,
        portalUrl: "https://myserver.com",
        hubRequestOptions: {
          authentication: MOCK_AUTH,
        },
      },
    } as unknown as ArcGISContextManager;
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
    expect(chk.toJson().orgUrlKey).toEqual("fake-org");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const createSpy = vi
      .spyOn(eventEditModule as any, "createHubEvent")
      .mockResolvedValue(undefined as any);
    const updateSpy = vi
      .spyOn(eventEditModule as any, "updateHubEvent")
      .mockImplementation((p: any) => Promise.resolve(p));
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
    const updateSpy = vi.spyOn(eventEditModule as any, "updateHubEvent");
    const createSpy = vi
      .spyOn(eventEditModule as any, "createHubEvent")
      .mockResolvedValue({ id: "new-id" } as any);
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
    const deleteSpy = vi
      .spyOn(eventEditModule as any, "deleteHubEvent")
      .mockImplementation(() => Promise.resolve());
    const chk = HubEvent.fromJson({ name: "Test Event" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(
      chk.id,
      authdCtxMgr.context.hubRequestOptions
    );
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
      fail("delete did not reject");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubEvent is already destroyed.");
    }

    try {
      await chk.save();
      fail("save did not reject");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubEvent is already destroyed.");
    }
  });

  it("functions for anonymous user", () => {
    const context: IArcGISContext = {} as any;
    const chk = HubEvent.fromJson({ name: "Test Event" }, context);
    expect(chk).toBeTruthy();
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({ fake: "config" }));
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
      let hubItemEntityFromEditorSpy: any;
      beforeEach(() => {
        // capture the original implementation so the spy can call through
        const original = (hubItemEntityFromEditorModule as any)
          .hubItemEntityFromEditor;
        // cast original to Function to avoid unsafe any call in strict TS
        const originalFn = original as (...args: any[]) => any;
        hubItemEntityFromEditorSpy = vi
          .spyOn(
            hubItemEntityFromEditorModule as any,
            "hubItemEntityFromEditor"
          )
          .mockImplementation((...args: any[]) => originalFn(...args));
      });
      it("delegates to the hubItemEntityFromEditor util to handle shared logic", async () => {
        const chk = HubEvent.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        vi.spyOn(chk as any, "save").mockReturnValue(Promise.resolve());
        const editor = await chk.toEditor();
        await chk.fromEditor(editor);
        expect(hubItemEntityFromEditorSpy).toHaveBeenCalledTimes(1);
      });
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
        const saveSpy = vi
          .spyOn(chk as any, "save")
          .mockReturnValue(Promise.resolve());
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

      it("sets thumbnail url if available", async () => {
        const chk = HubEvent.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = vi
          .spyOn(chk as any, "save")
          .mockReturnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = { url: "https://thumbnail.jpg" };
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });

      it("does not set thumbnail if url is not available", async () => {
        const chk = HubEvent.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = vi
          .spyOn(chk as any, "save")
          .mockReturnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {};
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
        const saveSpy = vi
          .spyOn(chk as any, "save")
          .mockReturnValue(Promise.resolve() as any);
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        // call fromEditor
        try {
          await chk.fromEditor(editor);
        } catch (ex) {
          const error = ex as { message?: string };
          expect(error.message).toContain("Cannot create");
          expect(saveSpy).toHaveBeenCalledTimes(0);
        }
      });
    });
  });

  describe("shareWithGroup", () => {
    it("should reject when user not authenticated", async () => {
      // Create a mocked context manager with no currentUser to simulate anonymous
      authdCtxMgr = {
        context: {
          authentication: undefined,
          currentUser: undefined,
          portal: {
            name: "DC R&D Center",
            id: "BRXFAKE",
            urlKey: "fake-org",
          } as unknown as portalModule.IPortal,
          portalUrl: "https://myserver.com",
          hubRequestOptions: {},
        },
      } as unknown as ArcGISContextManager;
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
        const error = e as { message?: string };
        expect(error.message).toBe(
          "Cannot share event with group when no user is logged in."
        );
      }
    });
    it("should call shareEventWithGroups", async () => {
      const entity = {
        name: "Test Entity",
        thumbnailUrl: "https://myserver.com/thumbnail.png",
      };
      const chk = HubEvent.fromJson(entity, authdCtxMgr.context);
      const shareEventWithGroupsSpy = vi
        .spyOn(shareEventWithGroupsModule as any, "shareEventWithGroups")
        .mockReturnValue(chk["entity"] as any);
      await chk.shareWithGroup("123");
      expect(shareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
      expect(shareEventWithGroupsSpy).toHaveBeenCalledWith(
        ["123"],
        /* tslint:disable-next-line */
        chk["entity"],
        authdCtxMgr.context
      );
    });
  });

  describe("shareWithGroups", () => {
    it("should call shareEventWithGroups", async () => {
      const entity = {
        name: "Test Entity",
        thumbnailUrl: "https://myserver.com/thumbnail.png",
      };
      const chk = HubEvent.fromJson(entity, authdCtxMgr.context);
      const shareEventWithGroupsSpy = vi
        .spyOn(shareEventWithGroupsModule as any, "shareEventWithGroups")
        .mockReturnValue(chk["entity"] as any);
      await chk.shareWithGroups(["123", "456"]);
      expect(shareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
      expect(shareEventWithGroupsSpy).toHaveBeenCalledWith(
        ["123", "456"],
        /* tslint:disable-next-line */
        chk["entity"],
        authdCtxMgr.context
      );
    });
  });

  describe("unshareWithGroup", () => {
    it("should call unshareEventWithGroups", async () => {
      const entity = {
        name: "Test Entity",
        thumbnailUrl: "https://myserver.com/thumbnail.png",
      };
      const chk = HubEvent.fromJson(entity, authdCtxMgr.context);
      const unshareEventWithGroupsSpy = vi
        .spyOn(unshareEventWithGroupsModule as any, "unshareEventWithGroups")
        .mockReturnValue(chk["entity"] as any);
      await chk.unshareWithGroup("123");
      expect(unshareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
      expect(unshareEventWithGroupsSpy).toHaveBeenCalledWith(
        ["123"],
        /* tslint:disable-next-line */
        chk["entity"],
        authdCtxMgr.context
      );
    });
  });

  describe("unshareWithGroups", () => {
    it("should call unshareEventWithGroups", async () => {
      const entity = {
        name: "Test Entity",
        thumbnailUrl: "https://myserver.com/thumbnail.png",
      };
      const chk = HubEvent.fromJson(entity, authdCtxMgr.context);
      const unshareEventWithGroupsSpy = vi
        .spyOn(unshareEventWithGroupsModule as any, "unshareEventWithGroups")
        .mockReturnValue(chk["entity"] as any);
      await chk.unshareWithGroups(["123", "456"]);
      expect(unshareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
      expect(unshareEventWithGroupsSpy).toHaveBeenCalledWith(
        ["123", "456"],
        /* tslint:disable-next-line */
        chk["entity"],
        authdCtxMgr.context
      );
    });
  });

  describe("setAccess", () => {
    it("should call updateEvent", async () => {
      const entity = {
        id: "31c",
        name: "Test Entity",
        thumbnailUrl: "https://myserver.com/thumbnail.png",
      };
      const chk = HubEvent.fromJson(entity, authdCtxMgr.context);
      const updateEventSpy = vi
        .spyOn(eventsModule as any, "updateEvent")
        .mockReturnValue(chk["entity"] as any);
      await chk.setAccess("org");
      expect(updateEventSpy).toHaveBeenCalledTimes(1);
      expect(updateEventSpy).toHaveBeenCalledWith({
        eventId: "31c",
        data: {
          access: "ORG",
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
    });
  });

  describe("sharedWith", () => {
    it("should call getEventGroups", async () => {
      const chk = HubEvent.fromJson(
        {
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      const groups = [
        { id: "31c", capabilities: [] } as unknown as portalModule.IGroup,
        {
          id: "31c",
          capabilities: ["updateitemcontrol"],
        } as unknown as portalModule.IGroup,
      ];
      const getEventGroupsSpy = vi
        .spyOn(getEventGroupsModule as any, "getEventGroups")
        .mockReturnValue(Promise.resolve(groups));
      const res = await chk.sharedWith();
      expect(getEventGroupsSpy).toHaveBeenCalledTimes(1);
      expect(getEventGroupsSpy).toHaveBeenCalledWith(
        /* tslint:disable-next-line */
        chk["entity"].id,
        authdCtxMgr.context
      );
      expect(res).toEqual(groups);
    });
  });

  describe("fetch", () => {
    it("should fetch the event", async () => {
      const fetchEventSpy = vi
        .spyOn(eventFetchModule as any, "fetchEvent")
        .mockResolvedValue({ name: "my event" } as any);
      const res = await HubEvent.fetch("31c", authdCtxMgr.context);
      expect(fetchEventSpy).toHaveBeenCalledTimes(1);
      expect(fetchEventSpy).toHaveBeenCalledWith(
        "31c",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(res instanceof HubEvent).toBe(true);
    });
    it("should reject when an error occurs", async () => {
      vi.spyOn(eventFetchModule as any, "fetchEvent").mockImplementation(() => {
        throw new Error("fail");
      });
      try {
        await HubEvent.fetch("31c", authdCtxMgr.context);
        fail("not rejected");
      } catch (e) {
        const error = e as { message?: string };
        expect(error.message).toBe("Event not found.");
      }
    });
  });
});
