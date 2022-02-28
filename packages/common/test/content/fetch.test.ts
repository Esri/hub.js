import { IPolygon } from "@esri/arcgis-rest-types";
import * as portalModule from "@esri/arcgis-rest-portal";
import {
  IHubRequestOptions,
  fetchContent,
  IFetchContentOptions,
  IItemEnrichments,
  cloneObject,
} from "../../src";
import * as _enrichmentsModule from "../../src/items/_enrichments";
import * as _fetchModule from "../../src/content/_fetch";
import * as documentItem from "../mocks/items/document.json";
import * as multiLayerFeatureServiceItem from "../mocks/items/multi-layer-feature-service.json";

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
      // inspect the results
      expect(result.item).toEqual(documentItem);
      expect(result.boundary).toEqual({
        geometry: undefined,
        provenance: undefined,
      });
      expect(result.statistics).toBeUndefined();
    });
    describe("with a specific layer", () => {
      beforeEach(() => {
        // initialize the above above variables for the multi-layer feature service item
        // see: https://hubqa.arcgis.com/api/v3/datasets/eda6e08848924887b00a67ca319ec1bf
        itemId = multiLayerFeatureServiceItem.id;
        shortSlug = "maryland-server-supports-export";
        siteOrgKey = "dc";
        slug = `${siteOrgKey}::${shortSlug}`;
        // the expected hub enrichments for the above item
        // see: https://hubqa.arcgis.com/api/v3/datasets?filter%5Bslug%5D=dc%3A%3Amaryland-server-supports-export&fields[datasets]=slug,boundary,statistics
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
            } as IPolygon,
            // "setBy": null
          },
        };
      });
      it("should re-fetch hub enrichments for feature services", async () => {
        // expected layer
        const layerId = 2;
        // the hub API enrichments that we expect for the above layer
        // see: https://hubqa.arcgis.com/api/v3/datasets/eda6e08848924887b00a67ca319ec1bf_2?fields[datasets]=slug,boundary,statistics
        const layerHubEnrichments = {
          itemId,
          layerId,
          slug: "dc::municipal-fire-stations",
          // NOTE: in this case the layer's boundary is the same as the parent's
          // for now I'm just cloning it so that we can test reference equality below
          boundary: cloneObject(hubEnrichments.boundary),
          statistics: {},
        };
        // initialize the spies
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
        // call fetch content
        const options = {
          ...requestOpts,
          siteOrgKey,
          layerId,
          // this keeps us from having to mock the call to fetch item enrichments
          enrichments: [],
        } as IFetchContentOptions;
        const result = await fetchContent(shortSlug, options);
        // inspect the calls
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubEnrichmentsSpy).toHaveBeenCalledWith(slug, options);
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(getItemSpy).toHaveBeenCalledWith(itemId, options);
        expect(fetchLayerHubEnrichmentsSpy).toHaveBeenCalledTimes(1);
        expect(fetchLayerHubEnrichmentsSpy).toHaveBeenCalledWith(
          `${itemId}_${layerId}`,
          options
        );
        // inspect the results
        expect(result.item).toEqual(
          multiLayerFeatureServiceItem as unknown as portalModule.IItem
        );
        expect(result.slug).toBe(layerHubEnrichments.slug);
        // expect(result.boundary).toEqual(layerHubEnrichments.boundary)
        expect(result.boundary).toBe(layerHubEnrichments.boundary);
        expect(result.boundary).not.toBe(hubEnrichments.boundary);
        expect(result.statistics).toEqual(layerHubEnrichments.statistics);
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
        // inspect the results
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: undefined,
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
        // inspect the results
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: undefined,
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
      // inspect the results
      expect(result.item).toEqual(documentItem);
      expect(result.boundary).toEqual({
        geometry: undefined,
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
        // inspect the results
        expect(result.item).toEqual(documentItem);
        expect(result.boundary).toEqual({
          geometry: undefined,
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
          const layer = { id: 0, name: "layer0 " };
          const table = { id: 1, name: "table1 " };
          const itemEnrichments = {
            groupIds: ["foo", "bar"],
            metadata: null,
            ownerUser: {
              username: multiLayerFeatureServiceItem.owner,
            },
            server: {
              currentVersion: 10.71,
              serviceDescription: "For demo purposes only.",
            },
            layers: [layer, table],
          } as IItemEnrichments;
          const layerId = 1;
          // initialize the spies
          const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
            Promise.resolve(multiLayerFeatureServiceItem)
          );
          const fetchItemEnrichmentsSpy = spyOn(
            _enrichmentsModule,
            "fetchItemEnrichments"
          ).and.returnValue(Promise.resolve(itemEnrichments));
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
            ["groupIds", "metadata", "ownerUser", "org", "server", "layers"],
            options
          );
          // inspect the results
          expect(result.item).toEqual(
            multiLayerFeatureServiceItem as portalModule.IItem
          );
          // expect(result.boundary).toEqual({ geometry: undefined, provenance: undefined })
          expect(result.statistics).toBeUndefined();
          expect(result.layer).toEqual(table);
        });
      });
    });
  });
});
