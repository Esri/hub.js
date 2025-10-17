import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
// mock external arcgis-rest modules so we can control network functions
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    getPortalUrl: (actual as any).getPortalUrl,
    getItem: vi.fn(),
    removeItem: vi.fn(),
  } as Partial<typeof import("@esri/arcgis-rest-portal")>;
});
vi.mock("@esri/arcgis-rest-feature-service", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    parseServiceUrl: (actual as any).parseServiceUrl,
    queryFeatures: vi.fn(),
    getLayer: vi.fn(),
  } as Partial<typeof import("@esri/arcgis-rest-feature-service")>;
});
import * as portalModule from "@esri/arcgis-rest-portal";
import * as featureLayerModule from "@esri/arcgis-rest-feature-service";
import * as _enrichmentsModule from "../../src/items/_enrichments";
import * as _fetchModule from "../../src/content/_fetch";
import * as documentItem from "../mocks/items/document.json";
import * as multiLayerFeatureServiceItem from "../mocks/items/multi-layer-feature-service.json";
import { IHubRequestOptions, IPolygonProperties } from "../../src/hub-types";
import {
  fetchContent,
  IFetchContentOptions,
} from "../../src/content/fetchContent";
import { cloneObject } from "../../src/util";
import { IItemEnrichments } from "../../src/core/types/IItemEnrichments";

// mock the item enrichments that would be returned for a multi-layer service
const getMultiLayerItemEnrichments =
  (): _enrichmentsModule.IItemAndEnrichments => {
    const layer = {
      id: 0,
      type: "Feature Layer" as "Feature Layer" | "Table", // casting needed by compiler
      name: "layer0 ",
    };
    const table = {
      id: 1,
      type: "Table" as "Feature Layer" | "Table", // casting needed by compiler
      name: "table1 ",
    };
    const item = multiLayerFeatureServiceItem as unknown as portalModule.IItem;
    return {
      item,
      groupIds: ["foo", "bar"],
      metadata: null as any,
      ownerUser: {
        username: item.owner,
      },
      server: {
        currentVersion: 10.71,
        serviceDescription: "For demo purposes only.",
      },
      layers: [layer, table],
    };
  };

describe("fetchContent", () => {
  beforeAll(() => {
    // nothing here; individual tests reset mocks in beforeEach
  });
  let portal: string;
  let hubApiUrl: string;
  let itemId: string;
  let shortSlug: string;
  let siteOrgKey: string;
  let slug: string;
  let hubEnrichments: _fetchModule.IDatasetEnrichments;
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    // reset mocks between tests to avoid cross-test call counts
    vi.resetAllMocks();
    // suppress deprecation warnings for each test
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // initialize the above above variables for the document item
    // in a non-enterprise environment
    portal = "https://fake.arcgis.com/sharing/rest";
    hubApiUrl = "https://hubfake.arcgis.com";
    itemId = documentItem.id;
    shortSlug = "pdf-item";
    siteOrgKey = "qa-pre-hub";
    slug = `${siteOrgKey}::${shortSlug}`;
    // the expected hub enrichments for the above item
    // see: https://hubqa.arcgis.com/api/v3/datasets?filter%5Bslug%5D=qa-pre-hub%3A%3Apdf-item&fields[datasets]=slug,boundary,statistics
    hubEnrichments = {
      itemId,
      layerId: undefined,
      slug,
      boundary: null as any,
    };
    requestOpts = {
      portal,
      isPortal: false,
      hubApiUrl,
    };
  });
  describe("by slug", () => {
    it("should fetch hub enrichments by slug then the item by id", async () => {
      // initialize the spies
      const fetchHubEnrichmentsSpy = vi
        .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
        .mockResolvedValue(hubEnrichments as any);
      const getItemSpy = portalModule.getItem as unknown as ReturnType<
        typeof vi.fn
      >;
      getItemSpy.mockResolvedValue(JSON.parse(JSON.stringify(documentItem)));
      const queryFeaturesSpy =
        featureLayerModule.queryFeatures as unknown as ReturnType<typeof vi.fn>;
      const options = {
        ...requestOpts,
        siteOrgKey,
        // this keeps us from having to mock the call to fetch item enrichments
        enrichments: [],
      } as IFetchContentOptions;
      const result = await fetchContent(shortSlug, options);
      // inspect the calls
      expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
      expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
      expect(queryFeaturesSpy).not.toHaveBeenCalled();
      // inspect the results (item may have extra properties like `url` added by compose)
      expect(result.item).toMatchObject(documentItem as any);
      expect(result.boundary).toEqual({
        geometry: null as any,
        provenance: undefined,
      });
      expect(result.statistics).toBeUndefined();
    });
    describe("with a specific layer", () => {
      let itemEnrichments: _enrichmentsModule.IItemAndEnrichments;
      beforeEach(() => {
        // initialize the above above variables for the multi-layer feature service item
        // see: https://hubqa.arcgis.com/api/v3/datasets/eda6e08848924887b00a67ca319ec1bf
        itemId = multiLayerFeatureServiceItem.id;
        shortSlug = "maryland-server-supports-export";
        siteOrgKey = "dc";
        slug = `${siteOrgKey}::${shortSlug}`;
        // the expected hub enrichments for the above item
        // see: https://hubqa.arcgis.com/api/v3/datasets?filter%5Bslug%5D=dc%3A%3Amaryland-server-supports-export&fields%5Bdatasets%5D=slug,boundary,recordCount,statistics
        hubEnrichments = {
          itemId,
          layerId: undefined,
          slug,
          boundary: {
            provenance: "item",
            // "size": 5,
            center: [-77.2305, 38.84295],
            geometry: {
              type: "polygon",
              rings: [
                [
                  [-79.4066, 39.7187],
                  [-75.0544, 39.7187],
                  [-75.0544, 37.9672],
                  [-79.4066, 37.9672],
                  [-79.4066, 39.7187],
                ],
              ],
              spatialReference: {
                wkid: 4326,
              },
            } as IPolygonProperties,
            spatialReference: {
              wkid: 4326,
            },
          },
          recordCount: null,
        };
        itemEnrichments = getMultiLayerItemEnrichments();
      });
      it("should re-fetch hub enrichments for feature services", async () => {
        // expected layer
        const layerId = 1;
        // the hub API enrichments that we expect for the above layer
        // see: https://hubqa.arcgis.com/api/v3/datasets/eda6e08848924887b00a67ca319ec1bf_2?fields[datasets]=slug,boundary,recordCount,statistics
        const layerHubEnrichments = {
          itemId,
          layerId,
          slug: "dc::municipal-fire-stations",
          // NOTE: in this case the layer's boundary is the same as the parent's
          // for now I'm just cloning it so that we can test reference equality below
          boundary: cloneObject(hubEnrichments.boundary),
          recordCount: 438,
          statistics: {},
        };
        // initialize the spies
        const fetchItemEnrichmentsSpy = vi
          .spyOn(_enrichmentsModule, "fetchItemEnrichments")
          .mockResolvedValue(itemEnrichments as any);
        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
          .mockResolvedValue(hubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(
          JSON.parse(JSON.stringify(multiLayerFeatureServiceItem))
        );
        const fetchLayerHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsById")
          .mockResolvedValue(layerHubEnrichments as any);
        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;
        // call fetch content
        const options = {
          ...requestOpts,
          siteOrgKey,
          layerId,
        } as IFetchContentOptions;
        const result = await fetchContent(shortSlug, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
          expect.objectContaining(multiLayerFeatureServiceItem as any),
          [
            "groupIds",
            "metadata",
            "ownerUser",
            "org",
            "data",
            "server",
            "layers",
          ],
          options
        );
        expect(fetchLayerHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchLayerHubEnrichmentsSpy).toHaveBeenCalledWith(
          `${itemId}_${layerId}`,
          options
        );
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toMatchObject(
          multiLayerFeatureServiceItem as unknown as portalModule.IItem
        );
        // Default to slug that was passed in, not the slug of the fetched layer
        expect(result.slug).toBe(slug);
        // expect(result.boundary).toEqual(layerHubEnrichments.boundary)
        expect(result.boundary).toEqual(layerHubEnrichments.boundary);
        expect(result.boundary).not.toBe(hubEnrichments.boundary);
        expect(result.statistics).toEqual(layerHubEnrichments.statistics);
        expect(result.recordCount).toBe(layerHubEnrichments.recordCount);
      });
      it("should fetch view definition for client-side layer views", async () => {
        const layerId = 2;
        // NOTE: testing edge case here by pretending that
        // this layer view ends up filtering out all records
        const definitionExpression = "1=2";
        const count = 0;
        // mock the data response for a client-side layer view
        itemEnrichments.data = {
          layers: [
            {
              id: layerId,
              layerDefinition: {
                definitionExpression,
              },
            },
          ],
        };
        // expected layer
        itemEnrichments.layers?.push({
          id: layerId,
          type: "Feature Layer",
          isView: true,
          name: "layerView",
        } as any);
        // the hub API enrichments that we expect for the above layer
        // see: https://hubqa.arcgis.com/api/v3/datasets/eda6e08848924887b00a67ca319ec1bf_2?fields%5Bdatasets%5D=slug,boundary,recordCount,statistics
        const layerHubEnrichments = {
          itemId,
          layerId,
          slug: "dc::municipal-fire-stations",
          // NOTE: in this case the layer's boundary is the same as the parent's
          // for now I'm just cloning it so that we can test reference equality below
          boundary: cloneObject(hubEnrichments.boundary),
          recordCount: 438,
          statistics: {},
        };
        // initialize the spies
        const fetchItemEnrichmentsSpy = vi
          .spyOn(_enrichmentsModule, "fetchItemEnrichments")
          .mockResolvedValue(itemEnrichments as any);
        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
          .mockResolvedValue(layerHubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(
          JSON.parse(JSON.stringify(multiLayerFeatureServiceItem))
        );
        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;
        queryFeaturesSpy.mockResolvedValue({ count });
        // call fetch content
        // NOTE: not passing siteOrgKey and instead using fully qualified slug for layer
        slug = layerHubEnrichments.slug;
        const options = {
          ...requestOpts,
          layerId,
        } as IFetchContentOptions;
        const result = await fetchContent(slug, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchItemEnrichmentsSpy.mock.calls[0][1]).toEqual([
          "groupIds",
          "metadata",
          "ownerUser",
          "org",
          "data",
          "server",
          "layers",
        ]);
        expect(queryFeaturesSpy).toHaveBeenCalledTimes(1);
        const queryFeaturesArg = queryFeaturesSpy.mock.calls[0][0];
        expect(queryFeaturesArg.url).toEqual(result.url);
        expect(queryFeaturesArg.returnCountOnly).toBeTruthy();
        expect(queryFeaturesArg.where).toBe(definitionExpression);
        expect(queryFeaturesArg.portal).toBe(requestOpts.portal);
        // inspect the results
        expect(result.item).toMatchObject(
          multiLayerFeatureServiceItem as unknown as portalModule.IItem
        );
        expect(result.viewDefinition?.definitionExpression).toBe(
          definitionExpression
        );
        expect(result.recordCount).toBe(count);
      });
      // TODO: remove this test once we no longer support ArcGIS Server versions < 10.5
      // This test exercises the branch where a legacy server returns layers that are
      // sparsely populated (e.g. no type field) and the target layer needs to be re-fetched
      it("should fetch individual layer for legacy server", async () => {
        // set itemEnrichments to enrichments from a legacy server
        const layer = {
          id: 0,
          name: "layer0",
        };
        const table = {
          id: 1,
          name: "table1",
        };
        const item =
          multiLayerFeatureServiceItem as unknown as portalModule.IItem;
        itemEnrichments = {
          item,
          groupIds: ["foo", "bar"],
          metadata: null as any,
          ownerUser: {
            username: item.owner,
          },
          server: {
            currentVersion: 10.4,
            serviceDescription: "For demo purposes only.",
          },
          layers: [layer, table],
        };

        const layerId = 1;

        const layerHubEnrichments = {
          itemId,
          layerId,
          slug: "dc::municipal-fire-stations",
          // NOTE: in this case the layer's boundary is the same as the parent's
          // for now I'm just cloning it so that we can test reference equality below
          boundary: cloneObject(hubEnrichments.boundary),
          recordCount: 438,
          statistics: {},
        };
        // initialize the spies
        const fetchItemEnrichmentsSpy = vi
          .spyOn(_enrichmentsModule, "fetchItemEnrichments")
          .mockResolvedValue(itemEnrichments as any);

        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
          .mockResolvedValue(layerHubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(
          JSON.parse(JSON.stringify(multiLayerFeatureServiceItem))
        );

        const hydratedLayer = {
          id: 1,
          type: "Table",
          name: "table1",
        } as any;

        const getLayerSpy =
          featureLayerModule.getLayer as unknown as ReturnType<typeof vi.fn>;
        getLayerSpy.mockResolvedValue(hydratedLayer);

        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;

        // call fetch content
        // NOTE: not passing siteOrgKey and instead using fully qualified slug for layer
        slug = layerHubEnrichments.slug;
        const options = {
          ...requestOpts,
          layerId,
        } as IFetchContentOptions;
        const result = await fetchContent(slug, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchItemEnrichmentsSpy.mock.calls[0][1]).toEqual([
          "groupIds",
          "metadata",
          "ownerUser",
          "org",
          "data",
          "server",
          "layers",
        ]);
        expect(getLayerSpy).toHaveBeenCalledTimes(1);
        const getLayerArg = getLayerSpy.mock.calls[0][0];
        expect(getLayerArg).toEqual({
          ...requestOpts,
          layerId,
          url: "https://geodata.md.gov/imap/rest/services/PublicSafety/MD_Fire/FeatureServer/1",
        });
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toMatchObject(
          multiLayerFeatureServiceItem as unknown as portalModule.IItem
        );
        expect(result.layer).toEqual(hydratedLayer); // Layer is hydrated
        expect(result.layers).toEqual([
          {
            id: 0,
            name: "layer0",
          },
          hydratedLayer, // Corresponding entry in Layers in hydrated
        ]);
        expect(result.recordCount).toBe(layerHubEnrichments.recordCount);
      });
    });
    describe("with defaults", () => {
      // NOTE: other tests pass enrichments: [] to avoid stubbing fetchItemEnrichments
      // this test covers the more common use case where we fetch the default enrichments
      // for a document item. The default enrichments for other types are covered by other tests
      const itemEnrichments = {
        groupIds: ["foo", "bar"],
        metadata: null,
        ownerUser: {
          username: documentItem.owner,
        },
      } as IItemEnrichments;
      it("should fetch default item enrichments", async () => {
        // initialize the spies
        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
          .mockResolvedValue(hubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(JSON.parse(JSON.stringify(documentItem)));
        const fetchItemEnrichmentsSpy = vi
          .spyOn(_enrichmentsModule, "fetchItemEnrichments")
          .mockResolvedValue(itemEnrichments as any);
        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;
        // call fetch content
        const options = {
          ...requestOpts,
          siteOrgKey,
        } as IFetchContentOptions;
        const result = await fetchContent(shortSlug, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
          expect.objectContaining(documentItem as any),
          ["groupIds", "metadata", "ownerUser", "org"],
          options
        );
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toMatchObject(documentItem as any);
        expect(result.boundary).toEqual({
          geometry: null as any,
          provenance: undefined,
        });
        expect(result.statistics).toBeUndefined();
      });
      it("should use the production APIs when no request options are passed", async () => {
        // initialize the spies
        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsBySlug")
          .mockResolvedValue(hubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(JSON.parse(JSON.stringify(documentItem)));
        const fetchItemEnrichmentsSpy = vi
          .spyOn(_enrichmentsModule, "fetchItemEnrichments")
          .mockResolvedValue(itemEnrichments as any);
        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;
        // call fetch content
        // NOTE: we have to pass the fully qualified slug if not passing options
        const result = await fetchContent(slug);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, undefined);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, undefined);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
          expect.objectContaining(documentItem as any),
          ["groupIds", "metadata", "ownerUser", "org"],
          undefined
        );
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toMatchObject(documentItem as any);
        expect(result.boundary).toEqual({
          geometry: null as any,
          provenance: undefined,
        });
        expect(result.statistics).toBeUndefined();
      });
    });
  });
  describe("by id", () => {
    it("should fetch item by id then the hub enrichments by id", async () => {
      // initialize the spies
      const fetchHubEnrichmentsSpy = vi
        .spyOn(_fetchModule, "fetchHubEnrichmentsById")
        .mockResolvedValue(hubEnrichments as any);
      const getItemSpy = portalModule.getItem as unknown as ReturnType<
        typeof vi.fn
      >;
      getItemSpy.mockResolvedValue(JSON.parse(JSON.stringify(documentItem)));
      const queryFeaturesSpy =
        featureLayerModule.queryFeatures as unknown as ReturnType<typeof vi.fn>;
      // call fetch content
      const options = {
        ...requestOpts,
        // this keeps us from having to mock the call to fetch item enrichments
        enrichments: [],
      } as IFetchContentOptions;
      const result = await fetchContent(itemId, options);
      // inspect the calls
      expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
      expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(itemId, options);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
      expect(queryFeaturesSpy).not.toHaveBeenCalled();
      // inspect the results
      expect(result.item).toMatchObject(documentItem as any);
      expect(result.boundary).toEqual({
        geometry: null as any,
        provenance: undefined,
      });
      expect(result.statistics).toBeUndefined();
    });
    describe("in a portal environment", () => {
      beforeEach(() => {
        requestOpts = {
          portal: "https://fake.server.com/sharing/rest",
          isPortal: true,
        };
      });
      it("should not fetch hubEnrichments", async () => {
        // initialize the spies
        const fetchHubEnrichmentsSpy = vi
          .spyOn(_fetchModule, "fetchHubEnrichmentsById")
          .mockResolvedValue(hubEnrichments as any);
        const getItemSpy = portalModule.getItem as unknown as ReturnType<
          typeof vi.fn
        >;
        getItemSpy.mockResolvedValue(JSON.parse(JSON.stringify(documentItem)));
        const queryFeaturesSpy =
          featureLayerModule.queryFeatures as unknown as ReturnType<
            typeof vi.fn
          >;
        // call fetch content
        const options = {
          ...requestOpts,
          // this keeps us from having to mock the call to fetch item enrichments
          enrichments: [],
        } as IFetchContentOptions;
        const result = await fetchContent(itemId, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).not.toHaveBeenCalled();
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toMatchObject(documentItem as any);
        expect(result.boundary).toEqual({
          geometry: null as any,
          provenance: undefined,
        });
        expect(result.statistics).toBeUndefined();
      });
      describe("when layerId passed in", () => {
        beforeEach(() => {
          itemId = multiLayerFeatureServiceItem.id;
        });
        it("should return layer", async () => {
          // NOTE: other tests pass enrichments: [] to avoid stubbing fetchItemEnrichments
          // this test covers the more common use case where we fetch the default enrichments
          // for a feature service item.
          const itemEnrichments = getMultiLayerItemEnrichments();
          const layerId = 0;
          // initialize the spies
          const getItemSpy = portalModule.getItem as unknown as ReturnType<
            typeof vi.fn
          >;
          getItemSpy.mockResolvedValue(
            JSON.parse(JSON.stringify(multiLayerFeatureServiceItem))
          );
          const fetchItemEnrichmentsSpy = vi
            .spyOn(_enrichmentsModule, "fetchItemEnrichments")
            .mockResolvedValue(itemEnrichments as any);
          // NOTE: for coverage sake we're going to emulate
          // that the feature service is down and doesn't return record count
          const queryFeaturesSpy =
            featureLayerModule.queryFeatures as unknown as ReturnType<
              typeof vi.fn
            >;
          queryFeaturesSpy.mockRejectedValue(new Error("fail"));
          // call fetch content
          const options = {
            ...requestOpts,
            layerId,
          } as IFetchContentOptions;
          const result = await fetchContent(itemId, options);
          // inspect the calls
          expect(getItemSpy).toHaveBeenCalledTimes(1);
          expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
          expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
          expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
            expect.objectContaining(multiLayerFeatureServiceItem as any),
            [
              "groupIds",
              "metadata",
              "ownerUser",
              "org",
              "data",
              "server",
              "layers",
            ],
            options
          );
          expect(queryFeaturesSpy).toHaveBeenCalledTimes(1);
          const queryFeaturesArg = queryFeaturesSpy.mock.calls[0][0];
          expect(queryFeaturesArg.url).toEqual(result.url);
          expect(queryFeaturesArg.returnCountOnly).toBeTruthy();
          expect(queryFeaturesArg.where).toBeUndefined();
          expect(queryFeaturesArg.portal).toBe(requestOpts.portal);
          // inspect the results
          expect(result.item).toMatchObject(
            multiLayerFeatureServiceItem as any
          );
          // expect(result.boundary).toEqual({ geometry: null, provenance: undefined })
          expect(result.statistics).toBeUndefined();
          expect(result.layer?.id).toBe(layerId);
          expect(result.recordCount).toEqual(Infinity);
        });
      });
    });
  });
});
