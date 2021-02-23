import * as fetchMock from "fetch-mock";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IContentSearchResponse } from "../../../src/types/content";
import { convertHubResponse } from "../../../src/content/helpers/convert-hub-response";
import { ISearchResponse } from "../../../src/types/common";
import { ISearchParams } from "../../../src/ago/params";

afterEach(fetchMock.restore);

describe("Convert Hub Response function", () => {
  it("can properly format a response from the Hub API", done => {
    // Setup
    const request: ISearchParams = {
      q: "12345",
      sort: "-modified",
      catalog: {
        groupIds: "any(12345,23456,34567)"
      },
      filter: {
        type: "any(Feature Layer,Table)"
      }
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "TITLE ONE",
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
        title: "TITLE TWO",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6
      }
    };

    const resultOne: Record<string, any> = {
      data: [documentOne],
      meta: {
        next: "http://link-to-next-one",
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {}
        }
      }
    };

    const resultTwo: Record<string, any> = {
      data: [documentTwo],
      meta: {
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {}
        }
      }
    };

    const sessionOne = new UserSession({ portal: "dummy-portal-url-one" });
    const sessionTwo = new UserSession({ portal: "dummy-portal-url-two" });

    // Mock
    fetchMock.once("*", resultTwo);

    // Test
    const convertedResponse: IContentSearchResponse = convertHubResponse(
      request,
      resultOne,
      sessionOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual([documentOne.attributes]);
    expect(convertedResponse.query).toEqual(
      JSON.stringify(resultOne.meta.queryParameters)
    );
    expect(convertedResponse.total).toEqual(resultOne.meta.stats.totalCount);
    expect(convertedResponse.count).toEqual(resultOne.meta.stats.count);
    expect(convertedResponse.hasNext).toEqual(true);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();

    // Invoke the mocked next method
    convertedResponse
      .next(sessionTwo)
      .then((response: ISearchResponse<any>) => {
        const contentResponse = response as IContentSearchResponse;
        expect(fetchMock.calls().length).toEqual(1);
        expect(fetchMock.calls()[0][0]).toEqual("http://link-to-next-one/");
        expect(fetchMock.calls()[0][1]).toEqual({
          method: "GET",
          mode: "cors",
          headers: new Headers({ authentication: JSON.stringify(sessionTwo) })
        });
        expect(contentResponse.results).toEqual([documentTwo.attributes]);
        expect(contentResponse.query).toEqual(
          JSON.stringify(resultTwo.meta.queryParameters)
        );
        expect(contentResponse.total).toEqual(resultOne.meta.stats.totalCount);
        expect(contentResponse.count).toEqual(resultOne.meta.stats.count);
        expect(contentResponse.hasNext).toEqual(false);
        expect(contentResponse.aggregations).toBeUndefined();
        expect(contentResponse.next).toBeDefined();
        done();
      });
  });

  it("can properly default to the service session if a user session not provided for next function", done => {
    // Setup
    const request: ISearchParams = {
      q: "12345",
      sort: "-modified",
      catalog: {
        groupIds: "any(12345,23456,34567)"
      },
      filter: {
        type: "any(Feature Layer,Table)"
      }
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "TITLE ONE",
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
        title: "TITLE TWO",
        type: "Table",
        owner: "you",
        tags: ["tag 3"],
        created: 2000,
        modified: 3000,
        numViews: 2,
        size: 6
      }
    };

    const resultOne: Record<string, any> = {
      data: [documentOne],
      meta: {
        next: "http://link-to-next-one",
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {}
        }
      }
    };

    const resultTwo: Record<string, any> = {
      data: [documentTwo],
      meta: {
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {}
        }
      }
    };

    const sessionOne = new UserSession({ portal: "dummy-portal-url-one" });

    // Mock
    fetchMock.once("*", resultTwo);

    // Test
    const convertedResponse: IContentSearchResponse = convertHubResponse(
      request,
      resultOne,
      sessionOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual([documentOne.attributes]);
    expect(convertedResponse.query).toEqual(
      JSON.stringify(resultOne.meta.queryParameters)
    );
    expect(convertedResponse.total).toEqual(resultOne.meta.stats.totalCount);
    expect(convertedResponse.count).toEqual(resultOne.meta.stats.count);
    expect(convertedResponse.hasNext).toEqual(true);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();

    // Invoke the mocked next method
    convertedResponse.next().then((response: ISearchResponse<any>) => {
      const contentResponse = response as IContentSearchResponse;
      expect(fetchMock.calls().length).toEqual(1);
      expect(fetchMock.calls()[0][0]).toEqual("http://link-to-next-one/");
      expect(fetchMock.calls()[0][1]).toEqual({
        method: "GET",
        mode: "cors",
        headers: new Headers({ authentication: JSON.stringify(sessionOne) })
      });
      expect(contentResponse.results).toEqual([documentTwo.attributes]);
      expect(contentResponse.query).toEqual(
        JSON.stringify(resultTwo.meta.queryParameters)
      );
      expect(contentResponse.total).toEqual(resultOne.meta.stats.totalCount);
      expect(contentResponse.count).toEqual(resultOne.meta.stats.count);
      expect(contentResponse.hasNext).toEqual(false);
      expect(contentResponse.aggregations).toBeUndefined();
      expect(contentResponse.next).toBeDefined();
      done();
    });
  });

  it("can properly use default metadata if not provided by Hub API", done => {
    // Setup
    const request: ISearchParams = {
      q: "12345",
      sort: "-modified",
      catalog: {
        groupIds: "any(12345,23456,34567)"
      },
      filter: {
        type: "any(Feature Layer,Table)"
      }
    };

    const resultOne: Record<string, any> = {
      data: [],
      meta: {}
    };

    const sessionOne = new UserSession({ portal: "dummy-portal-url-one" });

    // Test
    const convertedResponse: IContentSearchResponse = convertHubResponse(
      request,
      resultOne,
      sessionOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual([]);
    expect(convertedResponse.query).toBeUndefined();
    expect(convertedResponse.total).toEqual(0);
    expect(convertedResponse.count).toEqual(0);
    expect(convertedResponse.hasNext).toEqual(false);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();
    done();
  });

  it("can properly respond to calls to next when there is no more data", done => {
    // Setup
    const request: ISearchParams = {
      q: "12345",
      sort: "-modified",
      catalog: {
        groupIds: "any(12345,23456,34567)"
      },
      filter: {
        type: "any(Feature Layer,Table)"
      }
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "TITLE ONE",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5
      }
    };

    const resultOne: Record<string, any> = {
      data: [documentOne],
      meta: {
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {}
        }
      }
    };

    const sessionOne = new UserSession({ portal: "dummy-portal-url-one" });

    // Test
    const convertedResponse: IContentSearchResponse = convertHubResponse(
      request,
      resultOne,
      sessionOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual([documentOne.attributes]);
    expect(convertedResponse.query).toEqual(
      JSON.stringify(resultOne.meta.queryParameters)
    );
    expect(convertedResponse.total).toEqual(resultOne.meta.stats.totalCount);
    expect(convertedResponse.count).toEqual(resultOne.meta.stats.count);
    expect(convertedResponse.hasNext).toEqual(false);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();

    // Invoke the mocked next method
    convertedResponse.next().then((response: ISearchResponse<any>) => {
      const contentResponse = response as IContentSearchResponse;
      expect(fetchMock.calls().length).toEqual(0);
      expect(contentResponse.results).toEqual([]);
      expect(contentResponse.query).toEqual(
        JSON.stringify(resultOne.meta.queryParameters)
      );
      expect(contentResponse.total).toEqual(resultOne.meta.stats.totalCount);
      expect(contentResponse.count).toEqual(0);
      expect(contentResponse.hasNext).toEqual(false);
      expect(contentResponse.aggregations).toBeUndefined();
      expect(contentResponse.next).toBeDefined();
      done();
    });
  });

  it("can properly map aggregations", done => {
    // Setup
    const request: ISearchParams = {
      q: "12345",
      sort: "-modified",
      catalog: {
        groupIds: "any(12345,23456,34567)"
      },
      filter: {
        type: "any(Feature Layer,Table)"
      },
      agg: {
        fields: "type,access"
      }
    };

    const documentOne: Record<string, any> = {
      attributes: {
        id: "12345",
        title: "TITLE ONE",
        type: "Feature Layer",
        owner: "me",
        tags: ["tag 1", "tag 2"],
        created: 1000,
        modified: 2000,
        numViews: 1,
        size: 5
      }
    };

    const resultOne: Record<string, any> = {
      data: [documentOne],
      meta: {
        queryParameters: request,
        stats: {
          count: 1,
          totalCount: 2,
          aggs: {
            type: [
              {
                key: "Feature Layer",
                docCount: 1
              },
              {
                key: "Table",
                docCount: 1
              }
            ],
            access: [
              {
                key: "private",
                docCount: 1
              },
              {
                key: "public",
                docCount: 1
              },
              {
                key: "org",
                docCount: 0
              }
            ]
          }
        }
      }
    };

    const sessionOne = new UserSession({ portal: "dummy-portal-url-one" });

    // Test
    const convertedResponse: IContentSearchResponse = convertHubResponse(
      request,
      resultOne,
      sessionOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual([documentOne.attributes]);
    expect(convertedResponse.query).toEqual(
      JSON.stringify(resultOne.meta.queryParameters)
    );
    expect(convertedResponse.total).toEqual(resultOne.meta.stats.totalCount);
    expect(convertedResponse.count).toEqual(resultOne.meta.stats.count);
    expect(convertedResponse.hasNext).toEqual(false);
    expect(convertedResponse.aggregations).toBeDefined();
    expect(convertedResponse.aggregations).toEqual({
      counts: [
        {
          fieldName: "type",
          aggregations: [
            {
              label: "Feature Layer",
              value: 1
            },
            {
              label: "Table",
              value: 1
            }
          ]
        },
        {
          fieldName: "access",
          aggregations: [
            {
              label: "private",
              value: 1
            },
            {
              label: "public",
              value: 1
            },
            {
              label: "org",
              value: 0
            }
          ]
        }
      ]
    });
    expect(convertedResponse.next).toBeDefined();

    // Invoke the mocked next method
    convertedResponse.next().then((response: ISearchResponse<any>) => {
      const contentResponse = response as IContentSearchResponse;
      expect(fetchMock.calls().length).toEqual(0);
      expect(contentResponse.results).toEqual([]);
      expect(contentResponse.query).toEqual(
        JSON.stringify(resultOne.meta.queryParameters)
      );
      expect(contentResponse.total).toEqual(resultOne.meta.stats.totalCount);
      expect(contentResponse.count).toEqual(0);
      expect(contentResponse.hasNext).toEqual(false);
      expect(contentResponse.aggregations).toBeDefined();
      expect(contentResponse.aggregations).toEqual({
        counts: [
          {
            fieldName: "type",
            aggregations: [
              {
                label: "Feature Layer",
                value: 1
              },
              {
                label: "Table",
                value: 1
              }
            ]
          },
          {
            fieldName: "access",
            aggregations: [
              {
                label: "private",
                value: 1
              },
              {
                label: "public",
                value: 1
              },
              {
                label: "org",
                value: 0
              }
            ]
          }
        ]
      });
      expect(contentResponse.next).toBeDefined();
      done();
    });
  });

  // it('can properly format a response from Portal API with aggregations', done => {
  //   // Setup
  //   const itemOne: IItem = {
  //     id: '12345',
  //     title: 'TITLE ONE',
  //     type: 'Feature Layer',
  //     owner: 'me',
  //     tags: ['tag 1', 'tag 2'],
  //     created: 1000,
  //     modified: 2000,
  //     numViews: 1,
  //     size: 5
  //   };

  //   const itemTwo: IItem = {
  //     id: '23456',
  //     title: 'TITLE TWO',
  //     type: 'Table',
  //     owner: 'you',
  //     tags: ['tag 3'],
  //     created: 2000,
  //     modified: 3000,
  //     numViews: 2,
  //     size: 6
  //   };

  //   const request: ISearchOptions = {
  //     q: '12345',
  //     sortOrder: 'asc',
  //     sortField: 'title',
  //     start: 1,
  //     num: 1,
  //     aggregations: 'type,access'
  //   };

  //   const portalApiResultsOne: ISearchResult<IItem> = {
  //     query: '12345',
  //     total: 5,
  //     start: 1,
  //     num: 1,
  //     nextStart: 2,
  //     results: [itemOne],
  //     aggregations: {
  //       counts: [
  //         {
  //           fieldName: 'type',
  //           fieldValues: [
  //             {
  //               value: 'Feature Layer',
  //               count: 4
  //             },
  //             {
  //               value: 'Table',
  //               count: 1
  //             }
  //           ]
  //         },
  //         {
  //           fieldName: 'access',
  //           fieldValues: [
  //             {
  //               value: 'public',
  //               count: 3
  //             },
  //             {
  //               value: 'private',
  //               count: 1
  //             },
  //             {
  //               value: 'org',
  //               count: 1
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   };

  //   const portalApiResultsTwo: ISearchResult<IItem> = {
  //     query: '12345',
  //     total: 5,
  //     start: 2,
  //     num: 1,
  //     nextStart: 3,
  //     results: [itemTwo],
  //     aggregations: {
  //       counts: [
  //         {
  //           fieldName: 'type',
  //           fieldValues: [
  //             {
  //               value: 'Feature Layer',
  //               count: 4
  //             },
  //             {
  //               value: 'Table',
  //               count: 1
  //             }
  //           ]
  //         },
  //         {
  //           fieldName: 'access',
  //           fieldValues: [
  //             {
  //               value: 'public',
  //               count: 3
  //             },
  //             {
  //               value: 'private',
  //               count: 1
  //             },
  //             {
  //               value: 'org',
  //               count: 1
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   };

  //   // Mock
  //   const searchItemsMock = spyOn(portal, 'searchItems').and.returnValue(Promise.resolve(portalApiResultsTwo));

  //   // Test
  //   const convertedResponse: IContentSearchResponse = convertPortalResponse(request, portalApiResultsOne);

  //   // Assert
  //   expect(convertedResponse).toBeDefined();
  //   expect(convertedResponse.results).toEqual(portalApiResultsOne.results);
  //   expect(convertedResponse.query).toEqual(portalApiResultsOne.query);
  //   expect(convertedResponse.total).toEqual(portalApiResultsOne.total);
  //   expect(convertedResponse.count).toEqual(portalApiResultsOne.num);
  //   expect(convertedResponse.hasNext).toEqual(true);
  //   expect(convertedResponse.aggregations).toBeDefined();
  //   expect(convertedResponse.aggregations.counts).toEqual([
  //     {
  //       fieldName: 'type',
  //       aggregations: [
  //         {
  //           label: 'Feature Layer',
  //           value: 4
  //         },
  //         {
  //           label: 'Table',
  //           value: 1
  //         }
  //       ]
  //     },
  //     {
  //       fieldName: 'access',
  //       aggregations: [
  //         {
  //           label: 'public',
  //           value: 3
  //         },
  //         {
  //           label: 'private',
  //           value: 1
  //         },
  //         {
  //           label: 'org',
  //           value: 1
  //         }
  //       ]
  //     },
  //   ]);
  //   expect(convertedResponse.next).toBeDefined();

  //   // Invoke the stubbed next method
  //   convertedResponse.next()
  //     .then((response: ISearchResponse<any>) => {
  //       const contentResponse = response as IContentSearchResponse;
  //       expect(searchItemsMock.calls).toBeDefined();
  //       expect(searchItemsMock.calls.count()).toEqual(1);
  //       expect(searchItemsMock.calls.argsFor(0)).toEqual([{
  //         q: '12345',
  //         num: 1,
  //         start: 2,
  //         sortField: 'title',
  //         sortOrder: 'asc',
  //         aggregations: 'type,access'
  //       }]);
  //       expect(contentResponse.results).toEqual(portalApiResultsTwo.results);
  //       expect(contentResponse.query).toEqual(portalApiResultsTwo.query);
  //       expect(contentResponse.total).toEqual(portalApiResultsTwo.total);
  //       expect(contentResponse.count).toEqual(portalApiResultsTwo.num);
  //       expect(contentResponse.hasNext).toEqual(true);
  //       expect(contentResponse.aggregations).toBeDefined();
  //       expect(convertedResponse.aggregations.counts).toEqual([
  //         {
  //           fieldName: 'type',
  //           aggregations: [
  //             {
  //               label: 'Feature Layer',
  //               value: 4
  //             },
  //             {
  //               label: 'Table',
  //               value: 1
  //             }
  //           ]
  //         },
  //         {
  //           fieldName: 'access',
  //           aggregations: [
  //             {
  //               label: 'public',
  //               value: 3
  //             },
  //             {
  //               label: 'private',
  //               value: 1
  //             },
  //             {
  //               label: 'org',
  //               value: 1
  //             }
  //           ]
  //         },
  //       ]);
  //       expect(contentResponse.next).toBeDefined();
  //       done();
  //     });
  // });

  // it('can use different UserSession objects for subsequent requests', done => {
  //   // Setup
  //   const itemOne: IItem = {
  //     id: '12345',
  //     title: 'TITLE ONE',
  //     type: 'Feature Layer',
  //     owner: 'me',
  //     tags: ['tag 1', 'tag 2'],
  //     created: 1000,
  //     modified: 2000,
  //     numViews: 1,
  //     size: 5
  //   };

  //   const itemTwo: IItem = {
  //     id: '23456',
  //     title: 'TITLE TWO',
  //     type: 'Table',
  //     owner: 'you',
  //     tags: ['tag 3'],
  //     created: 2000,
  //     modified: 3000,
  //     numViews: 2,
  //     size: 6
  //   };

  //   const userSessionOne = new UserSession({ portal: 'dummy-portal-one' });
  //   const userSessionTwo = new UserSession({ portal: 'dummy-portal-two' })

  //   const request: ISearchOptions = {
  //     q: '12345',
  //     sortOrder: 'asc',
  //     sortField: 'title',
  //     start: 1,
  //     num: 1,
  //     authentication: userSessionOne
  //   };

  //   const portalApiResultsOne: ISearchResult<IItem> = {
  //     query: '12345',
  //     total: 2,
  //     start: 1,
  //     num: 1,
  //     nextStart: 2,
  //     results: [itemOne]
  //   };

  //   const portalApiResultsTwo: ISearchResult<IItem> = {
  //     query: '12345',
  //     total: 2,
  //     start: 2,
  //     num: 1,
  //     nextStart: -1,
  //     results: [itemTwo]
  //   };

  //   // Mock
  //   const searchItemsMock = spyOn(portal, 'searchItems').and.returnValue(Promise.resolve(portalApiResultsTwo));

  //   // Test
  //   const convertedResponse: IContentSearchResponse = convertPortalResponse(request, portalApiResultsOne);

  //   // Assert
  //   expect(convertedResponse).toBeDefined();
  //   expect(convertedResponse.results).toEqual(portalApiResultsOne.results);
  //   expect(convertedResponse.query).toEqual(portalApiResultsOne.query);
  //   expect(convertedResponse.total).toEqual(portalApiResultsOne.total);
  //   expect(convertedResponse.count).toEqual(portalApiResultsOne.num);
  //   expect(convertedResponse.hasNext).toEqual(true);
  //   expect(convertedResponse.aggregations).toBeUndefined();
  //   expect(convertedResponse.next).toBeDefined();

  //   // Invoke the stubbed next method
  //   convertedResponse.next(userSessionTwo)
  //     .then((response: ISearchResponse<any>) => {
  //       const contentResponse = response as IContentSearchResponse;
  //       expect(searchItemsMock.calls).toBeDefined();
  //       expect(searchItemsMock.calls.count()).toEqual(1);
  //       expect(searchItemsMock.calls.argsFor(0)).toEqual([{
  //         q: '12345',
  //         num: 1,
  //         start: 2,
  //         sortField: 'title',
  //         sortOrder: 'asc',
  //         authentication: userSessionTwo
  //       }]);
  //       expect(contentResponse.results).toEqual(portalApiResultsTwo.results);
  //       expect(contentResponse.query).toEqual(portalApiResultsTwo.query);
  //       expect(contentResponse.total).toEqual(portalApiResultsTwo.total);
  //       expect(contentResponse.count).toEqual(portalApiResultsTwo.num);
  //       expect(contentResponse.hasNext).toEqual(false);
  //       expect(contentResponse.aggregations).toBeUndefined();
  //       expect(contentResponse.next).toBeDefined();
  //       done();
  //     });
  // });
});
