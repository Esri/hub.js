import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/projects/_internal/computeProps";
import { IHubProject, IModel } from "../../../src";
import { ProjectDefaultCapabilities } from "../../../src/projects/_internal/ProjectBusinessRules";
import * as processEntitiesModule from "../../../src/capabilities";
describe("projects: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
  });
  describe("capabilities:", () => {
    it("handles missing settings hash", () => {
      const spy = spyOn(
        processEntitiesModule,
        "processEntityCapabilities"
      ).and.returnValue({ details: true, settings: false });
      const model: IModel = {
        item: {
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {},
      } as IModel;
      const init: Partial<IHubProject> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(chk.capabilities?.details).toBeTruthy();
      expect(chk.capabilities?.settings).toBeFalsy();
      expect(spy).toHaveBeenCalledWith({}, ProjectDefaultCapabilities);
    });
    it("handles missing capabilities hash", () => {
      const spy = spyOn(
        processEntitiesModule,
        "processEntityCapabilities"
      ).and.returnValue({ details: true, settings: false });
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Project",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {},
        },
      } as unknown as IModel;
      const init: Partial<IHubProject> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(chk.capabilities?.details).toBeTruthy();
      expect(chk.capabilities?.settings).toBeFalsy();
      expect(spy).toHaveBeenCalledWith({}, ProjectDefaultCapabilities);
    });
    it("passes capabilities hash", () => {
      const spy = spyOn(
        processEntitiesModule,
        "processEntityCapabilities"
      ).and.returnValue({ details: true, settings: false });
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Project",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {
            capabilities: {
              details: true,
            },
          },
        },
      } as unknown as IModel;
      const init: Partial<IHubProject> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        model.data?.settings?.capabilities,
        ProjectDefaultCapabilities
      );
      expect(chk.capabilities?.details).toBeTruthy();
      expect(chk.capabilities?.settings).toBeFalsy();
    });
  });
});
