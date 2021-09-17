import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IHubContent } from "@esri/hub-common";
import { getContentFromPortal } from "../src/portal";
import * as metadataModule from "../src/metadata";
import * as documentItem from "./mocks/items/document.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

function validateContentFromPortal(content: IHubContent, item: IItem) {
  // should include all item properties
  Object.keys(item).forEach((key) => {
    // we check name below
    if (key === "name") {
      return;
    }
    expect(content[key]).toEqual(item[key]);
  });
  // name should be title
  expect(content.name).toBe(item.title);
  // should not set hubId when in portal
  expect(content.hubId).toBeUndefined();
  // should include derived properties
  expect(content.family).toBe("document");
  // DEPRECATED: remove hubType check
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

describe("get content from portal", () => {
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
  it("should fetch a portal item and return content w/o metadata", (done) => {
    fetchMock.once("*", documentItem);
    // emulate successful item groups response
    getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups").and.returnValue(
      Promise.resolve(mockItemGroups)
    );
    // emulate no metadata exists for this item
    const message = "Some error";
    const getContentMetadataSpy = spyOn(
      metadataModule,
      "getContentMetadata"
    ).and.returnValue(Promise.reject(message));
    const item = documentItem as IItem;
    const id = item.id;
    getContentFromPortal(id, requestOpts).then((content) => {
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
});
