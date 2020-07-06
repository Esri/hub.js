import { _removeSiteFromIndex } from "../src";
import * as fetchMock from "fetch-mock";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("_removeSiteFromIndex", () => {
  it("it removes the site from the index", async () => {
    const ro = {
      hubApiUrl: "foobar",
      authentication: {
        token: "token"
      }
    } as IHubRequestOptions;

    const siteModel = {
      item: {
        id: "baz"
      }
    } as IModel;

    fetchMock.delete(`${ro.hubApiUrl}/v2/${siteModel.item.id}`, {});

    await _removeSiteFromIndex(siteModel, ro);

    expect(fetchMock.done()).toBeTruthy("fetch mock called as expected");
    expect(fetchMock.calls()[0][1].headers).toEqual(
      { Authorization: "token" },
      "auth attached"
    );
  });

  it("it rejects if fetch errors", async () => {
    const ro = {
      hubApiUrl: "foobar",
      authentication: {
        token: "token"
      }
    } as IHubRequestOptions;

    const siteModel = {
      item: {
        id: "baz"
      }
    } as IModel;

    fetchMock.delete(`${ro.hubApiUrl}/v2/${siteModel.item.id}`, 400);

    try {
      await _removeSiteFromIndex(siteModel, ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }

    expect(fetchMock.done()).toBeTruthy("fetch mock called as expected");
  });

  it("it does nothing on portal", async () => {
    const ro = {
      isPortal: true,
      hubApiUrl: "foobar",
      authentication: {
        token: "token"
      }
    } as IHubRequestOptions;

    const siteModel = {
      item: {
        id: "baz"
      }
    } as IModel;

    fetchMock.delete(`${ro.hubApiUrl}/v2/${siteModel.item.id}`, {});

    await _removeSiteFromIndex(siteModel, ro);

    expect(fetchMock.calls().length).toBe(0, "fetch not called");
  });
});
