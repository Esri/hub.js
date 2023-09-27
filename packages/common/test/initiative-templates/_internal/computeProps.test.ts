import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/initiative-templates/_internal/computeProps";
import { IHubInitiativeTemplate, IModel } from "../../../src";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeTemplateDefaultFeatures } from "../../../src/initiative-templates/_internal/InitiativeTemplateBusinessRules";
describe("initiative templates: computeProps:", () => {
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
  describe("features:", () => {
    let spy: jasmine.Spy;
    beforeEach(() => {
      spy = spyOn(
        processEntitiesModule,
        "processEntityFeatures"
      ).and.returnValue({ details: true, settings: false });
    });
    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.calls.argsFor(0)[1]).toEqual(
        InitiativeTemplateDefaultFeatures
      );
    });
    it("handles missing settings hash", () => {
      const model: IModel = {
        item: {
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {},
      } as IModel;
      const init: Partial<IHubInitiativeTemplate> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Initiative Template",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {},
        },
      } as unknown as IModel;
      const init: Partial<IHubInitiativeTemplate> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("passes features hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Initiative Template",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {
            features: {
              details: true,
            },
          },
        },
      } as unknown as IModel;
      const init: Partial<IHubInitiativeTemplate> = {};
      const chk = computeProps(model, init, authdCtxMgr.context.requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({ details: true });
    });
  });
});
