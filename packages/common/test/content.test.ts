import { IItem } from "@esri/arcgis-rest-portal";
import { ILayerDefinition } from "@esri/arcgis-rest-types";
import {
  DatasetResource,
  datasetToContent,
  datasetToItem,
  getTypes,
  normalizeItemType,
  isFeatureService,
  getLayerIdFromUrl,
  getItemLayerId,
  getItemHubId,
  getContentIdentifier,
  isSlug,
  addContextToSlug,
  removeContextFromSlug,
  itemToContent,
  parseDatasetId,
  parseItemCategories,
  getFamily,
  setContentType,
  getContentTypeIcon,
  getContentTypeLabel,
} from "../src/content";
import {
  isProxiedCSV,
  setContentBoundary,
  parseISODateString,
  getItemSpatialReference,
  getAdditionalResources,
  extractRawResources,
  isDataSourceOfItem,
  getAdditionalResourceUrl,
  determineExtent,
  getHubRelativeUrl,
  extractFirstContact,
  getPublisherInfo,
  isSiteType,
} from "../src/content/_internal";
import { IModel } from "../src/types";
import {
  getProxyUrl,
  IHubContent,
  IHubRequestOptions,
  PublisherSource,
} from "../src";
import { cloneObject } from "../src/util";
import * as documentItem from "./mocks/items/document.json";
import * as documentsJson from "./mocks/datasets/document.json";
import * as featureLayerJson from "./mocks/datasets/feature-layer.json";

describe("getTypes", () => {
  it("can abort", () => {
    expect(getTypes()).toBe(undefined);
  });
  it("can get a list of types for a category", () => {
    expect(getTypes("site")).toEqual([
      "Hub Site Application",
      "Site Application",
    ]);
  });
});

describe("normalizeItemType", () => {
  it("can get type from item.type if typeKeywords is not defined", () => {
    expect(normalizeItemType({ type: "type from item" })).toEqual(
      "type from item"
    );
  });
  it("can get type from item.type without typeKeywords", () => {
    expect(normalizeItemType({ type: "Web Mapping Application" })).toEqual(
      "Web Mapping Application"
    );
  });
  it("normalizes sites", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubSite"],
      })
    ).toEqual("Hub Site Application");
    expect(
      normalizeItemType({ type: "Site Application", typeKeywords: [] })
    ).toEqual("Hub Site Application");
  });
  it("normalizes pages", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubPage"],
      })
    ).toEqual("Hub Page");
    expect(
      normalizeItemType({ type: "Site Page", typeKeywords: ["hubPage"] })
    ).toEqual("Hub Page");
  });
  it("normalizes initiative templates", () => {
    expect(
      normalizeItemType({
        type: "Hub Initiative",
        typeKeywords: ["hubInitiativeTemplate"],
      })
    ).toEqual("Hub Initiative Template");
  });
  it("normalizes solution templates", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubSolutionTemplate"],
      })
    ).toEqual("Solution");
  });
  it("can work with blank inputs", () => {
    expect(normalizeItemType()).toBe(undefined);
  });
});

describe("isFeatureService", () => {
  it("returns true when the type is Feature Service", () => {
    expect(isFeatureService("Feature Service")).toBe(true);
    expect(isFeatureService("feature service")).toBe(true);
  });
  it("returns false when the type is not Feature Service", () => {
    expect(isFeatureService("Map Service")).toBe(false);
  });
});

describe("getLayerIdFromUrl", () => {
  it("returns layerId when present", () => {
    expect(
      getLayerIdFromUrl(
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer/0"
      )
    ).toBe("0");
  });
  it("returns undefined when not present", () => {
    expect(
      getLayerIdFromUrl(
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer"
      )
    ).toBe(null);
  });
});

describe("getLayerIdFromItem", () => {
  it("returns '0' when typeKeywords includes 'Singlelayer'", () => {
    const item: any = {
      type: "Feature Service",
      url: "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer",
      typeKeywords: [
        "ArcGIS Server",
        "Data",
        "Feature Access",
        "Feature Service",
        "Metadata",
        "Service",
        "Singlelayer",
        "Hosted Service",
      ],
    };
    expect(getItemLayerId(item)).toBe("0");
  });
});

describe("getItemHubId", () => {
  let layerItem: any;
  beforeEach(() => {
    layerItem = {
      id: "4ef",
      access: "shared",
      type: "Feature Service",
      url: "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer/42",
    };
  });
  it("returns undefined when not public", () => {
    expect(getItemHubId(layerItem)).toBeFalsy();
  });
  it("returns itemId_layerId when public layer", () => {
    layerItem.access = "public";
    expect(getItemHubId(layerItem)).toBe("4ef_42");
  });
  it("returns item id when public non-layer", () => {
    const item: any = {
      id: "3ec",
      access: "public",
    };
    expect(getItemHubId(item)).toBe("3ec");
  });
});

describe("getContentIdentifier", () => {
  it("returns content id when content family is 'template'", () => {
    const template = {
      id: "template_id",
      family: "template",
    } as IHubContent;

    const result = getContentIdentifier(template);
    expect(result).toBe("template_id");
  });
  it("returns content id when content family is 'feedback'", () => {
    const survey = {
      id: "survey_id",
      family: "feedback",
    } as IHubContent;

    const result = getContentIdentifier(survey);
    expect(result).toBe("survey_id");
  });
  it("returns content id when content type is 'Hub Page' and no site is provided", () => {
    const page = {
      id: "page_id",
      type: "Hub Page",
    } as IHubContent;

    const result = getContentIdentifier(page);
    expect(result).toBe("page_id");
  });
  it("returns content id when content type is 'Site Page' and no site is provided", () => {
    const page = {
      id: "page_id",
      type: "Site Page",
    } as IHubContent;

    const result = getContentIdentifier(page);
    expect(result).toBe("page_id");
  });
  it("returns content id when content is a page but the site has no pages", () => {
    const page = {
      id: "page_id",
      type: "Site Page",
    } as IHubContent;
    const site: any = { data: { values: {} } };

    const result = getContentIdentifier(page, site);
    expect(result).toBe("page_id");
  });
  it("returns content id when content is a page but is not one of the site's pages", () => {
    const page = {
      id: "page_id",
      type: "Site Page",
    } as IHubContent;
    const site: any = {
      data: {
        values: {
          pages: [
            {
              id: "another_page_id",
            },
          ],
        },
      },
    };

    const result = getContentIdentifier(page, site);
    expect(result).toBe("page_id");
  });

  it("returns the site's page slug when content is one of the site's pages", () => {
    const page = {
      id: "page_id",
      type: "Site Page",
    } as IHubContent;
    const site: any = {
      data: {
        values: {
          pages: [
            {
              id: "page_id",
              slug: "page_slug",
            },
          ],
        },
      },
    };

    const result = getContentIdentifier(page, site);
    expect(result).toBe("page_slug");
  });

  it("returns the full slug of other types of content when no site is passed in", () => {
    const collection = {
      id: "collection_id",
      type: "Csv Collection",
      slug: "full::slug",
    } as IHubContent;

    const result = getContentIdentifier(collection);
    expect(result).toBe("full::slug");
  });

  it("returns the full slug of other types of content when umbrella site is passed in", () => {
    const collection = {
      id: "collection_id",
      type: "Csv Collection",
      slug: "full::slug",
    } as IHubContent;
    const site: any = {
      data: {
        values: {
          isUmbrella: true,
        },
      },
    };

    const result = getContentIdentifier(collection, site);
    expect(result).toBe("full::slug");
  });

  it("returns the full slug of other types of content when site orgKey is different from the content's slug's prefix", () => {
    const collection = {
      id: "collection_id",
      type: "Csv Collection",
      slug: "full::slug",
    } as IHubContent;
    const site: any = {
      data: { values: {} },
      domainInfo: {
        orgKey: "other",
      },
    };

    const result = getContentIdentifier(collection, site);
    expect(result).toBe("full::slug");
  });

  it("returns the shortened slug of other types of content when site orgKey is the same as the content's slug's prefix", () => {
    const collection = {
      id: "collection_id",
      type: "Csv Collection",
      slug: "full::slug",
    } as IHubContent;
    const site: any = {
      data: { values: {} },
      domainInfo: {
        orgKey: "full",
      },
    };

    const result = getContentIdentifier(collection, site);
    expect(result).toBe("slug");
  });

  it("returns the hubId of other types of content when the content has no slug", () => {
    const collection = {
      id: "collection_id",
      type: "Csv Collection",
      hubId: "collection_hub_id",
    } as IHubContent;

    const result = getContentIdentifier(collection);
    expect(result).toBe("collection_hub_id");
  });

  it("returns the id of other types of content when the content has no slug and no hubId", () => {
    const webMap = {
      id: "web_map_id",
      type: "Web Map",
    } as IHubContent;

    const result = getContentIdentifier(webMap);
    expect(result).toBe("web_map_id");
  });
});

describe("Slug Helpers", () => {
  const title = "foo-bar";
  const orgKey = "org-key";
  const slugWithContext = `${orgKey}::${title}`;
  describe("isSlug", function () {
    it("returns false when identifier is undefined", () => {
      const result = isSlug(undefined);
      expect(result).toBe(false);
    });
    it("returns false when identifier is an item id", () => {
      const result = isSlug("7a153563b0c74f7eb2b3eae8a66f2fbb");
      expect(result).toBe(false);
    });
    it("returns true when identifier is a slug w/o orgKey", () => {
      const result = isSlug("foo-bar");
      expect(result).toBe(true);
    });
    it("returns true when identifier is a slug w/ orgKey", () => {
      const result = isSlug("org-key::foo-bar");
      expect(result).toBe(true);
    });
  });
  describe("addContextToSlug", () => {
    it("appends the context to slug without context", () => {
      const slug = addContextToSlug(title, orgKey);
      expect(slug).toBe(slugWithContext);
    });
    it("returns the slug as is when it already has context", () => {
      const slug = addContextToSlug(slugWithContext, orgKey);
      expect(slug).toBe(slugWithContext);
    });
    it("returns the slug as is when no context is passed", () => {
      const slug = addContextToSlug(slugWithContext, undefined);
      expect(slug).toBe(slugWithContext);
    });
    it("returns the slug as is when it has a different context", () => {
      const slug = addContextToSlug(slugWithContext, "other-org");
      expect(slug).toBe(slugWithContext);
    });
  });
  describe("removeContextFromSlug", () => {
    it("removes context when present", () => {
      const slug = removeContextFromSlug(slugWithContext, orgKey);
      expect(slug).toBe(title);
    });
    it("doesn't remove context when not present", () => {
      const slug = removeContextFromSlug(slugWithContext, "other-org");
      expect(slug).toBe(slugWithContext);
    });
    it("correctly matches on full context", () => {
      const slugOne = removeContextFromSlug(slugWithContext, orgKey);
      expect(slugOne).toBe(title);
      const slugTwo = removeContextFromSlug(
        slugWithContext,
        `another-${orgKey}`
      );
      expect(slugTwo).toBe(slugWithContext);
    });
  });
});

describe("get item family", () => {
  it("returns dataset for image service", () => {
    expect(getFamily("Image Service")).toBe("dataset");
  });
  it("returns map for feature service and raster layer", () => {
    expect(getFamily("Feature Service")).toBe("map");
    expect(getFamily("Raster Layer")).toBe("map");
  });
  it("returns document for excel", () => {
    expect(getFamily("Microsoft Excel")).toBe("document");
  });
  it("returns template for solution", () => {
    expect(getFamily("Solution")).toBe("template");
  });
  it("returns project for hub project", () => {
    expect(getFamily("Hub Project")).toBe("project");
  });
  it("returns content for other specific types", () => {
    expect(getFamily("CAD Drawing")).toBe("content");
    expect(getFamily("Feature Collection Template")).toBe("content");
    expect(getFamily("Report Template")).toBe("content");
  });
  it("returns content for collection other", () => {
    expect(getFamily("360 VR Experience")).toBe("content");
  });
});

describe("parse item categories", () => {
  it("parses the categories", () => {
    const categories = [
      "/Categories/Boundaries",
      "/Categories/Planning and cadastre/Property records",
      "/Categories/Structure",
    ];
    expect(parseItemCategories(categories)).toEqual([
      "Boundaries",
      "Planning and cadastre",
      "Property records",
      "Structure",
    ]);
  });
  it("doesn't blow up with undefined", () => {
    expect(() => parseItemCategories(undefined)).not.toThrow();
  });
});

describe("item to content", () => {
  let item: IItem;
  beforeEach(() => {
    item = cloneObject(documentItem) as IItem;
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
        links: [{ url: "https://foo.com" }],
      };
      const content = itemToContent(item);
      expect(content.actionLinks).toEqual(item.properties.links);
    });
  });
  it("has a reference to the item", () => {
    const content = itemToContent(item);
    expect(content.item).toEqual(item);
  });
  it("gets relative url from type and family", () => {
    const content = itemToContent(item);
    expect(content.urls.relative).toBe(`/documents/${content.id}`);
  });
  // NOTE: other use cases (including when a portal is passed)
  // are covered by getContentFromPortal() tests
});
describe("parseDatasetId", function () {
  it("returns undefined", () => {
    const result = parseDatasetId(undefined);
    expect(result).toEqual({ itemId: undefined, layerId: undefined });
  });
  it("parse item id", () => {
    const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb");
    expect(result).toEqual({
      itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
      layerId: undefined,
    });
  });
  it("parse item id and layer id", () => {
    const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb_0");
    expect(result).toEqual({
      itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
      layerId: "0",
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
  it("handles when no itemModified", () => {
    // NOTE: I expect that the API always returns itemModified
    // so I don't know if this ever happens
    const dataset = cloneObject(featureLayerJson.data) as DatasetResource;
    const attributes = dataset.attributes;
    attributes.modified = 1623232000295;
    delete attributes.itemModified;
    let item = datasetToItem(dataset);
    expect(item.modified).toBe(
      attributes.modified,
      "returns modified when provenance is item"
    );
    attributes.modifiedProvenance = "layer.editingInfo.lastEditDate";
    item = datasetToItem(dataset);
    expect(item.modified).toBeFalsy(
      "is undefined when provenance is layer.editingInfo"
    );
  });
  // NOTE: other use cases are covered by getContent() tests
});
describe("dataset to content", () => {
  it("has a reference to the item", () => {
    const dataset = cloneObject(documentsJson.data) as DatasetResource;
    const content = datasetToContent(dataset);
    expect(content.item).toEqual(datasetToItem(dataset));
  });
  it("has enriched updatedDate", () => {
    const dataset = cloneObject(featureLayerJson.data) as DatasetResource;
    const attributes = dataset.attributes;
    // simulate API returning date the layer was last modified
    // instead of the date the item was last modified
    const lastEditDate = 1623232000295;
    const editingInfo = { lastEditDate };
    attributes.modified = lastEditDate;
    attributes.modifiedProvenance = "layer.editingInfo.lastEditDate";
    attributes.layer.editingInfo = editingInfo;
    // NOTE: the above 3 lines help emulate what the Hub API would return
    // but only the following line is needed
    attributes.layers[0].editingInfo = editingInfo;
    const content = datasetToContent(dataset);
    expect(content.modified).toBe(attributes.modified);
    expect(content.updatedDate).toEqual(new Date(attributes.modified));
    expect(content.updatedDateSource).toBe(attributes.modifiedProvenance);
  });
  it("has org", () => {
    const dataset = cloneObject(featureLayerJson.data) as DatasetResource;
    const {
      orgId: id,
      orgExtent: extent,
      orgName: name,
      organization,
    } = dataset.attributes;
    let content = datasetToContent(dataset);
    expect(content.org).toEqual({ id, extent, name });
    delete dataset.attributes.orgName;
    content = datasetToContent(dataset);
    expect(content.org).toEqual(
      { id, extent, name: organization },
      "name falls back to organization"
    );
  });
  it("only uses enrichment attributes when they exist", () => {
    const dataset = cloneObject(documentsJson.data) as DatasetResource;
    // NOTE: I don't necessarily expect the API to return w/o these
    // but our code depends on them, this test is mostly here for coverage
    delete dataset.attributes.searchDescription;
    delete dataset.attributes.errors;
    const content = datasetToContent(dataset);
    expect(content.summary).toBe(dataset.attributes.snippet);
    expect(content.extent).toBeUndefined();
    // NOTE: the document JSON does not have org attributes
    expect(content.org).toBeUndefined();
  });
  it("has extent returned from hub API", () => {
    const dataset = cloneObject(featureLayerJson.data) as DatasetResource;
    const content = datasetToContent(dataset);
    expect(content.extent).toEqual(dataset.attributes.extent.coordinates);
  });
  // NOTE: other use cases are covered by getContent() tests
});
describe("setContentType", () => {
  // NOTE: this test is meant to verify that normalizedType
  // is passed into getFamily(), not the raw type.
  it("Sets the family based on the normalizedType", () => {
    const oldInitiativeTemplate = {
      identifier: "9001",
      item: {
        type: "Hub Initiative",
        typeKeywords: ["hubInitiativeTemplate"],
      },
    } as unknown as IHubContent;

    const updated = setContentType(oldInitiativeTemplate, "Hub Initiative");
    expect(updated.family).toBe("template");
  });
  describe("getContentTypeIcon", () => {
    it("sets content type icons", () => {
      expect(getContentTypeIcon("Application")).toEqual("web");
      expect(getContentTypeIcon("Feature Service")).toEqual("collection");
      expect(getContentTypeIcon("Mobile Application")).toEqual("mobile");
      expect(getContentTypeIcon("Web Map")).toEqual("map");
      expect(getContentTypeIcon("Hub Project")).toEqual("projects");
    });
    it("sets non-existing type icon to file", () => {
      expect(getContentTypeIcon("fooBar")).toEqual("file");
    });
  });
  describe("getContentTypeLabel", () => {
    it("sets content type label to the normalized type if is not proxied", () => {
      expect(getContentTypeLabel("Application", false)).toEqual("application");
    });
    it("sets content type label to CSV if is proxied", () => {
      expect(getContentTypeLabel("PDF", true)).toEqual("CSV");
    });
    it("returns an empty string if no args???", () => {
      // I'm just here for the coverage
      expect(getContentTypeLabel(undefined, false)).toEqual("");
    });
  });
});

describe("getProxyUrl", () => {
  it("returns undefined when item cannot be a proxied csv", () => {
    const item = {
      access: "private",
      type: "CSV",
      size: 500000,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "https://opendata.arcgis.com",
    };

    const url = getProxyUrl(item, requestOptions);
    expect(url).toBeUndefined();
  });

  it("returns url when item is a proxied csv", () => {
    const item = {
      access: "public",
      type: "CSV",
      size: 500000,
      id: 0,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "https://opendata.arcgis.com",
    };

    const url = getProxyUrl(item, requestOptions);
    expect(url).toBe(
      "https://opendata.arcgis.com/datasets/0_0/FeatureServer/0"
    );
  });
});

// the tests below of internal functions are
// usually only added to get to 100% coverage
describe("internal", () => {
  describe("setContentBoundary", () => {
    it("sets boundary to none", () => {
      const content = setContentBoundary(itemToContent(documentItem), "none");
      expect(content.boundary).toEqual({
        provenance: "none",
        geometry: null,
      });
    });
  });

  describe("isProxiedCSV", () => {
    it("returns false when in a portal environment", () => {
      const item = {
        access: "public",
        type: "CSV",
        size: 9001,
      } as unknown as IItem;

      const requestOptions: IHubRequestOptions = {
        isPortal: true,
      };

      expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
    });

    it("returns false when access is not public", () => {
      const item = {
        access: "private",
        type: "CSV",
        size: 9001,
      } as unknown as IItem;

      const requestOptions: IHubRequestOptions = {
        isPortal: false,
      };

      expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
    });

    it("returns false when type is not CSV", () => {
      const item = {
        access: "public",
        type: "Feature Service",
      } as unknown as IItem;

      const requestOptions: IHubRequestOptions = {
        isPortal: false,
      };

      expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
    });

    it("returns false when size is greater than the max allowed", () => {
      const item = {
        access: "public",
        type: "CSV",
        size: 5000001,
      } as unknown as IItem;

      const requestOptions: IHubRequestOptions = {
        isPortal: false,
      };

      expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
    });

    it("returns true when the item is a proxied csv", () => {
      const item = {
        access: "public",
        type: "CSV",
        size: 500000,
      } as unknown as IItem;

      const requestOptions: IHubRequestOptions = {
        isPortal: false,
      };

      expect(isProxiedCSV(item, requestOptions)).toBeTruthy();
    });
  });

  describe("parseISODateString", () => {
    it("should parse various date strings properly", () => {
      const expectations = [
        {
          dateString: "2018",
          result: { date: new Date(2018, 0, 1), precision: "year" },
        },
        {
          dateString: "2018-02",
          result: { date: new Date(2018, 1, 1), precision: "month" },
        },
        {
          dateString: "2018-02-07",
          result: { date: new Date(2018, 1, 7), precision: "day" },
        },
        {
          dateString: "2018-02-07T16:30",
          result: { date: new Date("2018-02-07T16:30"), precision: "time" },
        },
        {
          dateString: "02/07/1970",
          result: { date: new Date("02/07/1970"), precision: "day" },
        },
      ];
      expectations.forEach((expectation) => {
        const result = parseISODateString(expectation.dateString);
        expect(result.date).toEqual(expectation.result.date);
        expect(result.precision).toEqual(expectation.result.precision);
      });
    });

    it("should return undefined when provided an unsupported date format", () => {
      const result = parseISODateString("2018-02-07T16");
      expect(result).toBe(undefined);
    });
  });

  describe("getItemSpatialReference", () => {
    it("should handle wkt name", () => {
      const spatialReference =
        "NAD_1983_HARN_StatePlane_Hawaii_3_FIPS_5103_Feet";
      const item = { spatialReference } as unknown as IItem;
      const result = getItemSpatialReference(item);
      expect(result).toBeNull();
    });
  });

  describe("getHubRelativeUrl", () => {
    const identifier = "a-slug";
    it("should handle a family that does not have a puralized route", () => {
      // 'report template' should be in the 'content' family
      const result = getHubRelativeUrl("report template", identifier);
      expect(result).toBe(`/content/${identifier}`);
    });
    it("should handle initiative templates", () => {
      let result = getHubRelativeUrl("Hub Initiative", identifier, [
        "hubInitiativeTemplate",
      ]);
      expect(result).toBe(`/initiatives/templates/${identifier}/about`);
      result = getHubRelativeUrl("Hub Initiative Template", identifier);
      expect(result).toBe(`/initiatives/templates/${identifier}/about`);
    });
    it("should handle initiative items", () => {
      const result = getHubRelativeUrl("Hub Initiative", identifier);
      expect(result).toBe(`/content/${identifier}`);
    });
    it("should handle solution templates", () => {
      let result = getHubRelativeUrl("Web Mapping Application", identifier, [
        "hubSolutionTemplate",
      ]);
      expect(result).toBe(`/templates/${identifier}/about`);
      result = getHubRelativeUrl("Web Mapping Application", identifier);
      expect(result).toBe(`/apps/${identifier}`);
      result = getHubRelativeUrl("Solution", identifier);
      expect(result).toBe(`/templates/${identifier}/about`);
      result = getHubRelativeUrl("Solution", identifier, ["Deployed"]);
      expect(result).toBe(`/content/${identifier}/about`);
    });
    it("should handle feedback", () => {
      const result = getHubRelativeUrl("Form", identifier);
      expect(result).toBe(`/feedback/surveys/${identifier}`);
    });
  });
  describe("isSiteType", () => {
    it("Should return false for web mapping application with no type keywords", () => {
      expect(isSiteType("Web Mapping Application")).toBeFalsy();
    });
    it("Should return true for a Hub Site Application", () => {
      expect(isSiteType("Hub Site Application")).toBeTruthy();
    });
  });
});

// Gets branches not covered in compose.test.ts
describe("getAdditionalResources", () => {
  const item: any = {
    type: "Feature Service",
    url: "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer",
  };

  // Partially covers extractRawResources
  it("returns null when no metadata is passed in", () => {
    const result = getAdditionalResources(item);
    expect(result).toBeNull();
  });
});

// Gets branches not covered in compose.test.ts
describe("extractRawResources", () => {
  it("handles when onLineSrc is undefined", () => {
    const metadata = {
      metadata: {
        distInfo: {
          distTranOps: {},
        },
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toBeNull();
  });

  it("handles when onLineSrc is an object", () => {
    const metadata = {
      metadata: {
        distInfo: {
          distTranOps: {
            onLineSrc: {
              orName: "Resource Name",
              linkage: "resource-url",
            },
          },
        },
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
    ]);
  });

  it("handles when onLineSrc is a multi-element array", () => {
    const metadata = {
      metadata: {
        distInfo: {
          distTranOps: {
            onLineSrc: [
              {
                orName: "Resource Name",
                linkage: "resource-url",
              },
              {
                orName: "Other Resource Name",
                linkage: "other-resource-url",
              },
            ],
          },
        },
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
      {
        orName: "Other Resource Name",
        linkage: "other-resource-url",
      },
    ]);
  });

  it("handles when distTranOps is undefined", () => {
    const metadata = {
      metadata: {
        distInfo: {},
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toBeNull();
  });

  it("handles when distTranOps is a single item array", () => {
    const metadata = {
      metadata: {
        distInfo: {
          distTranOps: [
            {
              onLineSrc: {
                orName: "Resource Name",
                linkage: "resource-url",
              },
            },
          ],
        },
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
    ]);
  });

  it("handles when distTranOps is a multi item array", () => {
    const metadata = {
      metadata: {
        distInfo: {
          distTranOps: [
            {
              onLineSrc: {
                orName: "Resource Name",
                linkage: "resource-url",
              },
            },
            {
              onLineSrc: {
                orName: "Other Resource Name",
                linkage: "other-resource-url",
              },
            },
          ],
        },
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
      {
        orName: "Other Resource Name",
        linkage: "other-resource-url",
      },
    ]);
  });

  it("handles when distInfo is a single item array", () => {
    const metadata = {
      metadata: {
        distInfo: [
          {
            distTranOps: {
              onLineSrc: {
                orName: "Resource Name",
                linkage: "resource-url",
              },
            },
          },
        ],
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
    ]);
  });

  it("handles when distInfo is a multi item array", () => {
    const metadata = {
      metadata: {
        distInfo: [
          {
            distTranOps: {
              onLineSrc: {
                orName: "Resource Name",
                linkage: "resource-url",
              },
            },
          },
          {
            distTranOps: {
              onLineSrc: {
                orName: "Other Resource Name",
                linkage: "other-resource-url",
              },
            },
          },
        ],
      },
    };
    const result = extractRawResources(metadata);
    expect(result).toEqual([
      {
        orName: "Resource Name",
        linkage: "resource-url",
      },
      {
        orName: "Other Resource Name",
        linkage: "other-resource-url",
      },
    ]);
  });
});

// Gets branches not covered in compose.test.ts
// Partially covers isDataSourceOfItem
describe("getAdditionalResourceUrl", () => {
  const serviceUrl =
    "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer";
  const item = {
    type: "Feature Service",
    url: serviceUrl,
  } as unknown as IItem;
  it("appends token onto preexisting query string when resource points to the item's data source", () => {
    const resourceUrl = `${serviceUrl}/0?my-flag=true`;
    const resource = { linkage: resourceUrl };
    const requestOptions = {
      authentication: {
        token: "my-token",
      },
    } as unknown as IHubRequestOptions;

    const result = getAdditionalResourceUrl(resource, item, requestOptions);
    expect(result).toEqual(`${resourceUrl}&token=my-token`);
  });
  it("appends token onto new query string when resource points to the item's data source", () => {
    const resourceUrl = `${serviceUrl}/0`;
    const resource = { linkage: resourceUrl };
    const requestOptions = {
      authentication: {
        token: "my-token",
      },
    } as unknown as IHubRequestOptions;

    const result = getAdditionalResourceUrl(resource, item, requestOptions);
    expect(result).toEqual(`${resourceUrl}?token=my-token`);
  });
  it("does not append token when resource isn't the item's data source", () => {
    const resourceUrl = "https://google.com";
    const resource = { linkage: resourceUrl };
    const requestOptions = {
      authentication: {
        token: "my-token",
      },
    } as unknown as IHubRequestOptions;

    const result = getAdditionalResourceUrl(resource, item, requestOptions);
    expect(result).toEqual(resourceUrl);
  });
});

// Gets branches not covered in compose.test.ts
describe("isDataSourceOfItem", () => {
  it("returns false when the item has no url", () => {
    const item = { type: "csv" } as unknown as IItem;
    const resource = { linkage: "my-link" };
    expect(isDataSourceOfItem(resource, item)).toBeFalsy();
  });
});

// Gets branches not covered in compose.test.ts
describe("determineExtent", () => {
  it("returns item extent when valid bbox", () => {
    const item = {
      extent: [
        [0, 1],
        [1, 0],
      ],
    } as unknown as IItem;
    const result = determineExtent(item);
    expect(result).toEqual(item.extent);
  });
  it("returns extent enrichment coordinates if is valid bbox and item extent isn't a valid bbox", () => {
    const item = {
      extent: [],
    } as unknown as IItem;
    const extentEnrichment = {
      coordinates: [
        [0, 1],
        [1, 0],
      ],
      type: "envelope",
    };
    const result = determineExtent(item, extentEnrichment);
    expect(result).toEqual(extentEnrichment.coordinates);
  });
  it("returns layer extent as bbox when spatial ref is 4326 and both item extent and extent enrichment aren't valid", () => {
    const item = {
      extent: [],
    } as unknown as IItem;
    const extentEnrichment = {};
    const layer = {
      extent: {
        spatialReference: {
          wkid: 4326,
        },
        xmin: 1,
        xmax: 2,
        ymin: 3,
        ymax: 4,
      },
    } as unknown as ILayerDefinition;
    const result = determineExtent(item, extentEnrichment, layer);
    expect(result).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });
});

// Gets branches not covered in compose.test.ts
describe("extractFirstContact", () => {
  it("handles when the path points to a contact array", () => {
    const contact1 = {
      rpIndName: "contact1",
      rpOrgName: "org1",
    };
    const contact2 = {
      rpIndName: "contact2",
      rpOrgName: "org2",
    };
    const metadata = {
      metadata: {
        path: [contact1, contact2],
      },
    };
    expect(extractFirstContact(metadata, "metadata.path")).toEqual({
      individualName: contact1.rpIndName,
      organizationName: contact1.rpOrgName,
    });
  });
});

// Gets branches not covered in compose.test.ts
describe("getPublisherInfo", () => {
  it("correctly reports when no info is available", () => {
    const item = { id: "abc", access: "public" } as unknown as IItem;
    const result = getPublisherInfo(item, null, null, null);
    expect(result).toEqual({
      nameSource: PublisherSource.None,
      organizationSource: PublisherSource.None,
      isExternal: false,
    });
  });

  it("correctly reports when no info is available and the item is external", () => {
    const item = { id: "abc", access: "private" } as unknown as IItem;
    const result = getPublisherInfo(item, null, null, null);
    expect(result).toEqual({
      nameSource: PublisherSource.None,
      organizationSource: PublisherSource.None,
      isExternal: true,
    });
  });

  it("correctly reports citation contact info", () => {
    const item = { id: "abc" } as unknown as IItem;
    const metadata = {
      metadata: {
        // Metadata Info
        mdContact: {
          rpIndName: "Metadata Name",
          rpOrgName: "Metadata Org",
        },
        dataIdInfo: {
          // Citation Info
          idCitation: {
            citRespParty: {
              rpIndName: "Citation Name",
              rpOrgName: "Citation Org",
            },
          },
          // Resource Info
          idPoC: {
            rpIndName: "Resource Name",
            rpOrgName: "Resource Org",
          },
        },
      },
    };
    const ownerUser = {
      fullName: "Owner User",
      username: "username",
      orgId: "org_id",
    };
    const org = {
      id: "org_id",
      name: "Org Name",
    };
    const result = getPublisherInfo(item, metadata, org, ownerUser);
    expect(result).toEqual({
      name: "Citation Name",
      nameSource: PublisherSource.CitationContact,
      organization: "Citation Org",
      organizationSource: PublisherSource.CitationContact,
      isExternal: false,
    });
  });

  it("correctly reports resource contact info", () => {
    const item = { id: "abc" } as unknown as IItem;
    const metadata = {
      metadata: {
        // Metadata Info
        mdContact: {
          rpIndName: "Resource Name",
          rpOrgName: "Resource Org",
        },
        dataIdInfo: {
          // Resource Info
          idPoC: {
            rpIndName: "Resource Name",
            rpOrgName: "Resource Org",
          },
        },
      },
    };
    const ownerUser = {
      fullName: "Owner User",
      username: "username",
      orgId: "org_id",
    };
    const org = {
      id: "org_id",
      name: "Org Name",
    };
    const result = getPublisherInfo(item, metadata, org, ownerUser);
    expect(result).toEqual({
      name: "Resource Name",
      nameSource: PublisherSource.ResourceContact,
      organization: "Resource Org",
      organizationSource: PublisherSource.ResourceContact,
      isExternal: false,
    });
  });

  it("correctly reports metadata contact info", () => {
    const item = { id: "abc" } as unknown as IItem;
    const metadata = {
      metadata: {
        // Metadata Info
        mdContact: {
          rpIndName: "Metadata Name",
          rpOrgName: "Metadata Org",
        },
      },
    };
    const ownerUser = {
      fullName: "Owner User",
      username: "username",
      orgId: "org_id",
    };
    const org = {
      id: "org_id",
      name: "Org Name",
    };
    const result = getPublisherInfo(item, metadata, org, ownerUser);
    expect(result).toEqual({
      name: "Metadata Name",
      nameSource: PublisherSource.MetadataContact,
      organization: "Metadata Org",
      organizationSource: PublisherSource.MetadataContact,
      isExternal: false,
    });
  });

  it("correctly reports item owner / org info", () => {
    const item = { id: "abc" } as unknown as IItem;
    const ownerUser = {
      fullName: "Owner User",
      username: "username",
      orgId: "org_id",
    };
    const org = {
      id: "org_id",
      name: "Item Org Name",
    };
    const result = getPublisherInfo(item, null, org, ownerUser);
    expect(result).toEqual({
      name: "Owner User",
      username: "username",
      nameSource: PublisherSource.ItemOwner,
      organization: "Item Org Name",
      orgId: "org_id",
      organizationSource: PublisherSource.ItemOwner,
      isExternal: false,
    });
  });

  it("correctly reports mixed name and org info", () => {
    const item = { id: "abc" } as unknown as IItem;
    const metadata = {
      metadata: {
        // Metadata Info
        mdContact: {
          rpIndName: "Metadata Name",
          // note that metadata org name is omitted
        },
      },
    };
    const ownerUser = {
      fullName: "Owner User",
      username: "username",
      orgId: "org_id",
    };
    const org = {
      id: "org_id",
      name: "Org Name",
    };
    const result = getPublisherInfo(item, metadata, org, ownerUser);
    expect(result).toEqual({
      name: "Metadata Name",
      nameSource: PublisherSource.MetadataContact,
      organization: "Org Name",
      orgId: "org_id",
      organizationSource: PublisherSource.ItemOwner,
      isExternal: false,
    });
  });
});
