import { IItem } from "@esri/arcgis-rest-portal";
import { IPolygon } from "@esri/arcgis-rest-types";
import {
  DatasetResource,
  datasetToContent,
  datasetToItem,
  getTypes,
  getTypeCategories,
  normalizeItemType,
  isFeatureService,
  getLayerIdFromUrl,
  getItemLayerId,
  getItemHubId,
  getContentIdentifier,
  setContentSiteUrls,
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
  // deprecated, remove these at the next breaking change
  getCategory,
  getItemHubType,
} from "../src/content";
import { isProxiedCSV, setContentBoundary } from "../src/content/_internal";
import { IModel } from "../src/types";
import { getProxyUrl, IHubContent, IHubRequestOptions } from "../src";
import { cloneObject } from "../src/util";
import * as documentItem from "./mocks/items/document.json";
import * as mapServiceItem from "./mocks/items/map-service.json";
import * as documentsJson from "./mocks/datasets/document.json";
import * as featureLayerJson from "./mocks/datasets/feature-layer.json";

describe("getCategory", () => {
  it("returns 'app' for forms", () => {
    expect(getCategory("Form")).toBe("app");
  });
});

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

describe("getTypeCategories", () => {
  it("should return Other if category is undefined", () => {
    expect(getTypeCategories({ type: "unknown type" })).toEqual(["Other"]);
  });
  it("should return correct typeCategory if category is defined", () => {
    expect(
      getTypeCategories({
        type: "Web Mapping Application",
        typeKeywords: ["hubSite"],
      })
    ).toEqual(["Site"]);
  });
  it("can work with blank inputs", () => {
    expect(getTypeCategories()).toEqual(["Other"]);
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
  it("returns content for other specific types", () => {
    expect(getFamily("CAD Drawing")).toBe("content");
    expect(getFamily("Feature Collection Template")).toBe("content");
    expect(getFamily("Report Template")).toBe("content");
  });
  it("returns content for collection other", () => {
    expect(getFamily("360 VR Experience")).toBe("content");
  });
});

describe("get item hub type", () => {
  it("normalizes item", () => {
    expect(
      getItemHubType({
        type: "Hub Initiative",
        typeKeywords: ["hubInitiativeTemplate"],
      } as IItem)
    ).toBe("template");
  });
  it("works with just type", () => {
    expect(getItemHubType("Form")).toBe("feedback");
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
  it("handles invalid item boundary set to item extent but item has no extent", () => {
    // configure item to specify using item extent as boundary
    // even though the item has an empty extent
    const properties = { boundary: "item" };
    const content = itemToContent({ ...item, properties });
    const boundary = content.boundary;
    expect(boundary.geometry).toBeNull();
    expect(boundary.provenance).toBe("item");
  });
  it("has a boundary when the item has a valid extent", () => {
    item = cloneObject(mapServiceItem) as IItem;
    const content = itemToContent(item);
    const geometry: IPolygon = {
      rings: [
        [
          [-2.732, 53.4452],
          [-2.4139, 53.4452],
          [-2.4139, 53.6093],
          [-2.732, 53.6093],
          [-2.732, 53.4452],
        ],
      ],
      spatialReference: {
        wkid: 4326,
      },
    };
    expect(content.boundary).toEqual({ geometry, provenance: "item" });
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
    attributes.modified = 1623232000295;
    attributes.modifiedProvenance = "layer.editingInfo.lastEditDate";
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
    expect(content.extent).toEqual([]);
    // NOTE: the document JSON does not have org attributes
    expect(content.org).toBeUndefined();
  });
  // NOTE: other use cases are covered by getContent() tests
});
describe("setContentType", () => {
  describe("Relative Urls", () => {
    // NOTE: these tests are just the most expedient way
    // to get coverage for getContentRelativeUrl() w/o exporting it
    let content: IHubContent;
    beforeEach(() => {
      content = itemToContent(documentItem);
    });
    it("sets relative url for feedback", () => {
      const updated = setContentType(content, "Form");
      expect(updated.urls.relative).toBe(
        `/feedback/surveys/${content.identifier}`
      );
    });
    it("sets relative url for deployed solution", () => {
      content.typeKeywords.push("Deployed");
      const updated = setContentType(content, "Solution");
      expect(updated.urls.relative).toBe(
        `/templates/${content.identifier}/about`
      );
    });
  });
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
      expect(getContentTypeLabel("Application", true)).toEqual("CSV");
    });
  });
});
describe("setContentSiteUrls", () => {
  let site: IModel;
  beforeEach(() => {
    // emulating a site item
    const url = "https://my-site-org.hub.arcgis.com";
    const item = { ...documentItem, type: "Hub Site", url };
    site = {
      item,
      data: {},
    };
  });
  it("links to page using site's slug for page when page is linked to site", () => {
    // emulate linking a page to the site
    const pageItem = { ...documentItem, type: "Hub Page" };
    const slug = "page-slug-for-site";
    site.data.values = {
      pages: [{ id: pageItem.id, slug }],
    };

    // get the site URL
    const content = itemToContent(pageItem);
    const result = setContentSiteUrls(content, site);

    expect(result.urls.site).toEqual(`${site.item.url}/pages/${slug}`);
  });
  it("links to page on documents route when page is NOT linked to site", () => {
    // emulate a page item
    const pageItem = { ...documentItem, type: "Hub Page" };

    // get the site URL
    const content = itemToContent(pageItem);
    const result = setContentSiteUrls(content, site);

    expect(result.urls.site).toEqual(
      `${site.item.url}/pages/${content.identifier}`
    );
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
});
