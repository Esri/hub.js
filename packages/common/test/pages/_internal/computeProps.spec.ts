import { MOCK_HUB_REQOPTS } from "../../mocks/mock-auth";
import { computeProps } from "../../../src/pages/_internal/computeProps";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { PageDefaultFeatures } from "../../../src/pages/_internal/PageBusinessRules";
import { IHubRequestOptions, IModel } from "../../../src/hub-types";
import { cloneObject } from "../../../src/util";
import { IHubPage } from "../../../src/core/types/IHubPage";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as thumbModule from "../../../src/resources/get-item-thumbnail-url";

describe("Pages: computeProps:", () => {
  let requestOptions: IHubRequestOptions;
  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
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
      expect(spy.mock.calls[0][1]).toEqual(PageDefaultFeatures);
    });
    it("handles missing settings hash", () => {
      const model: IModel = {
        item: {
          created: new Date().getTime(),
          modified: new Date().getTime(),
          type: "Hub Page",
        },
        data: {},
      } as IModel;
      const init: Partial<IHubPage> = {};
      const chk = computeProps(model, init, requestOptions);
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Page",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        },
        data: {
          settings: {},
        },
      } as unknown as IModel;
      const init: Partial<IHubPage> = {};
      const chk = computeProps(model, init, requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("passes features hash", () => {
      const model: IModel = {
        item: {
          id: "3ef",
          type: "Hub Page",
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
      const init: Partial<IHubPage> = {};
      const chk = computeProps(model, init, requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({ details: true });
    });
  });
  it("creates links", () => {
    const model: IModel = {
      item: {
        id: "3ef",
        type: "Hub Page",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as unknown as IModel;
    const init: Partial<IHubPage> = { id: "3ef" };
    const chk = computeProps(model, init, requestOptions);
    expect(chk.links.siteRelative).toBe("/pages/3ef");
    expect(chk.links.layoutRelative).toBe("/pages/3ef/edit");
  });

  it("uses authentication token when present", () => {
    const model: IModel = {
      item: {
        id: "3ef",
        type: "Hub Page",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as unknown as IModel;
    const init: Partial<IHubPage> = { id: "3ef" };
    // inject a fake auth token
    requestOptions.authentication = { token: "FAKE_TOKEN" } as any;
    const spy = vi
      .spyOn(thumbModule, "getItemThumbnailUrl")
      .mockReturnValue("https://t.png");
    computeProps(model, init, requestOptions);
    expect(spy).toHaveBeenCalled();
    // ensure at least one call passed the token (it may be called twice via computeLinks)
    const anyCallHasToken = spy.mock.calls.some(
      (c: any[]) => c[2] === "FAKE_TOKEN"
    );
    expect(anyCallHasToken).toBe(true);
    spy.mockRestore();
  });

  it("works when authentication is missing", () => {
    const model: IModel = {
      item: {
        id: "3ef",
        type: "Hub Page",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as unknown as IModel;
    const init: Partial<IHubPage> = { id: "3ef" };
    // remove authentication
    // clone the default and delete authentication to avoid mutating shared mock
    requestOptions = { ...requestOptions } as any;
    delete (requestOptions as any).authentication;

    const spy = vi
      .spyOn(thumbModule, "getItemThumbnailUrl")
      .mockReturnValue("https://t.png");
    const chk = computeProps(model, init, requestOptions as any);
    expect(chk.thumbnailUrl).toBe("https://t.png");
    // ensure spy was called and no token argument was passed (undefined)
    const anyCallHasToken = spy.mock.calls.some(
      (c: any[]) => c[2] !== undefined
    );
    expect(anyCallHasToken).toBe(false);
    spy.mockRestore();
  });
});
