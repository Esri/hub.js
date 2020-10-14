import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-portal";
import { IEnvelope } from "@esri/arcgis-rest-types";
import { IHubRequestOptions, cloneObject, IHubContent } from "@esri/hub-common";
import * as commonModule from "@esri/hub-common";
import {
  getContentFromPortal,
  itemToContent,
  parseItemCategories,
  getItemHubType
} from "../src/index";
import * as metadataModule from "../src/metadata";
import * as itemJson from "./mocks/items/map-service.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

function validateContentFromPortal(content: IHubContent, item: IItem) {
  // should include all item properties
  Object.keys(item).forEach(key => {
    // we check name below
    if (key === "name") {
      return;
    }
    expect(content[key]).toEqual(item[key]);
  });
  // name should be title
  expect(content.name).toBe(item.title);
  // should include derived properties
  expect(content.hubId).toBe(item.id);
  expect(content.hubType).toBe("map");
  expect(content.summary).toBe(item.snippet);
  expect(content.publisher).toEqual({
    name: item.owner,
    username: item.owner
  });
  expect(content.permissions.visibility).toBe(item.access);
  // no itemControl returned w/ this item, expect default
  expect(content.permissions.control).toBe("view");
  // this item has no properties
  expect(content.actionLinks).toBeNull();
  expect(content.hubActions).toBeNull();
  expect(content.metrics).toBeNull();
  const geometry: IEnvelope = {
    xmin: -2.732,
    ymin: 53.4452,
    xmax: -2.4139,
    ymax: 53.6093,
    spatialReference: {
      wkid: 4326
    }
  };
  expect(content.boundary).toEqual({ geometry });
  expect(content.license).toEqual({
    name: "Custom License",
    description: item.accessInformation
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
}

describe("item to content", () => {
  let item: IItem;
  beforeEach(() => {
    item = cloneObject(itemJson) as IItem;
  });
  it("gets summary from description when no snippet", () => {
    item.snippet = null;
    const content = itemToContent(item);
    expect(content.summary).toBe(item.description);
  });
  it("gets permissions.control from itemControl when it exists", () => {
    item.itemControl = "update";
    const content = itemToContent(item);
    expect(content.permissions.control).toBe(item.itemControl);
  });
  it("attaches normalizedItemType", () => {
    spyOn(commonModule, "normalizeItemType").and.returnValue("Normalized Type");
    const content = itemToContent(item);
    expect(content.normalizedType).toBe("Normalized Type");
  });
  describe("when item has properties", () => {
    it("should set actionLinks to links", () => {
      item.properties = {
        links: [{ url: "https://foo.com" }]
      };
      const content = itemToContent(item);
      expect(content.actionLinks).toEqual(item.properties.links);
    });
  });
  // NOTE: other use cases (including when a portal is passed)
  // are covered by getContentFromPortal() tests
});
describe("get item hub type", () => {
  it("normalizes item", () => {
    expect(
      getItemHubType({
        type: "Hub Initiative",
        typeKeywords: ["hubInitiativeTemplate"]
      } as IItem)
    ).toBe("template");
  });
  it("works with just type", () => {
    expect(getItemHubType("Form")).toBe("feedback");
  });
});
describe("parse item categories", () => {
  it("parses the categories", () => {
    const categories = [
      "/Categories/Boundaries",
      "/Categories/Planning and cadastre/Property records",
      "/Categories/Structure"
    ];
    expect(parseItemCategories(categories)).toEqual([
      "Boundaries",
      "Planning and cadastre",
      "Property records",
      "Structure"
    ]);
  });
  it("doesn't blow up with undefined", () => {
    expect(() => parseItemCategories(undefined)).not.toThrow();
  });
});
describe("get content from portal", () => {
  // emulate the get groups response
  const mockItemGroups: any = {
    admin: [],
    member: [{ id: "memberGroupId" }],
    other: []
  };
  let getItemGroupsSpy: jasmine.Spy;
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    requestOpts = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal"
      },
      isPortal: true,
      hubApiUrl: "https://some.url.com/",
      authentication: mockUserSession
    };
  });
  afterEach(fetchMock.restore);
  it("should fetch a portal item and return content w/o metadata", done => {
    fetchMock.once("*", itemJson);
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
    const item = itemJson as IItem;
    const id = item.id;
    getContentFromPortal(id, requestOpts).then(content => {
      // verify that we attempted to fetch from the portal API
      const [url] = fetchMock.calls()[0];
      expect(url).toBe(
        "https://vader.maps.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json&token=fake-token"
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
  it("should fetch a portal item and return content w/ metadata", done => {
    fetchMock.once("*", itemJson);
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
    const item = itemJson as IItem;
    const id = item.id;
    getContentFromPortal(id, requestOpts).then(content => {
      // verify that we attempted to fetch from the portal API
      const [url] = fetchMock.calls()[0];
      expect(url).toBe(
        "https://vader.maps.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json&token=fake-token"
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
});
