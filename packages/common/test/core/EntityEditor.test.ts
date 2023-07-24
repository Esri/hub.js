import {
  ArcGISContextManager,
  EntityEditor,
  HubProject,
  IHubProject,
  IHubSite,
  getProp,
} from "../../src";
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
    // Create spies for the methods EntityEditor calls
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
});
