import * as fetchMock from "fetch-mock";
import {
  DatasetResource,
  parseDatasetId,
  datasetToItem,
  getContentFromHub,
  datasetToContent
} from "../src/index";
import { IHubRequestOptions, cloneObject, IHubContent } from "@esri/hub-common";
import * as documentsJson from "./mocks/datasets/document.json";
import * as featureLayerJson from "./mocks/datasets/feature-layer.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

function validateContentFromDataset(
  content: IHubContent,
  dataset: DatasetResource,
  expectedHubType: string
) {
  const { id, attributes } = dataset;
  // should have copied these attributes directly
  const itemProperties = [
    "owner",
    "orgId",
    "created",
    "modified",
    // NOTE: name is handled below
    "type",
    "typeKeywords",
    "description",
    "snippet",
    "tags",
    "thumbnail",
    "categories",
    "licenseInfo",
    "culture",
    "url",
    "access",
    "size",
    "commentsEnabled"
    // TODO: what about the others that will be undefined?
  ];
  // should have set item properties
  itemProperties.forEach(key => {
    expect(content[key]).toEqual(attributes[key]);
  });
  // we use attributes.name for both name and title
  expect(content.title).toBe(attributes.name);
  expect(content.name).toBe(attributes.name);
  // should include derived properties
  expect(content.hubId).toBe(id);
  expect(content.spatialReference).toEqual(attributes.serviceSpatialReference);
  const extent = attributes.extent;
  expect(content.extent).toEqual(extent && extent.coordinates);
  expect(content.hubType).toBe(expectedHubType);
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
  // NOTE: we could lazily fetch the item to get properties
  // based on the fact that these are undefined (instead of null)
  expect(content.actionLinks).toBeUndefined();
  expect(content.hubActions).toBeUndefined();
  expect(content.metrics).toBeUndefined();
  expect(content.orgId).toBe(attributes.orgId);
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
}

describe("hub", () => {
  describe("parseDatasetId", function() {
    it("returns undefined", () => {
      const result = parseDatasetId(undefined);
      expect(result).toEqual({ itemId: undefined, layerId: undefined });
    });
    it("parse item id", () => {
      const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb");
      expect(result).toEqual({
        itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
        layerId: undefined
      });
    });
    it("parse item id and layer id", () => {
      const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb_0");
      expect(result).toEqual({
        itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
        layerId: "0"
      });
    });
  });
  describe("dataset to item", () => {
    it("handles no dataset", () => {
      expect(datasetToItem(null)).toBeUndefined();
    });
    it("handles no dataset attributes", () => {
      expect(datasetToItem({ id: "foo", type: "dataset" })).toBeUndefined();
    });
    it("returns snippet when no searchDescription", () => {
      const dataset = cloneObject(documentsJson.data) as DatasetResource;
      delete dataset.attributes.searchDescription;
      const item = datasetToItem(dataset);
      expect(item.snippet).toBe(dataset.attributes.snippet);
    });
    it("falls back to createdAt/updatedAt when no created/modified", () => {
      const dataset = cloneObject(documentsJson.data) as DatasetResource;
      const attributes = dataset.attributes;
      attributes.createdAt = attributes.created;
      attributes.updatedAt = attributes.modified;
      delete attributes.created;
      delete attributes.modified;
      const item = datasetToItem(dataset);
      expect(item.created).toBe(attributes.createdAt);
      expect(item.modified).toBe(attributes.updatedAt);
    });
    // NOTE: other use cases are covered by getContent() tests
  });
  describe("dataset to content", () => {
    it("only uses enrichment attributes when they exist", () => {
      const dataset = cloneObject(documentsJson.data) as DatasetResource;
      delete dataset.attributes.searchDescription;
      delete dataset.attributes.modifiedProvenance;
      const content = datasetToContent(dataset);
      expect(content.summary).toBe(dataset.attributes.snippet);
      expect(content.updatedDateSource).toBe("item.modified");
      expect(content.extent).toBeUndefined();
    });
    // NOTE: other use cases are covered by getContent() tests
  });
  describe("get content from hub", () => {
    let requestOpts: IHubRequestOptions;
    beforeEach(() => {
      requestOpts = {
        portalSelf: {
          user: {},
          id: "123",
          isPortal: false,
          name: "some-portal"
        },
        isPortal: false,
        hubApiUrl: "https://some.url.com/",
        authentication: mockUserSession
      };
    });
    afterEach(fetchMock.restore);
    it("should fetch a dataset record by id and return content", done => {
      fetchMock.once("*", featureLayerJson);
      const dataset = featureLayerJson.data as DatasetResource;
      const id = dataset.id;
      getContentFromHub(id, requestOpts).then(content => {
        // verify that we attempted to fetch from the portal API
        const [url, opts] = fetchMock.calls()[0];
        expect(url).toBe(`https://some.url.com/api/v3/datasets/${id}`);
        expect(opts.method).toBe("GET");
        validateContentFromDataset(content, dataset, "dataset");
        // TODO: content type specific properties
        // expect(content.recordCount).toBe(attributes.recordCount);
        done();
      });
    });
    it("should fetch a dataset record by slug and return content", done => {
      fetchMock.once("*", featureLayerJson);
      const dataset = featureLayerJson.data as DatasetResource;
      const slug = "Wigan::out-of-work-benefit-claims";
      getContentFromHub(slug, requestOpts).then(content => {
        // verify that we attempted to fetch from the portal API
        const [url, opts] = fetchMock.calls()[0];
        expect(url).toBe(
          `https://some.url.com/api/v3/datasets?${encodeURIComponent(
            "filter[slug]"
          )}=${encodeURIComponent(slug)}`
        );
        expect(opts.method).toBe("GET");
        validateContentFromDataset(content, dataset, "dataset");
        // TODO: content type specific properties
        // expect(content.recordCount).toBe(attributes.recordCount);
        done();
      });
    });
  });
});
