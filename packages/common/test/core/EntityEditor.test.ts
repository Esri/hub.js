import {
  ArcGISContextManager,
  EntityEditor,
  HubContent,
  HubDiscussion,
  HubGroup,
  HubInitiative,
  HubInitiativeTemplate,
  HubPage,
  HubProject,
  HubSite,
  HubEvent,
  HubTemplate,
  IHubDiscussion,
  IHubEditableContent,
  IHubInitiative,
  IHubInitiativeTemplate,
  IHubPage,
  IHubProject,
  IHubSite,
  IHubEvent,
  IHubTemplate,
  IHubChannel,
  getProp,
  IHubUser,
} from "../../src";
import { HubChannel } from "../../src/channels/HubChannel";
import { IHubGroup } from "../../src/core/types/IHubGroup";
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubProject, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubProject.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(HubProject.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubProject.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubPage, "fromJson").and.callThrough();
      getConfigSpy = spyOn(HubPage.prototype, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      toEditorSpy = spyOn(HubPage.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubPage.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubDiscussion, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubDiscussion.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(
        HubDiscussion.prototype,
        "toEditor"
      ).and.callThrough();
      fromEditorSpy = spyOn(HubDiscussion.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubChannel, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubChannel.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(HubChannel.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubChannel.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    let getFollowersGroupSpy: jasmine.Spy;

    beforeEach(() => {
      fromJsonSpy = spyOn(HubSite, "fromJson").and.callThrough();
      getConfigSpy = spyOn(HubSite.prototype, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      toEditorSpy = spyOn(HubSite.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubSite.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      getFollowersGroupSpy = spyOn(
        HubSite.prototype,
        "getFollowersGroup"
      ).and.callFake(() => {
        return Promise.resolve({
          id: "followers00c",
          typeKeywords: [],
        });
      });
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubContent, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubContent.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(HubContent.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubContent.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubInitiative, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubInitiative.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(
        HubInitiative.prototype,
        "toEditor"
      ).and.callThrough();
      fromEditorSpy = spyOn(HubInitiative.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;

    beforeEach(() => {
      fromJsonSpy = spyOn(HubTemplate, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubTemplate.prototype,
        "getEditorConfig"
      ).and.callFake(() => Promise.resolve({} as any));
      toEditorSpy = spyOn(HubTemplate.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubTemplate.prototype, "fromEditor").and.callFake(
        () => Promise.resolve({} as any)
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubGroup, "fromJson").and.callThrough();
      getConfigSpy = spyOn(HubGroup.prototype, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      toEditorSpy = spyOn(HubGroup.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubGroup.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;

    beforeEach(() => {
      fromJsonSpy = spyOn(HubInitiativeTemplate, "fromJson").and.callThrough();
      getConfigSpy = spyOn(
        HubInitiativeTemplate.prototype,
        "getEditorConfig"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
      toEditorSpy = spyOn(
        HubInitiativeTemplate.prototype,
        "toEditor"
      ).and.callThrough();
      fromEditorSpy = spyOn(
        HubInitiativeTemplate.prototype,
        "fromEditor"
      ).and.callFake(() => {
        return Promise.resolve({} as any);
      });
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
    beforeEach(() => {
      fromJsonSpy = spyOn(HubEvent, "fromJson").and.callThrough();
      getConfigSpy = spyOn(HubEvent.prototype, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      toEditorSpy = spyOn(HubEvent.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubEvent.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;

    beforeEach(() => {
      fromJsonSpy = spyOn(HubUser, "fromJson").and.callThrough();
      getConfigSpy = spyOn(HubUser.prototype, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
      toEditorSpy = spyOn(HubUser.prototype, "toEditor").and.callThrough();
      fromEditorSpy = spyOn(HubUser.prototype, "fromEditor").and.callFake(
        () => {
          return Promise.resolve({} as any);
        }
      );
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
