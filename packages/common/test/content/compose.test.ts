import { ILayerDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  composeContent,
  getPortalUrls,
  getProxyUrl,
  IHubGeography,
  IHubRequestOptions,
  PublisherSource,
} from "../../src";
import * as documentItem from "../mocks/items/document.json";
import * as mapServiceItem from "../mocks/items/map-service.json";

const featureServiceItem = {
  id: "3ae",
  type: "Feature Service",
  title: "Item Title",
  description: "Item description",
  snippet: "Item snippet",
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/LocalGovernment/Recreation/FeatureServer",
  access: "public",
  owner: "me",
  tags: ["test"],
  created: 1526675011000,
  modified: 1526675614000,
  numViews: 1,
  size: null,
} as IItem;

describe("composeContent", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  let item: IItem;
  // most of compose content is currently covered by
  // tests of higher level functions like datasetToContent()
  // the tests below fill the gaps in coverage
  it("should expose metrics", () => {
    item = cloneObject(documentItem) as IItem;
    const properties = {
      metrics: {},
    };
    const content = composeContent({
      ...item,
      properties,
    });
    expect(content.metrics).toEqual(properties.metrics);
  });
  describe("proxied CSV", () => {
    beforeEach(() => {
      item = {
        id: "3ae",
        type: "CSV",
        title: "Item Title",
        description: "Item description",
        snippet: "Item snippet",
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/LocalGovernment/Recreation/FeatureServer",
        access: "public",
        owner: "me",
        tags: ["test"],
        created: 1526675011000,
        modified: 1526675614000,
        numViews: 1,
        size: 4000000,
      };
    });
    it("should have the proxied CSV URL", () => {
      // NOTE: we're not passing in request options,
      // so we expect this to return a prod URL
      const proxiedContent = composeContent(item);
      expect(proxiedContent.url).toEqual(
        "https://hub.arcgis.com/datasets/3ae_0/FeatureServer/0"
      );
    });
    it("getProxyUrl removes /api/v3 from resulting url", () => {
      const requestOptions = {
        hubApiUrl: "https://hubqa.arcgis.com/api/v3",
      } as unknown as IHubRequestOptions;
      const proxyUrl = getProxyUrl(item, requestOptions);
      expect(proxyUrl).toEqual(
        "https://hubqa.arcgis.com/datasets/3ae_0/FeatureServer/0"
      );
    });
    it("should not append _0 to the hubId", () => {
      const proxiedContent = composeContent(item);
      expect(proxiedContent.hubId).toEqual("3ae");
    });
    it("should correctly populate layer-dependent properties when item.url is the proxied url", () => {
      const layers = [
        {
          id: 0,
          type: "Feature Layer",
          name: "layer name",
          description: "layer description",
        },
      ] as unknown as ILayerDefinition[];
      const proxiedItem = {
        ...item,
        url: "https://hub.arcgis.com/datasets/3ae_0/FeatureServer/0",
      };
      const proxiedContent = composeContent(proxiedItem, { layers });
      expect(proxiedContent.layer).toEqual({
        id: 0,
        type: "Feature Layer",
        name: "layer name",
        description: "layer description",
      });
      expect(proxiedContent.type).toEqual("Feature Layer");
      // layer description shouldn't be used for proxied csv's
      expect(proxiedContent.description).toEqual("Item description");
      // layer name shouldn't be used for proxied csv's
      expect(proxiedContent.name).toEqual("Item Title");
    });
  });
  describe("with ownerUser", () => {
    it("should have orgId", () => {
      item = cloneObject(documentItem);
      delete item.orgId;
      const orgId = "foo";
      const ownerUser = {
        username: item.owner,
        orgId,
      };
      const content = composeContent(item, { ownerUser });
      expect(content.orgId).toBe(orgId);
    });
  });
  describe("with metadata", () => {
    beforeEach(() => {
      item = cloneObject(featureServiceItem);
    });
    describe("updateFrequency", () => {
      it("should return undefined when metadata present but unknown value", () => {
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              resMaint: {
                maintFreq: {
                  MaintFreqCd: {
                    "@_value": "999",
                  },
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.updateFrequency).toEqual(undefined);
      });
      it("should return the correct value when metadata present", () => {
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              resMaint: {
                maintFreq: {
                  MaintFreqCd: {
                    "@_value": "003",
                  },
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.updateFrequency).toEqual("weekly");
      });
    });
    describe("metadataUpdateFrequency", () => {
      it("should return undefined when metadata present but unknown value", () => {
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            mdMaint: {
              maintFreq: {
                MaintFreqCd: {
                  "@_value": "999",
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.metadataUpdateFrequency).toEqual(undefined);
      });
      it("should return the correct value when metadata present", () => {
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            mdMaint: {
              maintFreq: {
                MaintFreqCd: {
                  "@_value": "003",
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.metadataUpdateFrequency).toEqual("weekly");
      });
    });
    describe("metadataUpdatedDate", () => {
      it("should return the correct value when metadataUpdatedDate metadata present", () => {
        const metadataUpdatedDate = "1970";
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            mdDateSt: metadataUpdatedDate,
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.metadataUpdatedDate).toEqual(
          new Date(+metadataUpdatedDate, 0, 1)
        );
        expect(result.metadataUpdatedDatePrecision).toEqual("year");
        expect(result.metadataUpdatedDateSource).toEqual(
          "metadata.metadata.mdDateSt"
        );
      });
    });
    describe("updatedDate", () => {
      // NOTE: layer/server lastEditDate  is covered by other tests
      it("should return the correct value when reviseDate metadata present", () => {
        const reviseDate = "1970-02";
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  reviseDate,
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        const dateParts = reviseDate.split("-").map((part) => +part);
        expect(result.updatedDate).toEqual(
          new Date(dateParts[0], dateParts[1] - 1, 1)
        );
        expect(result.updatedDatePrecision).toEqual("month");
        expect(result.updatedDateSource).toEqual(
          "metadata.metadata.dataIdInfo.idCitation.date.reviseDate"
        );
      });
    });
    describe("additionalResources", () => {
      it("should return null if metadata doesn't contain additional resources", () => {
        const metadata = {};
        const result = composeContent(item, { metadata });
        expect(result.additionalResources).toBeNull();
      });
      it("should return correct structure when metadata contain additional resources", () => {
        const metadata = {
          metadata: {
            distInfo: {
              distTranOps: {
                onLineSrc: [
                  {
                    linkage: "unnamed-resource-url",
                  },
                  {
                    orName: "Named Resource",
                    linkage: "named-resource-url",
                  },
                ],
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.additionalResources.length).toEqual(2);
        expect(result.additionalResources).toEqual([
          {
            name: undefined,
            url: "unnamed-resource-url",
            isDataSource: false,
          },
          {
            name: "Named Resource",
            url: "named-resource-url",
            isDataSource: false,
          },
        ]);
      });
    });
    describe("publishedDate", () => {
      it("should return the correct value when pubDate metadata present", () => {
        const pubDate = "1970-02-07";
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  pubDate,
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        const dateParts = pubDate.split("-").map((part) => +part);
        expect(result.publishedDate).toEqual(
          new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
        );
        expect(result.publishedDatePrecision).toEqual("day");
        expect(result.publishedDateSource).toEqual(
          "metadata.metadata.dataIdInfo.idCitation.date.pubDate"
        );
      });
      it("should return the correct value when createDate metadata present", () => {
        const createDate = "1970-02-07";
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  createDate,
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        const dateParts = createDate.split("-").map((part) => +part);
        expect(result.publishedDate).toEqual(
          new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
        );
        expect(result.publishedDatePrecision).toEqual("day");
        expect(result.publishedDateSource).toEqual(
          "metadata.metadata.dataIdInfo.idCitation.date.createDate"
        );
      });
      it("should return the correct value when createDate & pubDate metadata present", () => {
        const pubDate = "02/07/1970";
        const metadata = {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139",
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  createDate: "1970-11-17T00:00:00.000Z",
                  pubDate,
                },
              },
            },
          },
        };
        const result = composeContent(item, { metadata });
        expect(result.publishedDate).toEqual(new Date(1970, 1, 7));
        expect(result.publishedDatePrecision).toEqual("day");
        expect(result.publishedDateSource).toEqual(
          "metadata.metadata.dataIdInfo.idCitation.date.pubDate"
        );
      });
    });
    describe("with publisher info", () => {
      it("should populate publisher", () => {
        const metadata = {
          metadata: {
            mdContact: {
              rpIndName: "Metadata Name",
              rpOrgName: "Metadata Org",
            },
          },
        };
        const content = composeContent(item, { metadata });
        expect(content.publisher).toEqual({
          name: "Metadata Name",
          nameSource: PublisherSource.MetadataContact,
          organization: "Metadata Org",
          organizationSource: PublisherSource.MetadataContact,
          isExternal: false,
        });
      });
    });
  });
  describe("with layers", () => {
    const layers = [
      {
        id: 0,
        name: "layer_0",
        type: "Feature Layer",
        description: "Layer description",
        capabilities: "Query",
      },
      {
        id: 1,
        name: "layer_1",
        type: "Feature Layer",
        description: "",
        capabilities: "Query",
      },
      {
        id: 2,
        name: "table_2",
        type: "Table",
        description: "",
        capabilities: "Query",
      },
    ] as Array<Partial<ILayerDefinition>>;
    beforeEach(() => {
      item = cloneObject(featureServiceItem);
    });
    it("non-public, multi-layer feature service w/ layerId", () => {
      item.access = "private";
      let layerId = 0;
      let layerContent = composeContent(item, { layerId, layers });
      let layer = layers[0];
      expect(layerContent.layer).toEqual(layer, "should set layer");
      expect(layerContent.hubId).toBeUndefined("should not set hubId");
      expect(layerContent.type).toBe(layer.type, "should set type");
      expect(layerContent.family).toBe("dataset", "should set family");
      expect(layerContent.title).toEqual("layer 0", "should set title");
      expect(layerContent.description).toEqual(
        layer.description,
        "should set description"
      );
      expect(layerContent.summary).toEqual(
        item.snippet,
        "should not set summary"
      );
      expect(layerContent.url).toEqual(
        `${item.url}/${layerId}`,
        "should set url"
      );
      // layer w/ no description
      layerId = 1;
      layerContent = composeContent(item, { layerId, layers });
      layer = layers[1];
      expect(layerContent.layer).toEqual(layer, "should set layer");
      expect(layerContent.title).toEqual("layer 1", "should set title");
      expect(layerContent.description).toEqual(
        item.description,
        "should set description"
      );
      expect(layerContent.summary).toEqual(item.snippet, "should set summary");
      expect(layerContent.url).toEqual(
        `${item.url}/${layerId}`,
        "should set url"
      );
    });
    it("public, multi-layer feature service w/o layerId", () => {
      const layerContent = composeContent(item, { layers });
      expect(layerContent.layer).toBeUndefined();
      expect(layerContent.hubId).toBe(item.id);
      expect(layerContent.type).toBe(item.type);
      expect(layerContent.family).toBe("map");
      expect(layerContent.url).toEqual(item.url);
      expect(layerContent.title).toEqual(item.title);
      expect(layerContent.description).toEqual(item.description);
      expect(layerContent.summary).toEqual(item.snippet);
    });
    it("public, single-layer feature service w/o layerId", () => {
      const layer = layers[0];
      const layerContent = composeContent(item, { layers: [layer] });
      expect(layerContent.layer).toEqual(layer, "should set layer");
      expect(layerContent.hubId).toBe(
        `${item.id}_${layer.id}`,
        "should set hubId"
      );
      expect(layerContent.type).toBe(layer.type, "should set type");
      expect(layerContent.family).toBe("dataset", "should set family");
      expect(layerContent.url).toEqual(
        `${item.url}/${layer.id}`,
        "should set url"
      );
      expect(layerContent.title).toEqual(item.title, "should not set title");
      expect(layerContent.description).toEqual(
        item.description,
        "should not set description"
      );
      expect(layerContent.summary).toEqual(
        item.snippet,
        "should not set summary"
      );
    });
    // NOTE: we may want to re-implement the tests in enrichments.test.ts
    // that were introduced in https://github.com/Esri/hub.js/pull/633
    // if we discover that those buggy items cause problems
  });
  describe("boundary", () => {
    const spatialReference = {
      wkid: 4326,
    };
    const geometry = {
      rings: [
        [
          [-2.732, 53.6093],
          [-2.4139, 53.6093],
          [-2.4139, 53.4452],
          [-2.732, 53.4452],
          [-2.732, 53.6093],
        ],
      ],
      spatialReference,
      type: "polygon",
    } as any;
    const center = [-2.57295, 53.527249999999995] as [number, number];
    it("handles invalid item boundary set to item extent but item has no extent", () => {
      item = cloneObject(documentItem) as IItem;
      // configure item to specify using item extent as boundary
      // even though the item has an empty extent
      const properties = { boundary: "item" };
      const content = composeContent({ ...item, properties });
      const boundary = content.boundary;
      expect(boundary.geometry).toBeNull();
      expect(boundary.provenance).toBe("item");
    });
    it("has a boundary when the item has a valid extent", () => {
      item = cloneObject(mapServiceItem) as IItem;
      const content = composeContent(item);
      expect(content.boundary).toEqual({
        geometry,
        provenance: "item",
        center,
        spatialReference,
      });
    });
    it("should handle boundary type automatic from the Hub API", () => {
      item = cloneObject(mapServiceItem) as IItem;
      // create new geometry and center by shifting y coord up 1
      const shiftXY = ([x, y]: [number, number]) => [x, y + 1];
      const updatedGeometry = {
        ...geometry,
        rings: [geometry.rings[0].map(shiftXY)],
      };
      const updatedCenter = shiftXY(center);
      const boundary = {
        geometry: updatedGeometry,
        provenance: "automatic",
        center: updatedCenter,
        spatialReference,
      } as IHubGeography;
      const content = composeContent(item, { boundary });
      expect(content.boundary).toBe(boundary);
    });
    // NOTE: other boundary scenarios are covered by tests in _fetch.test.ts
  });
  describe("edge cases", () => {
    it("should handle no item title", () => {
      item = cloneObject(documentItem) as IItem;
      delete item.title;
      const content = composeContent(item);
      expect(content.name).toBe("e2e.pdf");
    });
    it("should handle no item title/name", () => {
      item = cloneObject(documentItem) as IItem;
      delete item.title;
      delete item.name;
      const content = composeContent(item);
      expect(content.name).toBe("");
    });
  });
});

describe("getPortalUrls", () => {
  it("should handle authentication w/o token", () => {
    // I'm not sure this is a valid scenario, but it was needed for coverage
    const item = cloneObject(documentItem);
    const result = getPortalUrls(item, { authentication: {} } as unknown);
    expect(result.portalHome.indexOf("token")).toBe(-1);
  });
});
