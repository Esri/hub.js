import { UserSession } from "@esri/arcgis-rest-auth";
import * as portal from "@esri/arcgis-rest-portal";
import { IItem, ISearchResult } from "@esri/arcgis-rest-portal";
import * as common from "@esri/hub-common";
import { ContentSearchService } from "../../src/content/index";
import {
  IContentSearchFilter,
  IContentSearchRequest,
  IContentSearchOptions
} from "../../src/types/content";

describe("Content Search Service", () => {
  it("can be perform an enterprise search when isPortal is specified as true", done => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"]
    };

    const options: IContentSearchOptions = { sortField: "title" };

    const request: IContentSearchRequest = {
      filter,
      options
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
      size: 5
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
      size: 6
    };

    const mockedResponse: ISearchResult<IItem> = {
      query: "title:title 1 OR title:title 2",
      total: 2,
      start: 1,
      num: 2,
      nextStart: -1,
      results: [itemOne, itemTwo]
    };

    const session: UserSession = new UserSession({
      portal: "portal-sharing-url"
    });

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "portal-sharing-url",
      isPortal: true,
      session
    });

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then(response => {
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q:
            '(title: "title 1" OR title: "title 2") AND (-type: "code attachment")',
          params: {
            num: 10,
            start: 1,
            countFields: undefined,
            countSize: undefined
          },
          sortField: "title",
          portal: "portal-sharing-url",
          authentication: session,
          httpMethod: "POST",
          sortOrder: undefined,
          bbox: undefined
        }
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

  it("can be handle an enterprise search with a falsey request", done => {
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
      size: 5
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
      size: 6
    };

    const mockedResponse: ISearchResult<IItem> = {
      query: "title:title 1 OR title:title 2",
      total: 2,
      start: 1,
      num: 2,
      nextStart: -1,
      results: [itemOne, itemTwo]
    };

    const session: UserSession = new UserSession({
      portal: "portal-sharing-url"
    });

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "portal-sharing-url",
      isPortal: true,
      session
    });

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(undefined).then(response => {
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: '(-type: "code attachment")',
          params: {
            num: 10,
            start: 1,
            countFields: undefined,
            countSize: undefined
          },
          portal: "portal-sharing-url",
          authentication: session,
          httpMethod: "POST",
          sortField: undefined,
          sortOrder: undefined,
          bbox: undefined
        }
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

  it("can be perform a Hub API search when isPortal is specified as false", done => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"]
    };

    const options: IContentSearchOptions = { sortField: "title" };

    const request: IContentSearchRequest = {
      filter,
      options
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
        size: 5
      }
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
        size: 6
      }
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)"
          }
        },
        stats: {
          count: 2,
          totalCount: 2
        }
      }
    };

    const session: UserSession = new UserSession({
      portal: "portal-sharing-url"
    });

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
      session
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then(response => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: session,
          isPortal: false,
          headers: {
            authentication: JSON.stringify(session)
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)"
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined
          }
        }
      ]);
      const mappedAttributes: Array<
        Record<string, any>
      > = mockedResponse.data.map((d: Record<string, any>) => d.attributes);
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

  it("can be perform a Hub API search with a session from request options, overriding the service session", done => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"]
    };

    const sessionOne: UserSession = new UserSession({ portal: "first-portal" });

    const options: IContentSearchOptions = {
      sortField: "title",
      session: sessionOne
    };

    const request: IContentSearchRequest = {
      filter,
      options
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
        size: 5
      }
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
        size: 6
      }
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)"
          }
        },
        stats: {
          count: 2,
          totalCount: 2
        }
      }
    };

    const sessionTwo: UserSession = new UserSession({
      portal: "a-different-Portal"
    });

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false,
      session: sessionTwo
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then(response => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: sessionOne,
          isPortal: false,
          headers: {
            authentication: JSON.stringify(sessionOne)
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)"
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined
          }
        }
      ]);
      const mappedAttributes: Array<
        Record<string, any>
      > = mockedResponse.data.map((d: Record<string, any>) => d.attributes);
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

  it("can be perform a Hub API search without a session", done => {
    // Setup
    const filter: IContentSearchFilter = {
      title: ["title 1", "title 2"]
    };

    const options: IContentSearchOptions = {
      sortField: "title"
    };

    const request: IContentSearchRequest = {
      filter,
      options
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
        size: 5
      }
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
        size: 6
      }
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)"
          }
        },
        stats: {
          count: 2,
          totalCount: 2
        }
      }
    };

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(request).then(response => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined
          },
          httpMethod: "POST",
          params: {
            sort: "name",
            filter: {
              name: "any(title 1,title 2)"
            },
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined
          }
        }
      ]);
      const mappedAttributes: Array<
        Record<string, any>
      > = mockedResponse.data.map((d: Record<string, any>) => d.attributes);
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

  it("can be handle a Hub API with a falsey request", done => {
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
        size: 5
      }
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
        size: 6
      }
    };

    const mockedResponse: Record<string, any> = {
      data: [documentOne, documentTwo],
      meta: {
        queryParameters: {
          sort: "title",
          filter: {
            title: "any(title 1,title 2)"
          }
        },
        stats: {
          count: 2,
          totalCount: 2
        }
      }
    };

    const service: ContentSearchService = new ContentSearchService({
      portalSharingUrl: "https://qaext.arcgis.com/sharing/rest",
      isPortal: false
    });

    // Mock
    const hubRequestMock = spyOn(common, "hubApiRequest").and.returnValue(
      Promise.resolve(mockedResponse)
    );

    // Test
    service.search(undefined).then(response => {
      expect(hubRequestMock.calls.count()).toEqual(1);
      expect(hubRequestMock.calls.argsFor(0)).toEqual([
        "/search",
        {
          hubApiUrl: "https://hubqa.arcgis.com",
          authentication: undefined,
          isPortal: false,
          headers: {
            authentication: undefined
          },
          httpMethod: "POST",
          params: {
            sort: undefined,
            filter: undefined,
            agg: undefined,
            catalog: undefined,
            fields: undefined,
            q: undefined
          }
        }
      ]);
      const mappedAttributes: Array<
        Record<string, any>
      > = mockedResponse.data.map((d: Record<string, any>) => d.attributes);
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
