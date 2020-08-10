import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { IEnvelope } from "@esri/arcgis-rest-types";
import { IHubRequestOptions, cloneObject } from "@esri/hub-common";
import {
  getContentFromPortal,
  itemToContent,
  getItemHubType
} from "../src/index";
import * as itemJson from "./mocks/items/map-service.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

describe("item to content", () => {
  let item: IItem;
  beforeEach(() => {
    item = cloneObject(itemJson) as IItem;
  });
  it("doesn't set URLs w/o portal", () => {
    const content = itemToContent(item);
    expect(content.itemHomeUrl).toBeUndefined();
    expect(content.itemDataUrl).toBeUndefined();
    expect(content.thumbnailUrl).toBeUndefined();
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
  // NOTE: case where an item is passed an item is covered by getContentFromPortal() tests
  it("handles item type as string", () => {
    expect(getItemHubType("Feature Layer")).toBe("dataset");
  });
});
describe("get content from portal", () => {
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
  it("should fetch a portal item and return content", done => {
    fetchMock.once("*", itemJson);
    const item = itemJson as IItem;
    const id = item.id;
    getContentFromPortal(id, requestOpts).then(content => {
      // verify that we attempted to fetch from the portal API
      const [url] = fetchMock.calls()[0];
      expect(url).toBe(
        "https://vader.maps.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json&token=fake-token"
      );
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
      expect(content.hubId).toBe(id);
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
      expect(typeof content.itemHomeUrl).toBe("string");
      // expect(typeof content.itemDataUrl).toBe('string')
      expect(typeof content.thumbnailUrl).toBe("string");
      done();
    });
  });
});
