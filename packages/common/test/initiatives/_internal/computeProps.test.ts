import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/initiatives/_internal/computeProps";
import { IHubInitiative, IModel } from "../../../src";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeDefaultFeatures } from "../../../src/initiatives/_internal/InitiativeBusinessRules";
import * as computeLinksModule from "../../../src/initiatives/_internal/computeLinks";

describe("initiatives: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let model: IModel;
  let initiative: Partial<IHubInitiative>;

  beforeEach(async () => {
    model = {
      item: {
        type: "Hub Initiative",
        id: "00c",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {
        view: {
          featuredImageUrl: "mock-featured-image-url",
        },
      },
    } as unknown as IModel;
    initiative = {
      type: "Hub Initiative",
      id: "00c",
      slug: "mock-slug",
      view: {},
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
      expect(spy.calls.argsFor(0)[1]).toEqual(InitiativeDefaultFeatures);
    });
    it("handles missing settings hash", () => {
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });
    it("passes features hash", () => {
      model.data = {
        settings: {
          features: { details: true },
        },
        view: {
          featuredImageUrl: "",
        },
      };
      const chk = computeProps(
        model,
        initiative,
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
        initiative,
        authdCtxMgr.context.requestOptions
      );
      expect(computeLinksSpy).toHaveBeenCalledTimes(1);
      expect(chk.links).toEqual({ self: "some-link" });
    });
    it("generates a valid featured image url", () => {
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.view?.featuredImageUrl).toContain("mock-featured-image-url");
    });
  });
});
