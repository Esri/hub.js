import {
  ArcGISContextManager,
  EntityEditor,
  HubContent,
  HubDiscussion,
  HubGroup,
  HubInitiative,
  HubPage,
  HubProject,
  HubSite,
  IHubDiscussion,
  IHubEditableContent,
  IHubInitiative,
  IHubPage,
  IHubProject,
  IHubSite,
  getProp,
} from "../../src";
import { IHubGroup } from "../../src/core/types/IHubGroup";
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
    });
  });

  describe("supports sites:", () => {
    let fromJsonSpy: jasmine.Spy;
    let getConfigSpy: jasmine.Spy;
    let toEditorSpy: jasmine.Spy;
    let fromEditorSpy: jasmine.Spy;
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
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
      const chk = editor.toEditor();
      expect(toEditorSpy).toHaveBeenCalled();
      expect(chk.id).toBe("00c");
      await editor.save(chk);
      expect(fromEditorSpy).toHaveBeenCalledWith(chk);
    });
  });
});
