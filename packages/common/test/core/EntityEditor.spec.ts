import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { vi } from "vitest";
import { HubChannel } from "../../src/channels/HubChannel";
import { HubContent } from "../../src/content/HubContent";
import { EntityEditor } from "../../src/core/EntityEditor";
import { IHubChannel } from "../../src/core/types/IHubChannel";
import { IHubDiscussion } from "../../src/core/types/IHubDiscussion";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IHubEvent } from "../../src/core/types/IHubEvent";
import { IHubGroup } from "../../src/core/types/IHubGroup";
import { IHubInitiative } from "../../src/core/types/IHubInitiative";
import { IHubInitiativeTemplate } from "../../src/core/types/IHubInitiativeTemplate";
import { IHubPage } from "../../src/core/types/IHubPage";
import { IHubProject } from "../../src/core/types/IHubProject";
import { IHubSite } from "../../src/core/types/IHubSite";
import { IHubTemplate } from "../../src/core/types/IHubTemplate";
import { IHubUser } from "../../src/core/types/IHubUser";
import { HubDiscussion } from "../../src/discussions/HubDiscussion";
import { HubEvent } from "../../src/events/HubEvent";
import { HubGroup } from "../../src/groups/HubGroup";
import { HubInitiativeTemplate } from "../../src/initiative-templates/HubInitiativeTemplate";
import { HubInitiative } from "../../src/initiatives/HubInitiative";
import { getProp } from "../../src/objects/get-prop";
import { HubPage } from "../../src/pages/HubPage";
import { HubProject } from "../../src/projects/HubProject";
import { HubSite } from "../../src/sites/HubSite";
import { HubTemplate } from "../../src/templates/HubTemplate";
import { HubUser } from "../../src/users/HubUser";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";

describe("EntityEditor:", () => {
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
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        customBaseUrl: "fakemaps.arcgis.com",
      } as unknown as PortalModule.IPortal,
    });
  });
  it("throws if entity is not supported", () => {
    const s: IHubSite = {
      id: "00c",
      type: "Unsupported Entity",
    } as IHubSite;
    try {
      EntityEditor.fromEntity(s, authdCtxMgr.context);
    } catch (err) {
      expect(getProp(err, "message")).toBe(
        "Unsupported entity type: Unsupported Entity"
      );
    }
  });
  describe("supports projects:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubProject as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubProject.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubProject.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubProject.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Project", async () => {
      const p: IHubProject = { id: "00c", type: "Hub Project" } as IHubProject;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:project:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:project:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });
  describe("supports pages:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubPage as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubPage.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubPage.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubPage.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Page", async () => {
      const p: IHubPage = { id: "00c", type: "Hub Page" } as IHubPage;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:page:edit");
      expect(getConfigSpy).toHaveBeenCalledWith("someScope", "hub:page:edit");
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports discussions:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubDiscussion as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubDiscussion.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubDiscussion.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubDiscussion.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Discussion", async () => {
      const p: IHubDiscussion = {
        id: "00c",
        type: "Discussion",
      } as IHubDiscussion;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:discussion:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:discussion:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports channels:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubChannel as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubChannel.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubChannel.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubChannel.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Channel", async () => {
      const p: IHubChannel = {
        id: "00c",
        type: "Channel",
      } as IHubChannel;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:channel:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:channel:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports sites:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    let getFollowersGroupSpy: any;

    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubSite as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubSite.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubSite.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubSite.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
      getFollowersGroupSpy = vi
        .spyOn(HubSite.prototype as any, "getFollowersGroup")
        .mockImplementation(() =>
          Promise.resolve({ id: "followers00c", typeKeywords: [] })
        );
    });

    it("verify EntityEditor with Site", async () => {
      const p: IHubSite = {
        id: "00c",
        type: "Hub Site Application",
      } as IHubSite;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:site:edit");
      expect(getConfigSpy).toHaveBeenCalledWith("someScope", "hub:site:edit");
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
      expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("supports content:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubContent as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubContent.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubContent.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubContent.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Content", async () => {
      const p: IHubEditableContent = {
        id: "00c",
        type: "Web Map",
      } as IHubEditableContent;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:content:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:content:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports initiatives:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubInitiative as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubInitiative.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubInitiative.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubInitiative.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Initiative", async () => {
      const p: IHubInitiative = {
        id: "00c",
        type: "Hub Initiative",
      } as IHubInitiative;
      const editor = EntityEditor.fromEntity(p, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:initiative:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:initiative:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports templates:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;

    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubTemplate as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubTemplate.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubTemplate.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubTemplate.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Template", async () => {
      const it: IHubTemplate = {
        id: "00c",
        type: "Solution",
      } as IHubTemplate;
      const editor = EntityEditor.fromEntity(it, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:template:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:template:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports groups:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubGroup as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubGroup.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubGroup.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubGroup.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Group", async () => {
      const g: IHubGroup = {
        id: "00c",
        type: "Group",
      } as IHubGroup;
      const editor = EntityEditor.fromEntity(g, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:group:edit");
      expect(getConfigSpy).toHaveBeenCalledWith("someScope", "hub:group:edit");
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports initiative templates:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;

    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubInitiativeTemplate as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubInitiativeTemplate.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(
        HubInitiativeTemplate.prototype as any,
        "toEditor"
      );
      fromEditorSpy = vi
        .spyOn(HubInitiativeTemplate.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Initiative Template", async () => {
      const it: IHubInitiativeTemplate = {
        id: "00c",
        type: "Hub Initiative Template",
      } as IHubInitiativeTemplate;
      const editor = EntityEditor.fromEntity(it, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:initiativeTemplate:edit");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:initiativeTemplate:edit"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports events:", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;
    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubEvent as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubEvent.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubEvent.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubEvent.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });

    it("verify EntityEditor with Event", async () => {
      const s: IHubEvent = {
        id: "00c",
        type: "Event",
      } as IHubEvent;
      const editor = EntityEditor.fromEntity(s, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:event:create");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:event:create"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });

  describe("supports users: ", () => {
    let fromJsonSpy: any;
    let getConfigSpy: any;
    let toEditorSpy: any;
    let fromEditorSpy: any;

    beforeEach(() => {
      fromJsonSpy = vi.spyOn(HubUser as any, "fromJson");
      getConfigSpy = vi
        .spyOn(HubUser.prototype as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({} as any));
      toEditorSpy = vi.spyOn(HubUser.prototype as any, "toEditor");
      fromEditorSpy = vi
        .spyOn(HubUser.prototype as any, "fromEditor")
        .mockImplementation(() => Promise.resolve({} as any));
    });
    it("verify EntityEditor with User", async () => {
      const u: IHubUser = {
        id: "00c",
        type: "User",
      } as IHubUser;
      const editor = EntityEditor.fromEntity(u, authdCtxMgr.context);
      expect(fromJsonSpy).toHaveBeenCalled();
      await editor.getConfig("someScope", "hub:user:settings");
      expect(getConfigSpy).toHaveBeenCalledWith(
        "someScope",
        "hub:user:settings"
      );
      const chk = await editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk, undefined);
    });
  });
});
