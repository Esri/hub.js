import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { DatasetResource, IHubRequestOptions } from "../../src";
import {
  fetchHubEnrichmentsById,
  fetchHubEnrichmentsBySlug,
  getContentEnrichments,
} from "../../src/content/_fetch";
import * as documentItem from "../mocks/items/document.json";
import * as featureServiceItem from "../mocks/items/feature-service-item.json";

describe("_fetch", () => {
  describe("getContentEnrichments", () => {
    it("should return defaults for items that are not maps, services, or templates, etc", () => {
      const result = getContentEnrichments(documentItem);
      expect(result).toEqual(["groupIds", "metadata", "ownerUser", "org"]);
    });
    it("should include data based on type", () => {
      const result = getContentEnrichments({ type: "Web Map" } as IItem);
      expect(result).toEqual([
        "groupIds",
        "metadata",
        "ownerUser",
        "org",
        "data",
      ]);
    });
    it("should include data based on family", () => {
      const result = getContentEnrichments({
        type: "Hub Initiative Template",
      } as IItem);
      expect(result).toEqual([
        "groupIds",
        "metadata",
        "ownerUser",
        "org",
        "data",
      ]);
    });
    it("should include server and layers for services", () => {
      const result = getContentEnrichments(featureServiceItem);
      expect(result).toEqual([
        "groupIds",
        "metadata",
        "ownerUser",
        "org",
        "data",
        "server",
        "layers",
      ]);
    });
  });
  describe("fetching enrichments from the Hub API", () => {
    const portal = "https://fake.arcgis.com/sharing/rest";
    const hubApiUrl = "https://hubfake.arcgis.com";
    const { id } = documentItem;
    const slug = `qa-pre-hub::pdf-item`;
    // the expected dataset response for the above item
    // see: https://hubqa.arcgis.com/api/v3/datasets?filter%5Bslug%5D=qa-pre-hub%3A%3Apdf-item&fields[datasets]=slug,boundary,statistics
    const dataset = {
      id,
      type: "dataset",
      attributes: {
        errors: [],
        slug,
        boundary: null,
      },
    } as DatasetResource;
    // expected dataset fields to be fetched from the Hub API
    const datasetFields =
      "slug,boundary,extent,recordCount,searchDescription,statistics";
    let requestOpts: IHubRequestOptions;
    beforeEach(() => {
      requestOpts = {
        portal,
        isPortal: false,
        hubApiUrl,
        // authentication: mockUserSession,
      };
    });
    describe("by slug", () => {
      it("should call the hub API with a slug filter and specific fields", async () => {
        // `${hubApiUrl}/api/v3/datasets?fields[datasets]=slug,boundary,statistics&filter[slug]=${slug}`
        fetchMock.mock(`begin:${hubApiUrl}/api/v3/datasets`, {
          data: [dataset],
        });
        const result = await fetchHubEnrichmentsBySlug(slug, requestOpts);
        // inspect the datasets request for the correct parameters
        const calls = fetchMock.calls();
        const [url] = calls[0];
        const { searchParams } = new URL(url);
        expect(calls.length).toBe(1);
        expect(searchParams.get("filter[slug]")).toEqual(slug);
        expect(searchParams.get("fields[datasets]")).toEqual(datasetFields);
        expect(result.itemId).toEqual(id);
        expect(result.layerId).toBeUndefined();
        expect(result.slug).toBe(slug);
        expect(result.boundary).toEqual(dataset.attributes.boundary);
        expect(result.statistics).toBeUndefined();
        expect(result.errors).toBeUndefined();
      });
    });
    describe("by id", () => {
      it("should handle errors", async () => {
        fetchMock.mock(`begin:${hubApiUrl}/api/v3/datasets/${id}`, 404);
        const result = await fetchHubEnrichmentsById(id, requestOpts);
        // inspect the datasets request for the correct parameters
        const calls = fetchMock.calls();
        const [url] = calls[0];
        expect(calls.length).toBe(1);
        expect(result).toEqual({
          errors: [{ type: "Other", message: "Not Found" }],
        });
      });
      it("should call the hub API with an id and specific fields", async () => {
        fetchMock.mock(`begin:${hubApiUrl}/api/v3/datasets/${id}`, {
          data: dataset,
        });
        const result = await fetchHubEnrichmentsById(id, requestOpts);
        // inspect the datasets request for the correct parameters
        const calls = fetchMock.calls();
        const [url] = calls[0];
        const { searchParams } = new URL(url);
        expect(calls.length).toBe(1);
        expect(searchParams.get("fields[datasets]")).toEqual(datasetFields);
        expect(result.itemId).toEqual(id);
        expect(result.layerId).toBeUndefined();
        expect(result.slug).toBe(slug);
        expect(result.boundary).toEqual(dataset.attributes.boundary);
        expect(result.statistics).toBeUndefined();
        expect(result.errors).toBeUndefined();
      });
      it("should return the layerId", async () => {
        const itemId = "4ef";
        const layerId = "0";
        const hubId = `${itemId}_${layerId}`;
        const statistics = {};
        const layerDataset = {
          id: hubId,
          type: "dataset",
          attributes: {
            errors: [],
            slug,
            boundary: null,
            statistics,
          },
        } as DatasetResource;
        fetchMock.mock(`begin:${hubApiUrl}/api/v3/datasets/${hubId}`, {
          data: layerDataset,
        });
        const result = await fetchHubEnrichmentsById(hubId, requestOpts);
        // inspect the datasets request for the correct parameters
        const calls = fetchMock.calls();
        const [url] = calls[0];
        const { searchParams } = new URL(url);
        expect(calls.length).toBe(1);
        expect(searchParams.get("fields[datasets]")).toEqual(datasetFields);
        expect(result.itemId).toBe(itemId);
        expect(result.layerId).toBe(0);
        expect(result.slug).toBe(slug);
        expect(result.boundary).toEqual(layerDataset.attributes.boundary);
        expect(result.statistics).toEqual(layerDataset.attributes.statistics);
        expect(result.errors).toBeUndefined();
      });
    });
  });
});
