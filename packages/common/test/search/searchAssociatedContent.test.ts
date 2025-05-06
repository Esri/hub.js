import { HubEntity } from "../../src/core/types/HubEntity";
import HubError from "../../src/HubError";
import * as getOgcApiDefinitionModule from "../../src/search/_internal/commonHelpers/getOgcApiDefinition";
import * as searchOgcItemsModule from "../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems";
import { searchAssociatedContent } from "../../src/search/searchAssociatedContent";
import { ISearchAssociatedContentOptions } from "../../src/search/types/types";

describe("searchAssociatedContent", () => {
  let mockGetOgcApiDefinition: jasmine.Spy;
  let mockSearchOgcItems: jasmine.Spy;

  beforeEach(() => {
    mockGetOgcApiDefinition = spyOn(
      getOgcApiDefinitionModule,
      "getOgcApiDefinition"
    ).and.returnValue({
      type: "arcgis-hub",
      url: "https://example.com/path/to/ogc",
    });

    mockSearchOgcItems = spyOn(
      searchOgcItemsModule,
      "searchOgcItems"
    ).and.returnValue(Promise.resolve({ results: [], total: 0 }));
  });

  it("throws an error if entity is not item-based", async () => {
    const options: ISearchAssociatedContentOptions = {
      entity: { id: "123", type: "Event" } as unknown as HubEntity,
      association: "related",
      requestOptions: {},
      scope: { targetEntity: "item", filters: [] },
    };
    try {
      await searchAssociatedContent(options);
      fail("Expected HubError to be thrown");
    } catch (error) {
      const expectedError = new HubError(
        "searchAssociatedContent",
        'associated content is not supported for entity type "event"'
      );
      expect(error).toEqual(expectedError);
    }
  });

  it("throws an error if targetEntity is not 'item'", async () => {
    const options: ISearchAssociatedContentOptions = {
      entity: { id: "123", type: "Feature Service" } as unknown as HubEntity,
      association: "related",
      requestOptions: {},
      scope: { targetEntity: "group", filters: [] },
    };

    try {
      await searchAssociatedContent(options);
      fail("Expected HubError to be thrown");
    } catch (error) {
      const expectedError = new HubError(
        "searchAssociatedContent",
        'associated content scope does not support targetEntity "group"'
      );
      expect(error).toEqual(expectedError);
    }
  });

  it("throws an error if association is 'connected' and layerId is not provided", async () => {
    const options: ISearchAssociatedContentOptions = {
      entity: { id: "123", type: "Feature Service" } as unknown as HubEntity,
      association: "connected",
      requestOptions: {},
      scope: { targetEntity: "item", filters: [] },
    };
    try {
      await searchAssociatedContent(options);
      fail("Expected HubError to be thrown");
    } catch (error) {
      const expectedError = new HubError(
        "searchAssociatedContent",
        '"layerId" is required for searching "connected" content'
      );
      expect(error).toEqual(expectedError);
    }
  });

  it("constructs the correct OGC API URL and calls searchOgcItems", async () => {
    const options: ISearchAssociatedContentOptions = {
      entity: { id: "123", type: "Feature Service" } as unknown as HubEntity,
      association: "related",
      requestOptions: {},
      scope: { targetEntity: "item", filters: [] },
    };

    const result = await searchAssociatedContent(options);

    const expectedUrl =
      "https://example.com/path/to/ogc/collections/all/items/123/related";
    expect(mockGetOgcApiDefinition).toHaveBeenCalledWith(
      "item",
      options.requestOptions
    );
    expect(mockSearchOgcItems).toHaveBeenCalledWith(
      expectedUrl,
      { targetEntity: "item", filters: [] },
      { requestOptions: {}, num: 4 }
    );
    expect(result).toEqual({ results: [], total: 0 } as any);
  });

  it("uses layerId to construct hubId if provided", async () => {
    const options: ISearchAssociatedContentOptions = {
      entity: { id: "123", type: "Feature Service" } as unknown as HubEntity,
      layerId: "4",
      association: "connected",
      requestOptions: {},
      scope: { targetEntity: "item", filters: [] },
    };

    const result = await searchAssociatedContent(options);

    const expectedUrl =
      "https://example.com/path/to/ogc/collections/all/items/123_4/connected";
    expect(mockSearchOgcItems).toHaveBeenCalledWith(
      expectedUrl,
      { targetEntity: "item", filters: [] },
      { requestOptions: {}, num: 4 }
    );
    expect(result).toEqual({ results: [], total: 0 } as any);
  });

  it("overrides num value if provided", async () => {
    const options: any = {
      entity: { id: "123", type: "Feature Service" },
      association: "related",
      requestOptions: {},
      scope: { targetEntity: "item", filters: [] },
      num: 10,
    };

    const result = await searchAssociatedContent(options);

    expect(mockSearchOgcItems).toHaveBeenCalledWith(
      "https://example.com/path/to/ogc/collections/all/items/123/related",
      { targetEntity: "item", filters: [] },
      { requestOptions: {}, num: 10 }
    );
    expect(result).toEqual({ results: [], total: 0 } as any);
  });
});
