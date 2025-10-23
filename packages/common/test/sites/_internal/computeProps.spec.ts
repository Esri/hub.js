import { MOCK_HUB_REQOPTS } from "../../mocks/mock-auth";
import { vi } from "vitest";
import { computeProps } from "../../../src/sites/_internal/computeProps";
import { SiteDefaultFeatures } from "../../../src/sites/_internal/SiteBusinessRules";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import * as computeLinksModule from "../../../src/sites/_internal/computeLinks";
import { IHubRequestOptions, IModel } from "../../../src/hub-types";
import { cloneObject } from "../../../src/util";
import { IHubSite } from "../../../src/core/types/IHubSite";

describe("sites: computeProps:", () => {
  let requestOptions: IHubRequestOptions;
  let computeLinksSpy: any;

  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
    computeLinksSpy = vi
      .spyOn(computeLinksModule, "computeLinks")
      .mockReturnValue({ self: "some-link" } as any);
  });
  describe("features:", () => {
    let spy: any;
    beforeEach(() => {
      spy = vi
        .spyOn(processEntitiesModule, "processEntityFeatures")
        .mockReturnValue({ details: true, settings: false } as any);
    });
    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toEqual(SiteDefaultFeatures);
    });
    it("handles missing settings hash", () => {
      const model: IModel = {
        item: {
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {},
      } as IModel;
      const init: Partial<IHubSite> = {};
      const chk = computeProps(model, init, requestOptions);
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Site Application",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {},
        },
      } as unknown as IModel;
      const init: Partial<IHubSite> = {};
      const chk = computeProps(model, init, requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("passes features hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Site Application",
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
      const init: Partial<IHubSite> = {};
      const chk = computeProps(model, init, requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({ details: true });
    });
  });
  it("generates a links hash", () => {
    const model: IModel = {
      item: {
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as IModel;
    const init: Partial<IHubSite> = { id: "9001" };
    const chk = computeProps(model, init, requestOptions);

    expect(computeLinksSpy).toHaveBeenCalledTimes(1);
    expect(chk.links).toEqual({ self: "some-link" });
  });
  it("sets isCatalogV1Enabled to true when legacy catalog is present", () => {
    const model: IModel = {
      item: {
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {
        catalog: {
          groups: ["1", "2"],
        },
      },
    } as unknown as IModel;
    const init: Partial<IHubSite> = { id: "9001" };
    const chk = computeProps(model, init, requestOptions);
    expect(chk.isCatalogV1Enabled).toBe(true);
  });
  it("sets isCatalogV1Enabled to false when legacy catalog is absent", () => {
    const model: IModel = {
      item: {
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {
        catalogV2: {
          collections: [],
        },
      },
    } as unknown as IModel;
    const init: Partial<IHubSite> = { id: "9001" };
    const chk = computeProps(model, init, requestOptions);
    expect(chk.isCatalogV1Enabled).toBe(false);
  });
  it("downgrades assistant access when more permissive than site", () => {
    const model: IModel = {
      item: {
        id: "abc",
        type: "Hub Site Application",
        access: "private",
        created: Date.now(),
        modified: Date.now(),
      } as any,
      data: {},
    } as unknown as IModel;

    const init: Partial<IHubSite> = {
      id: "abc",
      access: "org",
      assistant: { access: "public" } as any,
    };

    const chk = computeProps(model, init, requestOptions);
    expect(chk.assistant.access).toBe("private");
  });
  it("does not downgrade assistant access when it is less permissive than site", () => {
    const model: IModel = {
      item: {
        id: "xyz",
        type: "Hub Site Application",
        access: "public",
        created: Date.now(),
        modified: Date.now(),
      } as any,
      data: {},
    } as unknown as IModel;

    const init: Partial<IHubSite> = {
      id: "xyz",
      access: "public",
      assistant: { access: "org" } as any,
    };

    const chk = computeProps(model, init, requestOptions);
    expect(chk.assistant.access).toBe("org");
  });
});
