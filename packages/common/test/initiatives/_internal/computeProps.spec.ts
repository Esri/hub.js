import { vi } from "vitest";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { createMockContext } from "../../mocks/mock-auth";
import { computeProps } from "../../../src/initiatives/_internal/computeProps";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { InitiativeDefaultFeatures } from "../../../src/initiatives/_internal/InitiativeBusinessRules";
import * as computeLinksModule from "../../../src/initiatives/_internal/computeLinks";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";
import { IModel } from "../../../src/hub-types";

describe("initiatives: computeProps:", () => {
  let authdCtxMgr: any;
  let model: IModel;
  let initiative: Partial<IHubInitiative>;

  beforeEach(() => {
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
          properties: {
            hub: {
              enabled: true,
            },
          },
        } as unknown as IPortal,
        portalUrl: "https://org.maps.arcgis.com",
      }),
    };
  });

  describe("features:", () => {
    let spy: any;
    beforeEach(() => {
      spy = vi
        .spyOn(processEntitiesModule, "processEntityFeatures")
        .mockReturnValue({ details: true, settings: false });
    });
    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toEqual(InitiativeDefaultFeatures);
      vi.restoreAllMocks();
    });
    it("handles missing settings hash", () => {
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
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
      expect(spy.mock.calls[0][0]).toEqual({ details: true });
    });
    it("generates a links hash", () => {
      const computeLinksSpy = vi
        .spyOn(computeLinksModule, "computeLinks")
        .mockReturnValue({ self: "some-link" as any });
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
    it("does not generate featuredImageUrl when there is no data view", () => {
      model.data = {} as any;
      const chk = computeProps(
        model,
        initiative,
        authdCtxMgr.context.requestOptions
      );
      expect(chk.view?.featuredImageUrl).toBeFalsy();
    });
  });
});
