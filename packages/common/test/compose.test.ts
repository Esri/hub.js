import { ILayerDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { cloneObject, composeContent } from "../src";
import * as documentItem from "./mocks/items/document.json";

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
  });
  describe("with layers", () => {
    const layers = [
      {
        id: 0,
        name: "layer0",
        type: "Feature Layer",
        description: "Layer description",
        capabilities: "Query",
      },
      {
        id: 1,
        name: "layer1",
        type: "Feature Layer",
        description: "",
        capabilities: "Query",
      },
      {
        id: 2,
        name: "table2",
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
      expect(layerContent.title).toEqual(layer.name, "should set title");
      expect(layerContent.description).toEqual(
        layer.description,
        "should set description"
      );
      expect(layerContent.summary).toEqual(
        layer.description,
        "should set summary"
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
      expect(layerContent.title).toEqual(layer.name, "should set title");
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
      expect(layerContent.title).toEqual(item.title, "should not set title");
      expect(layerContent.description).toEqual(
        item.description,
        "should not set description"
      );
      expect(layerContent.summary).toEqual(
        item.snippet,
        "should not set summary"
      );
      expect(layerContent.url).toEqual(item.url, "should not set url");
    });
    // NOTE: we may want to re-implement the tests in enrichments.test.ts
    // that were introduced in https://github.com/Esri/hub.js/pull/633
    // if we discover that those buggy items cause problems
  });
});
