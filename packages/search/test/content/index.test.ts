import { UserSession } from "@esri/arcgis-rest-auth";
import * as portal from "@esri/arcgis-rest-portal";
import { IItem, ISearchResult } from "@esri/arcgis-rest-portal";
import * as common from "@esri/hub-common";
import { IHubRequestOptions } from "@esri/hub-common";
import {
  catalogToContentFilter,
  ContentSearchService,
  searchContent,
} from "../../src/content/index";
import {
  IContentSearchFilter,
  IContentSearchRequest,
  IContentSearchOptions,
} from "../../src/types/content";

describe("Content Search Service", () => {
  it("can be perform an enterprise search when isPortal is specified as true", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const options: IContentSearchOptions = { sortField: "title" };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const itemOne: IItem = {
      id: "12345",
      title: "title 1",
      type: "Feature Layer",
      owner: "me",
      tags: ["tag 1", "tag 2"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 5,
    };

    const itemTwo: IItem = {
      id: "23456",
      title: "title 2",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const mockedResponse: ISearchResult<IItem> = {
      query: "title:title 1 OR title:title 2",
      total: 2,
      start: 1,
      num: 2,
      nextStart: -1,
      results: [itemOne, itemTwo],
    };

    const authentication: UserSession = new UserSession({
      portal: "portal-sharing-url",
    });

    const service: ContentSearchService = new ContentSearchService({
      portal: "portal-sharing-url",
      isPortal: true,
      authentication,
    });

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then((response) => {
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: '(title: "title 1" OR title: "title 2") AND (-type: "code attachment")',
          params: {
            num: 10,
            start: 1,
            countFields: undefined,
            countSize: undefined,
          },
          sortField: "title",
          portal: "portal-sharing-url",
          authentication,
          httpMethod: "POST",
          sortOrder: undefined,
          bbox: undefined,
        },
      ]);
      expect(response.results).toEqual(mockedResponse.results);
      expect(response.query).toEqual(mockedResponse.query);
      expect(response.total).toEqual(mockedResponse.total);
      expect(response.count).toEqual(mockedResponse.num);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be handle an enterprise search with a falsey request", (done) => {
    // Setup
    const itemOne: IItem = {
      id: "12345",
      title: "title 1",
      type: "Feature Layer",
      owner: "me",
      tags: ["tag 1", "tag 2"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 5,
    };

    const itemTwo: IItem = {
      id: "23456",
      title: "title 2",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const mockedResponse: ISearchResult<IItem> = {
      query: "title:title 1 OR title:title 2",
      total: 2,
      start: 1,
      num: 2,
      nextStart: -1,
      results: [itemOne, itemTwo],
    };

    const authentication: UserSession = new UserSession({
      portal: "portal-sharing-url",
    });

    const service: ContentSearchService = new ContentSearchService({
      portal: "portal-sharing-url",
      isPortal: true,
      authentication,
    });

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(undefined).then((response) => {
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: '(-type: "code attachment")',
          params: {
            num: 10,
            start: 1,
            countFields: undefined,
            countSize: undefined,
          },
          portal: "portal-sharing-url",
          authentication,
          httpMethod: "POST",
          sortField: undefined,
          sortOrder: undefined,
          bbox: undefined,
        },
      ]);
      expect(response.results).toEqual(mockedResponse.results);
      expect(response.query).toEqual(mockedResponse.query);
      expect(response.total).toEqual(mockedResponse.total);
      expect(response.count).toEqual(mockedResponse.num);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be perform a Hub API search when isPortal is specified as false", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const options: IContentSearchOptions = { sortField: "title" };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    const authentication: UserSession = new UserSession({
      portal: "portal-sharing-url",
    });

    const service: ContentSearchService = new ContentSearchService({
      portal: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
      authentication,
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication,
          isPortal: false,
          headers: {
            authentication: JSON.stringify(authentication),
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)",
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be perform a Hub API search with a session from request options, overriding the service session", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const sessionOne: UserSession = new UserSession({ portal: "first-portal" });

    const options: IContentSearchOptions = {
      sortField: "title",
      authentication: sessionOne,
    };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    const sessionTwo: UserSession = new UserSession({
      portal: "a-different-Portal",
    });

    const service: ContentSearchService = new ContentSearchService({
      portal: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
      authentication: sessionTwo,
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: sessionOne,
          isPortal: false,
          headers: {
            authentication: JSON.stringify(sessionOne),
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)",
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be perform a Hub API search without a session", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const options: IContentSearchOptions = {
      sortField: "title",
    };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    const service: ContentSearchService = new ContentSearchService({
      portal: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined,
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)",
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be handle a Hub API with a falsey request", (done) => {
    // Setup
    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    const service: ContentSearchService = new ContentSearchService({
      portal: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(undefined).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined,
          },
          httpMethod: "POST",
          params: {
            sort: undefined,
            filter: undefined,
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });
});

describe("catalogToContentFilter function", () => {
  it("converts a site catalog to a content filter", () => {
    const siteCatalog = {
      groups: ["24ad12457b8c410582f185c46f6896ba"],
      orgId: "be55891b4",
    };
    expect(catalogToContentFilter(siteCatalog)).toEqual({
      group: siteCatalog.groups,
      orgid: siteCatalog.orgId,
    });
  });
});

describe("searchContent function", () => {

  describe('scoping site catalog', () => {
    const userSession = new UserSession({
      portal: "https://www.arcgis.com",
    });

    let fetchSiteSpy: jasmine.Spy;
    let hubApiRequestSpy: jasmine.Spy;
    beforeEach(() => {
      fetchSiteSpy = spyOn(common, 'fetchSite').and.returnValue(
        Promise.resolve({
          data: {
            values: {
              catalog: {
                groups: ["24ad12457b8c410582f185c46f6896ba"],
                orgId: "be55891b4",
              },
            },
          },
        })
      );

      hubApiRequestSpy = spyOn(common, "hubApiRequest").and.returnValue(
        Promise.resolve()
      );
    })

    it("applies site catalog when site identifier provided", async () => {
      await searchContent({
        options: {
          site: "https://my-site.hub.arcgis.com",
          isPortal: false,
          portal: "https://www.arcgis.com",
          authentication: userSession,
        },
      });

      const expectedRequestOptions: IHubRequestOptions = {
        isPortal: false,
        hubApiUrl: "https://hub.arcgis.com",
        authentication: userSession,
      };

      expect(fetchSiteSpy).toHaveBeenCalledWith(
        "https://my-site.hub.arcgis.com",
        expectedRequestOptions
      );

      expect(hubApiRequestSpy).toHaveBeenCalledTimes(1);

      const hubApiRequestParams = hubApiRequestSpy.calls.argsFor(0)[1].params;

      expect(hubApiRequestParams.catalog).toEqual({
        groupIds: "any(24ad12457b8c410582f185c46f6896ba)",
        orgId: "any(be55891b4)",
      });
    });

    it("filter options override site catalog", async () => {
      await searchContent({
        filter: {
          group: ['foo', 'bar']
        },
        options: {
          site: "https://my-site.hub.arcgis.com",
          isPortal: false,
          portal: "https://www.arcgis.com",
          authentication: userSession,
        },
      });

      expect(hubApiRequestSpy).toHaveBeenCalledTimes(1);

      const hubApiRequestParams = hubApiRequestSpy.calls.argsFor(0)[1].params;

      expect(hubApiRequestParams.catalog).toEqual({
        groupIds: "any(foo,bar)",
        orgId: "any(be55891b4)",
      });
    });
  })

  it("can be perform an enterprise search when isPortal is specified as true", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const authentication: UserSession = new UserSession({
      portal: "portal-sharing-url",
    });

    const options: IContentSearchOptions = {
      sortField: "title",
      isPortal: true,
      portal: "portal-sharing-url",
      authentication,
    };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const itemOne: IItem = {
      id: "12345",
      title: "title 1",
      type: "Feature Layer",
      owner: "me",
      tags: ["tag 1", "tag 2"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 5,
    };

    const itemTwo: IItem = {
      id: "23456",
      title: "title 2",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const mockedResponse: ISearchResult<IItem> = {
      query: "title:title 1 OR title:title 2",
      total: 2,
      start: 1,
      num: 2,
      nextStart: -1,
      results: [itemOne, itemTwo],
    };

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    searchContent(request).then((response) => {
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: '(title: "title 1" OR title: "title 2") AND (-type: "code attachment")',
          params: {
            num: 10,
            start: 1,
            countFields: undefined,
            countSize: undefined,
          },
          sortField: "title",
          portal: "portal-sharing-url",
          authentication,
          httpMethod: "POST",
          sortOrder: undefined,
          bbox: undefined,
        },
      ]);
      expect(response.results).toEqual(mockedResponse.results);
      expect(response.query).toEqual(mockedResponse.query);
      expect(response.total).toEqual(mockedResponse.total);
      expect(response.count).toEqual(mockedResponse.num);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be perform a Hub API search when isPortal is specified as false", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const authentication: UserSession = new UserSession({
      portal: "portal-sharing-url",
    });

    const options: IContentSearchOptions = {
      sortField: "title",
      isPortal: false,
      portal: "https://qaext.arcgis.com/sharing/rest",
      authentication,
    };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    searchContent(request).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication,
          isPortal: false,
          headers: {
            authentication: JSON.stringify(authentication),
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)",
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("performs a Hub API Search with a falsey request", (done) => {
    // Setup

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    searchContent().then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hub.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined,
          },
          httpMethod: "POST",
          params: {
            sort: undefined,
            filter: undefined,
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });

  it("can be perform a Hub API search without a session", (done) => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"],
    };

    const options: IContentSearchOptions = {
      sortField: "title",
      portal: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
    };

    const request: IContentSearchRequest = {
      filter,
      options,
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "title 1",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5,
      },
    };

    const documentTwo: Record<string, any> = {
      attributes: {
        id: "23456",
        title: "title 2",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6,
      },
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)",
          },
        },
        stats: {
          count: 2,
          totalCount: 2,
        },
      },
    };

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    searchContent(request).then((response) => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined,
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)",
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined,
          },
        },
      ]);
      const mappedAttributes: Array<Record<string, any>> =
        mockedResponse.data.map((d: Record<string, any>) => d.attributes);
      expect(response.results).toEqual(mappedAttributes);
      expect(response.query).toEqual(
        JSON.stringify(mockedResponse.meta.queryParameters)
      );
      expect(response.total).toEqual(mockedResponse.meta.stats.totalCount);
      expect(response.count).toEqual(mockedResponse.meta.stats.count);
      expect(response.hasNext).toEqual(false);
      expect(response.aggregations).toBeUndefined();
      expect(response.next).toBeDefined();
      done();
    });
  });
});
