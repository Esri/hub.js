import { ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import * as portal from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-types";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IContentSearchResponse } from "../../../src/types/content";
import { convertPortalResponse } from "../../../src/content/helpers/convert-portal-response";
import { ISearchResponse, itemToContent } from "@esri/hub-common";

describe("Convert Portal Response function", () => {
  it("can properly format a response from Portal API", (done) => {
    // Setup
    const itemOne: IItem = {
      id: "12345",
      title: "TITLE ONE",
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
      title: "TITLE TWO",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const request: ISearchOptions = {
      q: "12345",
      sortOrder: "asc",
      sortField: "title",
      start: 1,
      num: 1,
    };

    const portalApiResultsOne: ISearchResult<IItem> = {
      query: "12345",
      total: 2,
      start: 1,
      num: 1,
      nextStart: 2,
      results: [itemOne],
    };

    const portalApiResultsTwo: ISearchResult<IItem> = {
      query: "12345",
      total: 2,
      start: 2,
      num: 1,
      nextStart: -1,
      results: [itemTwo],
    };

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(portalApiResultsTwo)
    );

    // Test
    const convertedResponse: IContentSearchResponse = convertPortalResponse(
      request,
      portalApiResultsOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual(
      portalApiResultsOne.results.map(itemToContent)
    );
    expect(convertedResponse.query).toEqual(portalApiResultsOne.query);
    expect(convertedResponse.total).toEqual(portalApiResultsOne.total);
    expect(convertedResponse.count).toEqual(portalApiResultsOne.num);
    expect(convertedResponse.hasNext).toEqual(true);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();

    // Invoke the stubbed next method
    convertedResponse.next().then((response: ISearchResponse<any>) => {
      const contentResponse = response as IContentSearchResponse;
      expect(searchItemsMock.calls).toBeDefined();
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: "12345",
          num: 1,
          start: 2,
          sortField: "title",
          sortOrder: "asc",
          authentication: undefined,
        },
      ]);
      expect(contentResponse.results).toEqual(
        portalApiResultsTwo.results.map(itemToContent)
      );
      expect(contentResponse.query).toEqual(portalApiResultsTwo.query);
      expect(contentResponse.total).toEqual(portalApiResultsTwo.total);
      expect(contentResponse.count).toEqual(portalApiResultsTwo.num);
      expect(contentResponse.hasNext).toEqual(false);
      expect(contentResponse.aggregations).toBeUndefined();
      expect(contentResponse.next).toBeDefined();
      done();
    });
  });

  it("can properly format a response from Portal API with aggregations", (done) => {
    // Setup
    const itemOne: IItem = {
      id: "12345",
      title: "TITLE ONE",
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
      title: "TITLE TWO",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const request: ISearchOptions = {
      q: "12345",
      sortOrder: "asc",
      sortField: "title",
      start: 1,
      num: 1,
      aggregations: "type,access",
    };

    const portalApiResultsOne: ISearchResult<IItem> = {
      query: "12345",
      total: 5,
      start: 1,
      num: 1,
      nextStart: 2,
      results: [itemOne],
      aggregations: {
        counts: [
          {
            fieldName: "type",
            fieldValues: [
              {
                value: "Feature Layer",
                count: 4,
              },
              {
                value: "Table",
                count: 1,
              },
            ],
          },
          {
            fieldName: "access",
            fieldValues: [
              {
                value: "public",
                count: 3,
              },
              {
                value: "private",
                count: 1,
              },
              {
                value: "org",
                count: 1,
              },
            ],
          },
        ],
      },
    };

    const portalApiResultsTwo: ISearchResult<IItem> = {
      query: "12345",
      total: 5,
      start: 2,
      num: 1,
      nextStart: 3,
      results: [itemTwo],
      aggregations: {
        counts: [
          {
            fieldName: "type",
            fieldValues: [
              {
                value: "Feature Layer",
                count: 4,
              },
              {
                value: "Table",
                count: 1,
              },
            ],
          },
          {
            fieldName: "access",
            fieldValues: [
              {
                value: "public",
                count: 3,
              },
              {
                value: "private",
                count: 1,
              },
              {
                value: "org",
                count: 1,
              },
            ],
          },
        ],
      },
    };

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(portalApiResultsTwo)
    );

    // Test
    const convertedResponse: IContentSearchResponse = convertPortalResponse(
      request,
      portalApiResultsOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual(
      portalApiResultsOne.results.map(itemToContent)
    );
    expect(convertedResponse.query).toEqual(portalApiResultsOne.query);
    expect(convertedResponse.total).toEqual(portalApiResultsOne.total);
    expect(convertedResponse.count).toEqual(portalApiResultsOne.num);
    expect(convertedResponse.hasNext).toEqual(true);
    expect(convertedResponse.aggregations).toBeDefined();
    expect(convertedResponse.aggregations.counts).toEqual([
      {
        fieldName: "type",
        aggregations: [
          {
            label: "Feature Layer",
            value: 4,
          },
          {
            label: "Table",
            value: 1,
          },
        ],
      },
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 3,
          },
          {
            label: "private",
            value: 1,
          },
          {
            label: "org",
            value: 1,
          },
        ],
      },
    ]);
    expect(convertedResponse.next).toBeDefined();

    // Invoke the stubbed next method
    convertedResponse.next().then((response: ISearchResponse<any>) => {
      const contentResponse = response as IContentSearchResponse;
      expect(searchItemsMock.calls).toBeDefined();
      expect(searchItemsMock.calls.count()).toEqual(1);
      expect(searchItemsMock.calls.argsFor(0)).toEqual([
        {
          q: "12345",
          num: 1,
          start: 2,
          sortField: "title",
          sortOrder: "asc",
          aggregations: "type,access",
          authentication: undefined,
        },
      ]);
      expect(contentResponse.results).toEqual(
        portalApiResultsTwo.results.map(itemToContent)
      );
      expect(contentResponse.query).toEqual(portalApiResultsTwo.query);
      expect(contentResponse.total).toEqual(portalApiResultsTwo.total);
      expect(contentResponse.count).toEqual(portalApiResultsTwo.num);
      expect(contentResponse.hasNext).toEqual(true);
      expect(contentResponse.aggregations).toBeDefined();
      expect(convertedResponse.aggregations.counts).toEqual([
        {
          fieldName: "type",
          aggregations: [
            {
              label: "Feature Layer",
              value: 4,
            },
            {
              label: "Table",
              value: 1,
            },
          ],
        },
        {
          fieldName: "access",
          aggregations: [
            {
              label: "public",
              value: 3,
            },
            {
              label: "private",
              value: 1,
            },
            {
              label: "org",
              value: 1,
            },
          ],
        },
      ]);
      expect(contentResponse.next).toBeDefined();
      done();
    });
  });

  it("can use different UserSession objects for subsequent requests", (done) => {
    // Setup
    const itemOne: IItem = {
      id: "12345",
      title: "TITLE ONE",
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
      title: "TITLE TWO",
      type: "Table",
      owner: "you",
      tags: ["tag 3"],
      created: 2000,
      modified: 3000,
      numViews: 2,
      size: 6,
    };

    const userSessionOne = new UserSession({ portal: "dummy-portal-one" });
    const userSessionTwo = new UserSession({ portal: "dummy-portal-two" });

    const request: ISearchOptions = {
      q: "12345",
      sortOrder: "asc",
      sortField: "title",
      start: 1,
      num: 1,
      authentication: userSessionOne,
    };

    const portalApiResultsOne: ISearchResult<IItem> = {
      query: "12345",
      total: 2,
      start: 1,
      num: 1,
      nextStart: 2,
      results: [itemOne],
    };

    const portalApiResultsTwo: ISearchResult<IItem> = {
      query: "12345",
      total: 2,
      start: 2,
      num: 1,
      nextStart: -1,
      results: [itemTwo],
    };

    // Mock
    const searchItemsMock = spyOn(portal, "searchItems").and.returnValue(
      Promise.resolve(portalApiResultsTwo)
    );

    // Test
    const convertedResponse: IContentSearchResponse = convertPortalResponse(
      request,
      portalApiResultsOne
    );

    // Assert
    expect(convertedResponse).toBeDefined();
    expect(convertedResponse.results).toEqual(
      portalApiResultsOne.results.map(itemToContent)
    );
    expect(convertedResponse.query).toEqual(portalApiResultsOne.query);
    expect(convertedResponse.total).toEqual(portalApiResultsOne.total);
    expect(convertedResponse.count).toEqual(portalApiResultsOne.num);
    expect(convertedResponse.hasNext).toEqual(true);
    expect(convertedResponse.aggregations).toBeUndefined();
    expect(convertedResponse.next).toBeDefined();

    // Invoke the stubbed next method
    convertedResponse
      .next(userSessionTwo)
      .then((response: ISearchResponse<any>) => {
        const contentResponse = response as IContentSearchResponse;
        expect(searchItemsMock.calls).toBeDefined();
        expect(searchItemsMock.calls.count()).toEqual(1);
        expect(searchItemsMock.calls.argsFor(0)).toEqual([
          {
            q: "12345",
            num: 1,
            start: 2,
            sortField: "title",
            sortOrder: "asc",
            authentication: userSessionTwo,
          },
        ]);
        expect(contentResponse.results).toEqual(
          portalApiResultsTwo.results.map(itemToContent)
        );
        expect(contentResponse.query).toEqual(portalApiResultsTwo.query);
        expect(contentResponse.total).toEqual(portalApiResultsTwo.total);
        expect(contentResponse.count).toEqual(portalApiResultsTwo.num);
        expect(contentResponse.hasNext).toEqual(false);
        expect(contentResponse.aggregations).toBeUndefined();
        expect(contentResponse.next).toBeDefined();
        done();
      });
  });
});
