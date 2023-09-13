import * as portalModule from "@esri/arcgis-rest-portal";
import * as featureLayerModule from "@esri/arcgis-rest-feature-layer";
import {
  IHubRequestOptions,
  fetchContent,
  IFetchContentOptions,
  IItemEnrichments,
  cloneObject,
  IPolygonProperties,
  fetchHubContent,
} from "../../src";
import * as _enrichmentsModule from "../../src/items/_enrichments";
import * as _fetchModule from "../../src/content/_fetch";
import * as documentItem from "../mocks/items/document.json";
import * as multiLayerFeatureServiceItem from "../mocks/items/multi-layer-feature-service.json";
import {
  HOSTED_FEATURE_SERVICE_DEFINITION,
  HOSTED_FEATURE_SERVICE_GUID,
  HOSTED_FEATURE_SERVICE_ITEM,
  HOSTED_FEATURE_SERVICE_URL,
  NON_HOSTED_FEATURE_SERVICE_GUID,
  NON_HOSTED_FEATURE_SERVICE_ITEM,
  PDF_GUID,
  PDF_ITEM,
} from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";

// mock the item enrichments that would be returned for a multi-layer service
const getMultiLayerItemEnrichments = () => {
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
  let portal: string;
  let hubApiUrl: string;
  let itemId: string;
  let shortSlug: string;
  let siteOrgKey: string;
  let slug: string;
  let hubEnrichments: _fetchModule.IDatasetEnrichments;
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
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
      boundary: null,
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
      const fetchHubEnrichmentsSpy = spyOn(
        _fetchModule,
        "fetchHubEnrichmentsBySlug"
      ).and.returnValue(Promise.resolve(hubEnrichments));
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(documentItem)
      );
      const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
      // call fetch content
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
      // inspect the results
      expect(result.item).toEqual(documentItem);
      expect(result.boundary).toEqual({
        geometry: null,
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
        const fetchItemEnrichmentsSpy = spyOn(
          _enrichmentsModule,
          "fetchItemEnrichments"
        ).and.returnValue(Promise.resolve(itemEnrichments));
        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsBySlug"
        ).and.returnValue(Promise.resolve(hubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(multiLayerFeatureServiceItem)
        );
        const fetchLayerHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsById"
        ).and.returnValue(Promise.resolve(layerHubEnrichments));
        const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
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
          multiLayerFeatureServiceItem,
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
        expect(result.item).toEqual(
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
        itemEnrichments.layers.push({
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
        const fetchItemEnrichmentsSpy = spyOn(
          _enrichmentsModule,
          "fetchItemEnrichments"
        ).and.callFake(() => Promise.resolve(itemEnrichments));
        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsBySlug"
        ).and.returnValue(Promise.resolve(layerHubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(multiLayerFeatureServiceItem)
        );
        const queryFeaturesSpy = spyOn(
          featureLayerModule,
          "queryFeatures"
        ).and.returnValue(Promise.resolve({ count }));
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
        expect(fetchItemEnrichmentsSpy.calls.argsFor(0)[1]).toEqual([
          "groupIds",
          "metadata",
          "ownerUser",
          "org",
          "data",
          "server",
          "layers",
        ]);
        expect(queryFeaturesSpy).toHaveBeenCalledTimes(1);
        const queryFeaturesArg = queryFeaturesSpy.calls.argsFor(0)[0] as any;
        expect(queryFeaturesArg.url).toEqual(result.url);
        expect(queryFeaturesArg.returnCountOnly).toBeTruthy();
        expect(queryFeaturesArg.where).toBe(definitionExpression);
        expect(queryFeaturesArg.portal).toBe(requestOpts.portal);
        // inspect the results
        expect(result.item).toEqual(
          multiLayerFeatureServiceItem as unknown as portalModule.IItem
        );
        expect(result.viewDefinition.definitionExpression).toBe(
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
        const fetchItemEnrichmentsSpy = spyOn(
          _enrichmentsModule,
          "fetchItemEnrichments"
        ).and.callFake(() => Promise.resolve(itemEnrichments));

        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsBySlug"
        ).and.returnValue(Promise.resolve(layerHubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(multiLayerFeatureServiceItem)
        );

        const hydratedLayer = {
          id: 1,
          type: "Table",
          name: "table1",
        } as any;

        const getLayerSpy = spyOn(
          featureLayerModule,
          "getLayer"
        ).and.returnValue(Promise.resolve(hydratedLayer));

        const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");

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
        expect(fetchItemEnrichmentsSpy.calls.argsFor(0)[1]).toEqual([
          "groupIds",
          "metadata",
          "ownerUser",
          "org",
          "data",
          "server",
          "layers",
        ]);
        expect(getLayerSpy).toHaveBeenCalledTimes(1);
        const getLayerArg = getLayerSpy.calls.argsFor(0)[0] as any;
        expect(getLayerArg).toEqual({
          ...requestOpts,
          layerId,
          url: "https://geodata.md.gov/imap/rest/services/PublicSafety/MD_Fire/FeatureServer/1",
        });
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toEqual(
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
        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsBySlug"
        ).and.returnValue(Promise.resolve(hubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(documentItem)
        );
        const fetchItemEnrichmentsSpy = spyOn(
          _enrichmentsModule,
          "fetchItemEnrichments"
        ).and.returnValue(Promise.resolve(itemEnrichments));
        const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
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
          documentItem,
          ["groupIds", "metadata", "ownerUser", "org"],
          options
        );
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: null,
          provenance: undefined,
        });
        expect(result.statistics).toBeUndefined();
      });
      it("should use the production APIs when no request options are passed", async () => {
        // initialize the spies
        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsBySlug"
        ).and.returnValue(Promise.resolve(hubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(documentItem)
        );
        const fetchItemEnrichmentsSpy = spyOn(
          _enrichmentsModule,
          "fetchItemEnrichments"
        ).and.returnValue(Promise.resolve(itemEnrichments));
        const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
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
          documentItem,
          ["groupIds", "metadata", "ownerUser", "org"],
          undefined
        );
        expect(queryFeaturesSpy).not.toHaveBeenCalled();
        // inspect the results
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: null,
          provenance: undefined,
        });
        expect(result.statistics).toBeUndefined();
      });
    });
  });
  describe("by id", () => {
    it("should fetch item by id then the hub enrichments by id", async () => {
      // initialize the spies
      const fetchHubEnrichmentsSpy = spyOn(
        _fetchModule,
        "fetchHubEnrichmentsById"
      ).and.returnValue(Promise.resolve(hubEnrichments));
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(documentItem)
      );
      const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
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
      expect(result.item).toEqual(documentItem);
      expect(result.boundary).toEqual({
        geometry: null,
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
        const fetchHubEnrichmentsSpy = spyOn(
          _fetchModule,
          "fetchHubEnrichmentsById"
        ).and.returnValue(Promise.resolve(hubEnrichments));
        const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
          Promise.resolve(documentItem)
        );
        const queryFeaturesSpy = spyOn(featureLayerModule, "queryFeatures");
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
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: null,
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
          const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
            Promise.resolve(multiLayerFeatureServiceItem)
          );
          const fetchItemEnrichmentsSpy = spyOn(
            _enrichmentsModule,
            "fetchItemEnrichments"
          ).and.returnValue(Promise.resolve(itemEnrichments));
          // NOTE: for coverage sake we're going to emulate
          // that the feature service is down and doesn't return record count
          const queryFeaturesSpy = spyOn(
            featureLayerModule,
            "queryFeatures"
          ).and.returnValue(Promise.reject());
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
            multiLayerFeatureServiceItem,
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
          const queryFeaturesArg = queryFeaturesSpy.calls.argsFor(0)[0] as any;
          expect(queryFeaturesArg.url).toEqual(result.url);
          expect(queryFeaturesArg.returnCountOnly).toBeTruthy();
          expect(queryFeaturesArg.where).toBeUndefined();
          expect(queryFeaturesArg.portal).toBe(requestOpts.portal);
          // inspect the results
          expect(result.item).toEqual(
            multiLayerFeatureServiceItem as portalModule.IItem
          );
          // expect(result.boundary).toEqual({ geometry: null, provenance: undefined })
          expect(result.statistics).toBeUndefined();
          expect(result.layer.id).toBe(layerId);
          expect(result.recordCount).toEqual(Infinity);
        });
      });
    });
  });
});

describe("fetchHubContent", () => {
  it("gets hosted feature service", async () => {
    const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
      Promise.resolve(HOSTED_FEATURE_SERVICE_ITEM)
    );
    const getServiceSpy = spyOn(
      featureLayerModule,
      "getService"
    ).and.returnValue(HOSTED_FEATURE_SERVICE_DEFINITION);

    const chk = await fetchHubContent(HOSTED_FEATURE_SERVICE_GUID, {
      authentication: MOCK_AUTH,
    });
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(chk.serverExtractCapability).toBeTruthy();
    expect(chk.hostedDownloads).toBeFalsy();

    expect(getItemSpy.calls.count()).toBe(1);
    expect(getItemSpy.calls.argsFor(0)[0]).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(getServiceSpy.calls.count()).toBe(1);
    expect(getServiceSpy.calls.argsFor(0)[0].url).toBe(
      HOSTED_FEATURE_SERVICE_URL
    );
  });

  it("gets non-hosted feature service", async () => {
    const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
      Promise.resolve(NON_HOSTED_FEATURE_SERVICE_ITEM)
    );
    const getServiceSpy = spyOn(featureLayerModule, "getService");

    const chk = await fetchHubContent(NON_HOSTED_FEATURE_SERVICE_GUID, {
      authentication: MOCK_AUTH,
    });
    expect(chk.id).toBe(NON_HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(NON_HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(chk.serverExtractCapability).toBeFalsy();
    expect(chk.hostedDownloads).toBeFalsy();

    expect(getItemSpy.calls.count()).toBe(1);
    expect(getItemSpy.calls.argsFor(0)[0]).toBe(
      NON_HOSTED_FEATURE_SERVICE_GUID
    );
    // Service definition isn't fetched for non-hosted feature services
    expect(getServiceSpy.calls.count()).toBe(0);
  });

  it("gets non-service content", async () => {
    const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
      Promise.resolve(PDF_ITEM)
    );
    const getServiceSpy = spyOn(featureLayerModule, "getService");

    const chk = await fetchHubContent(PDF_GUID, {
      authentication: MOCK_AUTH,
    });
    expect(chk.id).toBe(PDF_GUID);
    expect(chk.owner).toBe(PDF_ITEM.owner);
    expect(chk.serverExtractCapability).toBeFalsy();
    expect(chk.hostedDownloads).toBeFalsy();

    expect(getItemSpy.calls.count()).toBe(1);
    expect(getItemSpy.calls.argsFor(0)[0]).toBe(PDF_GUID);
    // Service definition isn't fetched items that aren't hosted feature services
    expect(getServiceSpy.calls.count()).toBe(0);
  });
});
