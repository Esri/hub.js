import { MOCK_HUB_REQOPTS } from "../../mocks/mock-auth";
import { computeProps } from "../../../src/sites/_internal/computeProps";
import {
  cloneObject,
  IHubRequestOptions,
  IHubSite,
  IModel,
} from "../../../src";
import { SiteDefaultFeatures } from "../../../src/sites/_internal/SiteBusinessRules";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import * as computeLinksModule from "../../../src/sites/_internal/computeLinks";

describe("sites: computeProps:", () => {
  let requestOptions: IHubRequestOptions;
  let computeLinksSpy: jasmine.Spy;

  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
    computeLinksSpy = spyOn(computeLinksModule, "computeLinks").and.returnValue(
      { self: "some-link" }
    );
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
      expect(spy.calls.argsFor(0)[1]).toEqual(SiteDefaultFeatures);
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
      expect(spy.calls.argsFor(0)[0]).toEqual({});
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
      expect(spy.calls.argsFor(0)[0]).toEqual({});
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
      expect(spy.calls.argsFor(0)[0]).toEqual({ details: true });
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
});
