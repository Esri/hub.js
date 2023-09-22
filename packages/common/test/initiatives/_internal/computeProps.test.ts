import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/initiatives/_internal/computeProps";
import { IHubInitiative, IModel } from "../../../src";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeDefaultFeatures } from "../../../src/initiatives/_internal/InitiativeBusinessRules";

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
      data: {},
    } as IModel;
    initiative = {
      type: "Hub Initiative",
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
    describe("links hash", () => {
      it("generates a links hash using the initiative's slug", () => {
        const chk = computeProps(
          model,
          initiative,
          authdCtxMgr.context.requestOptions
        );

        expect(chk.links?.siteRelative).toBe("/initiatives2/mock-slug");
        expect(chk.links?.workspaceRelative).toBe(
          "/workspace/initiatives/mock-slug"
        );
      });
      it("generates a links hash using the initiative's id when no slug is available", () => {
        initiative.slug = undefined;
        const chk = computeProps(
          model,
          initiative,
          authdCtxMgr.context.requestOptions
        );

        expect(chk.links?.siteRelative).toBe("/initiatives2/00c");
        expect(chk.links?.workspaceRelative).toBe("/workspace/initiatives/00c");
      });
    });
  });
});
