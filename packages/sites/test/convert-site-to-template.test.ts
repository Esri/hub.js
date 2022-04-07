import { convertSiteToTemplate } from "../src";
import { cloneObject, deepSet } from "@esri/hub-common";
import {
  SITE_ITEM_RESPONSE,
  SITE_DATA_RESPONSE,
  SITE_RESOURCES_RESPONSE,
} from "./site-responses.test";
import { MOCK_HUB_REQOPTS } from "./test-helpers.test";
import * as fetchMock from "fetch-mock";

describe("convertSiteToTemplate", () => {
  it("it processes the item", async () => {
    // construct a model
    const model = {
      item: cloneObject(SITE_ITEM_RESPONSE),
      data: cloneObject(SITE_DATA_RESPONSE),
    };
    // make some changes so we can ensure some operations occur
    model.data.chkIdConvert = `this has the ${model.item.id} item id`;
    // setup the fetch mocks
    fetchMock.post(`glob:*/${SITE_ITEM_RESPONSE.id}/resources`, {
      status: 200,
      body: JSON.stringify(SITE_RESOURCES_RESPONSE),
    });

    const response = await convertSiteToTemplate(model, MOCK_HUB_REQOPTS);

    expect(fetchMock.called()).toBeTruthy("fetch should be intercepted");
    expect(response.itemId).toBe(
      model.item.id,
      "should hold the old item id on the template"
    );
    expect(Array.isArray(response.dependencies)).toBeTruthy(
      "should have dependencies array"
    );
    expect(response.type).toBe("Hub Site Application", "should add the type");
    expect(response.key).toBeTruthy("should add a key");
    expect(response.dependencies[0]).toBe(
      "192c341d37b04e35a017402491bec6ea",
      "should pull a dependency"
    );
    expect(SITE_RESOURCES_RESPONSE.total).toBe(
      10,
      "should have 10 resources from site"
    );
    expect(response.assets.length).toBe(9, "should ignore draft resources");
    expect(response.item.hasOwnProperty("url")).toBeFalsy(
      "item.url should be removed"
    );
    expect(
      response.item.properties.hasOwnProperty("collaborationGroupId")
    ).toBeFalsy("should remove collabGroupId");
    expect(response.data.catalog).toBeFalsy("should remove catalog");
    expect(response.data.chkIdConvert).toBe(
      "this has the {{appid}} item id",
      "header should be copied"
    );
  });

  it("tacks on primary basemaps extent (also handles no defaultExtent)", async () => {
    // construct a model
    const model = {
      item: cloneObject(SITE_ITEM_RESPONSE),
      data: cloneObject(SITE_DATA_RESPONSE),
    };

    delete model.data.values.defaultExtent;
    deepSet(model, "data.values.map.basemaps.primary.extent", {});

    // setup the fetch mocks
    fetchMock.post(`glob:*/${SITE_ITEM_RESPONSE.id}/resources`, {
      status: 200,
      body: JSON.stringify(SITE_RESOURCES_RESPONSE),
    });

    const response = await convertSiteToTemplate(model, MOCK_HUB_REQOPTS);

    expect(response.data.values.map.basemaps.primary.extent).toBe(
      "{{organization.defaultExtent}}"
    );
  });
});
