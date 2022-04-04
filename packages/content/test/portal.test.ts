import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IHubContent, isBBox } from "@esri/hub-common";
import { getContentFromPortal } from "../src/portal";
import * as metadataModule from "../src/metadata";
import * as documentItem from "./mocks/items/document.json";
import * as singleLayerFeatureServiceItem from "./mocks/items/single-layer-feature-service.json";
import * as singleLayerFeatureServiceDataset from "./mocks/datasets/single-layer-feature-service.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

function validateContentFromPortal(content: IHubContent, item: IItem) {
  // should include all item properties
  Object.keys(item).forEach((key) => {
    // we check name  and extent below
    if (["name", "extent"].includes(key)) {
      return;
    }
    const contentValue = content[key];
    const itemValue = item[key];
    expect(contentValue).toEqual(itemValue);
  });
  // name should be title
  expect(content.name).toBe(item.title);
  // extent will be undefined if item extent is invalid bbox
  isBBox(item.extent)
    ? expect(content.extent).toEqual(item.extent)
    : expect(content.extent).toBeUndefined();
  // should not set hubId when in portal
  expect(content.hubId).toBeUndefined();
  // should include derived properties
  expect(content.family).toBe("document");
  // DEPRECATED: remove hubType check at next breaking change
  expect(content.hubType).toBe("document");
  expect(content.summary).toBe(item.snippet);
  expect(content.publisher).toEqual({
    name: item.owner,
    username: item.owner,
  });
  expect(content.permissions.visibility).toBe(item.access);
  // no itemControl returned w/ this item, expect default
  expect(content.permissions.control).toBe("view");
  // this item has no properties
  expect(content.actionLinks).toBeNull();
  expect(content.hubActions).toBeNull();
  expect(content.metrics).toBeNull();
  expect(content.license).toEqual({
    name: "Custom License",
    description: item.accessInformation,
  });
  const createdDate = new Date(item.created);
  expect(content.createdDate).toEqual(createdDate);
  expect(content.createdDateSource).toEqual("item.created");
  expect(content.publishedDate).toEqual(createdDate);
  expect(content.publishedDateSource).toEqual("item.created");
  expect(content.updatedDate).toEqual(new Date(item.modified));
  expect(content.updatedDateSource).toEqual("item.modified");
  expect(typeof content.portalHomeUrl).toBe("string");
  expect(typeof content.portalApiUrl).toBe("string");
  expect(typeof content.portalDataUrl).toBe("string");
  expect(typeof content.thumbnailUrl).toBe("string");
  expect(content.isDownloadable).toBe(true);
}

describe("hub-content:: get content from portal", () => {
  // emulate the get groups response
  const mockItemGroups: any = {
    admin: [],
    member: [{ id: "memberGroupId" }],
    other: [],
  };
  let getItemGroupsSpy: jasmine.Spy;
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    requestOpts = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal",
      },
      isPortal: true,
      hubApiUrl: "https://some.url.com/",
      authentication: mockUserSession,
    };
  });
  afterEach(fetchMock.restore);

  // This was due to re-building package-lock.json, which picked up a big jump
  // in jasmine core (3.4.0 to 3.99.0) Forcing jasmine-core to stay at 3.4.0 resolved the issue
  // Issue to resolve this -> https://github.com/Esri/hub.js/issues/742
  it("should fetch a portal item and return content w/o metadata", (done) => {
    fetchMock.once("*", documentItem);
    // emulate successful item groups response
    getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups").and.returnValue(
      Promise.resolve(mockItemGroups)
    );
    // emulate no metadata exists for this item
    const message = "Fake Error throw in getContentMetadata";
    const getContentMetadataSpy = spyOn(
      metadataModule,
      "getContentMetadata"
    ).and.returnValue(Promise.reject(message));
    const item = documentItem as IItem;
    const id = item.id;

    return getContentFromPortal(id, requestOpts)
      .then((content) => {
        // verify that we attempted to fetch from the portal API
        // TODO: mock getItem and related calls instead of fetchMock
        const [url] = fetchMock.calls()[0];
        expect(url).toBe(
          "https://vader.maps.arcgis.com/sharing/rest/content/items/8d37647291dd42deab032cfb1b57509c?f=json&token=fake-token"
        );
        // validate that the item properties were set
        validateContentFromPortal(content, item);
        // verify that we successfully fetch the groupIds
        expect(getItemGroupsSpy.calls.argsFor(0)[0]).toBe(id);
        expect(content.groupIds).toEqual(["memberGroupId"]);
        // verify that we failed to fetch the metadata
        expect(getContentMetadataSpy.calls.argsFor(0)[0]).toBe(id);
        expect(content.errors).toEqual([{ type: "Other", message }]);
        done();
      })
      .catch((ex) => {
        throw ex;
      });
  });
  it("should fetch a portal item and return content w/ metadata", (done) => {
    fetchMock.once("*", documentItem);
    // emulate successful item groups response
    getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups").and.returnValue(
      Promise.resolve(mockItemGroups)
    );
    // emulate that metadata exists for this item
    const mockMetadata = { Esri: { CreaDate: 20200305 } };
    const getContentMetadataSpy = spyOn(
      metadataModule,
      "getContentMetadata"
    ).and.returnValue(Promise.resolve(mockMetadata));
    const item = documentItem as IItem;
    const id = item.id;
    getContentFromPortal(id, requestOpts).then((content) => {
      // verify that we attempted to fetch from the portal API
      const [url] = fetchMock.calls()[0];
      expect(url).toBe(
        "https://vader.maps.arcgis.com/sharing/rest/content/items/8d37647291dd42deab032cfb1b57509c?f=json&token=fake-token"
      );
      // validate that the item properties were set
      validateContentFromPortal(content, item);
      // verify that we successfully fetch the groupIds
      expect(getItemGroupsSpy.calls.argsFor(0)[0]).toBe(id);
      expect(content.groupIds).toEqual(["memberGroupId"]);
      // verify that we successfully fetched the metadata
      expect(getContentMetadataSpy.calls.argsFor(0)[0]).toBe(id);
      expect(content.metadata).toEqual(mockMetadata);
      expect(content.errors).toEqual([]);
      done();
    });
  });
  it("should use item object if passed as arg", (done) => {
    fetchMock.once("*", documentItem);
    // emulate successful item groups response
    getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups").and.returnValue(
      Promise.resolve(mockItemGroups)
    );
    // emulate that metadata exists for this item
    const mockMetadata = { Esri: { CreaDate: 20200305 } };
    const getContentMetadataSpy = spyOn(
      metadataModule,
      "getContentMetadata"
    ).and.returnValue(Promise.resolve(mockMetadata));
    const item = documentItem as IItem;

    // pass item object as arg
    getContentFromPortal(item, requestOpts).then((content) => {
      // *************** make sure we did NOT fetch item from API******************
      expect(fetchMock.called()).toBeFalsy(
        "item should not be fetched from API"
      );

      // *************** make sure everything else looks good *********************
      // validate that the item properties were set
      validateContentFromPortal(content, item);
      // verify that we successfully fetch the groupIds
      expect(getItemGroupsSpy.calls.argsFor(0)[0]).toBe(item.id);
      expect(content.groupIds).toEqual(["memberGroupId"]);
      // verify that we successfully fetched the metadata
      expect(getContentMetadataSpy.calls.argsFor(0)[0]).toBe(item.id);
      expect(content.metadata).toEqual(mockMetadata);
      expect(content.errors).toEqual([]);
      done();
    });
  });
  it("should fetch and enrich item as a layer if passed a hubId", (done) => {
    // we'll make these requests w/ portal and no auth, for giggles
    requestOpts.portal = "https://portal.example.com/sharing/rest";
    delete requestOpts.authentication;

    // set up mocks using the dataset attributes as mock responses
    const item = singleLayerFeatureServiceItem as IItem;
    const dataset = singleLayerFeatureServiceDataset.data;
    const { server, layers, groupIds, metadata } = dataset.attributes;
    fetchMock.once(
      `${requestOpts.portal}/content/items/${item.id}?f=json`,
      item
    );
    fetchMock.once(item.url, server);
    fetchMock.once(`${item.url}/layers`, { layers, tables: [] });

    // TODO: replace these stubs w/ fetchMock calls
    // emulate successful item groups response
    getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups").and.returnValue(
      Promise.resolve({
        admin: [],
        member: groupIds.map((id) => ({ id })),
        other: [],
      })
    );
    // emulate that metadata exists for this item
    const mockMetadata = metadata;
    const getContentMetadataSpy = spyOn(
      metadataModule,
      "getContentMetadata"
    ).and.returnValue(Promise.resolve(mockMetadata));

    // pass dataset id
    getContentFromPortal(dataset.id, requestOpts).then((content) => {
      expect(content.item).toEqual(item, "set item");
      // since we are in portal we should not expect a hubId to be set
      // expect(content.hubId).toBe(dataset.id, "set hubId");
      // validate that layer and associated properties were set
      expect(content.layer).toEqual(layers[0] as unknown, "set content layer");
      expect(content.type).toBe("Feature Layer", "updated type");
      expect(content.family).toBe("dataset", "updated family");
      // verify that we successfully fetched the groupIds
      expect(getItemGroupsSpy.calls.argsFor(0)[0]).toBe(
        item.id,
        "gets groups by item id"
      );
      // verify that we successfully fetched the metadata
      expect(getContentMetadataSpy.calls.argsFor(0)[0]).toBe(
        item.id,
        "gets metadata by item id"
      );
      done();
    });
  });
});
