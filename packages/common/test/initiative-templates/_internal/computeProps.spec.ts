import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { computeProps } from "../../../src/initiative-templates/_internal/computeProps";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeTemplateDefaultFeatures } from "../../../src/initiative-templates/_internal/InitiativeTemplateBusinessRules";
import * as computeLinksModule from "../../../src/initiative-templates/_internal/computeLinks";
import { IModel } from "../../../src/hub-types";
import { IHubInitiativeTemplate } from "../../../src/core/types/IHubInitiativeTemplate";

describe("initiative templates: computeProps:", () => {
  let authdCtxMgr: any;
  let model: IModel;
  let initiativeTemplate: Partial<IHubInitiativeTemplate>;

  beforeEach(() => {
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
    authdCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
          privileges: ["portal:user:createItem"],
        } as unknown as IUser,
        portal: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
          properties: { hub: { enabled: true } },
        } as unknown as IPortal,
        portalUrl: "https://org.maps.arcgis.com",
      }),
    };
  });
  describe("features:", () => {
    let spy: any;
    beforeEach(() => {
      spy = vi
        .spyOn(processEntitiesModule as any, "processEntityFeatures")
        .mockReturnValue({ details: true, settings: false });
    });
    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toEqual(InitiativeTemplateDefaultFeatures);
      vi.restoreAllMocks();
    });
    it("handles missing settings hash", () => {
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("passes features hash", () => {
      model.data = { settings: { features: { details: true } } } as any;
      const chk = computeProps(
        model,
        initiativeTemplate,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({ details: true });
    });

    it("generates a links hash", () => {
      const computeLinksSpy = vi
        .spyOn(computeLinksModule as any, "computeLinks")
        .mockReturnValue({ self: "some-link" } as any);
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
