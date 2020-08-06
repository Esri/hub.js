import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { IEnvelope } from "@esri/arcgis-rest-types";
import { IHubRequestOptions, cloneObject } from "@esri/hub-common";
import {
  DatasetResource,
  comingSoon,
  getContent,
  itemToContent,
  datasetToItem,
  getItemHubType
} from "../src/index";
import * as itemJson from "./mocks/item.json";
import * as datasetJson from "./mocks/dataset.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

describe("dataset to item", () => {
  it("handles no dataset", () => {
    expect(datasetToItem(null)).toBeUndefined();
  });
  it("handles no dataset attributes", () => {
    expect(datasetToItem({ id: "foo", type: "dataset" })).toBeUndefined();
  });
  it("returns snippet when no searchDescription", () => {
    const dataset = cloneObject(datasetJson.data) as DatasetResource;
    delete dataset.attributes.searchDescription;
    const item = datasetToItem(dataset);
    expect(item.snippet).toBe(dataset.attributes.snippet);
  });
  // NOTE: other use cases are covered by getContent() tests
});
describe("item to content", () => {
  let item: IItem;
  beforeEach(() => {
    item = cloneObject(itemJson) as IItem;
  });
  it("doesn't set thumbnailUrl w/o portal", () => {
    const content = itemToContent(item);
    expect(content.thumbnailUrl).toBeUndefined();
  });
  it("gets name from name when no title", () => {
    item.title = null;
    item.name = "name";
    const content = itemToContent(item);
    expect(content.name).toBe(item.name);
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
  // are covered by getContent() tests
});
describe("get item hub type", () => {
  // NOTE: case where an item is passed an item is covered by getContent() tests
  it("handles item type as string", () => {
    expect(getItemHubType("Feature Layer")).toBe("dataset");
  });
});
describe("get content", () => {
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
  describe("from hub", () => {
    it("should fetch a dataset record and return content", done => {
      requestOpts.isPortal = false;
      requestOpts.portalSelf.isPortal = false;
      fetchMock.once("*", datasetJson);
      const dataset = datasetJson.data as DatasetResource;
      const { id, attributes } = dataset;
      getContent(id, requestOpts).then(content => {
        // verify that we attempted to fetch from the portal API
        const [url] = fetchMock.calls()[0];
        expect(url).toBe(
          "https://some.url.com/datasets/7a153563b0c74f7eb2b3eae8a66f2fbb_0"
        );
        // should have copied these attributes directly
        const attributeKeys = [
          "name",
          "owner",
          "orgId",
          "created",
          "modified",
          "type",
          "typeKeywords",
          "description",
          "tags",
          "thumbnail",
          "categories",
          "licenseInfo",
          "culture",
          "url",
          "access",
          "size",
          "commentsEnabled"
          // TODO: others?
        ];
        attributeKeys.forEach(key => {
          expect(content[key]).toEqual(attributes[key]);
        });
        // should include derived properties
        expect(content.spatialReference).toEqual(
          attributes.server.spatialReference
        );
        expect(content.extent).toEqual(attributes.extent.coordinates);
        expect(content.hubType).toBe("dataset");
        expect(content.summary).toBe(
          attributes.searchDescription || attributes.snippet
        );
        expect(content.publisher).toEqual({
          name: attributes.owner,
          username: attributes.owner
        });
        expect(content.permissions.visibility).toBe(attributes.access);
        // no itemControl returned w/ this item, expect default
        expect(content.permissions.control).toBe("view");
        // I don't think we index these in the Hub API yet
        // NOTE: we could lazily fetch the item to get properties
        // based on the fact that these are undefined (instead of null)
        expect(content.actionLinks).toBeUndefined();
        expect(content.hubActions).toBeUndefined();
        expect(content.metrics).toBeUndefined();
        expect(content.boundary).toEqual(attributes.boundary);
        expect(content.license).toEqual({
          name: "Custom License",
          description: attributes.accessInformation
        });
        const createdDate = new Date(attributes.created);
        expect(content.createdDate).toEqual(createdDate);
        expect(content.createdDateSource).toEqual("item.created");
        expect(content.publishedDate).toEqual(createdDate);
        expect(content.publishedDateSource).toEqual("item.created");
        expect(content.updatedDate).toEqual(new Date(attributes.modified));
        expect(content.updatedDateSource).toEqual("item.modified");
        expect(typeof content.thumbnailUrl).toBe("string");
        // TODO: content type specific properties
        // expect(content.recordCount).toBe(attributes.recordCount);
        done();
      });
    });
  });
  describe("from portal", () => {
    it("should fetch a portal item and return content", done => {
      fetchMock.once("*", itemJson);
      const item = itemJson as IItem;
      const id = item.id;
      getContent(id, requestOpts).then(content => {
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
        // should include derived properties
        // in this case, it's not a file type, so name should be title
        expect(content.name).toBe(item.title);
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
        expect(typeof content.thumbnailUrl).toBe("string");
        done();
      });
    });
  });
});

// TODO: remove this next major release
describe("what's currently here, which aint much", () => {
  afterEach(fetchMock.restore);
  it("should make an item request w/o fetching data", done => {
    fetchMock.once("*", { the: "goods" });
    comingSoon()
      .then(response => {
        const [url, options] = fetchMock.calls()[0];
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("f=json");
        expect(response.the).toEqual("goods");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
