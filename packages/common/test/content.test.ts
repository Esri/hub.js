import {
  getCategory,
  getCollection,
  getTypes,
  getTypeCategories,
  normalizeItemType,
  isFeatureService,
  getLayerIdFromUrl,
  getItemLayerId,
  getItemHubId,
  getContentIdentifier,
  isSlug,
  addContextToSlug,
  removeContextFromSlug,
} from "../src/content";
import { IHubContent } from "../src/types";

describe("getCollection", () => {
  it("can abort", () => {
    expect(getCollection()).toBe(undefined);
  });

  it("can retrieve a single category", () => {
    expect(getCollection("Feature Layer")).toBe("dataset");
  });

  it("can retrieve a single category (from cache)", () => {
    expect(getCollection("Feature Layer")).toBe("dataset");
  });
});

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
