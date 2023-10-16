import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/initiative-templates/_internal/computeProps";
import { IHubInitiativeTemplate, IModel } from "../../../src";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeTemplateDefaultFeatures } from "../../../src/initiative-templates/_internal/InitiativeTemplateBusinessRules";
import * as computeLinksModule from "../../../src/initiative-templates/_internal/computeLinks";
describe("initiative templates: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let model: IModel;
  let initiativeTemplate: Partial<IHubInitiativeTemplate>;

  beforeEach(async () => {
    model = {
      item: {
        type: "Hub Initiative Template",
        id: "00c",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as IModel;
    initiativeTemplate = {
      type: "Hub Initiative Template",
      id: "00c",
      slug: "mock-slug",
    };
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
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("passes features hash", () => {
      model.data = {
        settings: {
          features: {
            details: true,
          },
        },
      };
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({ details: true });
    });

    it("generates a links hash", () => {
      const computeLinksSpy = spyOn(
        computeLinksModule,
        "computeLinks"
      ).and.returnValue({ self: "some-link" });
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );
      expect(computeLinksSpy).toHaveBeenCalledTimes(1);
      expect(chk.links).toEqual({ self: "some-link" });
    });
  });
});
