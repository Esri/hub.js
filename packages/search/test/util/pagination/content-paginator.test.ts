import { random } from "faker";
import { encode } from "base-64";
import { pageContent } from "../../../src/util/pagination/content-paginator";
import { IPageResponse } from "../../../src/util/pagination/paginator";

describe("Page Content function", () => {
  it("can properly page current content search results when ago and hub results are returned with more remaining", () => {
    // Setup
    const start = { hub: 3, ago: 2 };
    const page = {
      hubRecordsAdded: 7,
      agoRecordsAdded: 3,
      hubRecordsTotal: 15,
      agoRecordsTotal: 7
    };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjV9");
    expect(nextPage.total).toEqual(22);
    expect(nextPage.hasNextPage).toEqual(true);
  });

  it("can properly page current content search results when only hub results are returned with more remaining", () => {
    // Setup
    const startOne = { hub: 3, ago: undefined as number };
    const pageOne = {
      hubRecordsAdded: 7,
      agoRecordsAdded: undefined as number,
      hubRecordsTotal: 15,
      agoRecordsTotal: undefined as number
    };

    const startTwo = { hub: 3, ago: null as number };
    const pageTwo = {
      hubRecordsAdded: 7,
      agoRecordsAdded: null as number,
      hubRecordsTotal: 15,
      agoRecordsTotal: null as number
    };

    const startThree = { hub: 3, ago: 0 };
    const pageThree = {
      hubRecordsAdded: 7,
      agoRecordsAdded: 0,
      hubRecordsTotal: 15,
      agoRecordsTotal: 0
    };

    // Test
    const nextPageOne: IPageResponse = pageContent(startOne, pageOne);
    const nextPageTwo: IPageResponse = pageContent(startTwo, pageTwo);
    const nextPageThree: IPageResponse = pageContent(startThree, pageThree);

    // Assertions
    expect(nextPageOne.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageOne.total).toEqual(15);
    expect(nextPageOne.hasNextPage).toEqual(true);

    expect(nextPageTwo.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageTwo.total).toEqual(15);
    expect(nextPageTwo.hasNextPage).toEqual(true);

    expect(nextPageThree.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageThree.total).toEqual(15);
    expect(nextPageThree.hasNextPage).toEqual(true);
  });

  it("can properly page current content search results when only ago results are returned with more remaining", () => {
    // Setup
    const startOne = { hub: undefined as number, ago: 2 };
    const pageOne = {
      hubRecordsAdded: undefined as number,
      agoRecordsAdded: 3,
      hubRecordsTotal: undefined as number,
      agoRecordsTotal: 7
    };

    const startTwo = { hub: null as number, ago: 2 };
    const pageTwo = {
      hubRecordsAdded: null as number,
      agoRecordsAdded: 3,
      hubRecordsTotal: null as number,
      agoRecordsTotal: 7
    };

    const startThree = { hub: 0, ago: 2 };
    const pageThree = {
      hubRecordsAdded: 0,
      agoRecordsAdded: 3,
      hubRecordsTotal: 0,
      agoRecordsTotal: 7
    };

    // Test
    const nextPageOne: IPageResponse = pageContent(startOne, pageOne);
    const nextPageTwo: IPageResponse = pageContent(startTwo, pageTwo);
    const nextPageThree: IPageResponse = pageContent(startThree, pageThree);

    // Assertions
    expect(nextPageOne.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageOne.total).toEqual(7);
    expect(nextPageOne.hasNextPage).toEqual(true);

    expect(nextPageTwo.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageTwo.total).toEqual(7);
    expect(nextPageTwo.hasNextPage).toEqual(true);

    expect(nextPageThree.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageThree.total).toEqual(7);
    expect(nextPageThree.hasNextPage).toEqual(true);
  });

  it("can properly page random search results with more remaining", () => {
    // Setup
    const hubStart: number = random.number(50);
    const agoStart: number = random.number(100);
    const hubRecordsAdded: number = random.number(10);
    const agoRecordsAdded: number = 10 - hubRecordsAdded;
    const hubRecordsTotal: number = hubStart * 2;
    const agoRecordsTotal: number = agoStart * 2;
    const expectedCursor = JSON.stringify({
      hub: hubStart + hubRecordsAdded,
      ago: agoStart + agoRecordsAdded
    });

    const start = { hub: hubStart, ago: agoStart };
    const page = {
      hubRecordsAdded,
      agoRecordsAdded,
      hubRecordsTotal,
      agoRecordsTotal
    };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual(encode(expectedCursor));
    expect(nextPage.total).toEqual(hubRecordsTotal + agoRecordsTotal);
    expect(nextPage.hasNextPage).toEqual(true);
  });

  it("can properly page current content search results when ago and hub results are returned with no more remaining", () => {
    // Setup
    const start = { hub: 3, ago: 2 };
    const page = {
      hubRecordsAdded: 7,
      agoRecordsAdded: 3,
      hubRecordsTotal: 10,
      agoRecordsTotal: 5
    };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjV9");
    expect(nextPage.total).toEqual(15);
    expect(nextPage.hasNextPage).toEqual(false);
  });

  it("can properly page current content search results when only hub results are returned with more remaining", () => {
    // Setup
    const startOne = { hub: 3, ago: undefined as number };
    const pageOne = {
      hubRecordsAdded: 7,
      agoRecordsAdded: undefined as number,
      hubRecordsTotal: 10,
      agoRecordsTotal: undefined as number
    };

    const startTwo = { hub: 3, ago: null as number };
    const pageTwo = {
      hubRecordsAdded: 7,
      agoRecordsAdded: null as number,
      hubRecordsTotal: 10,
      agoRecordsTotal: null as number
    };

    const startThree = { hub: 3, ago: 0 };
    const pageThree = {
      hubRecordsAdded: 7,
      agoRecordsAdded: 0,
      hubRecordsTotal: 10,
      agoRecordsTotal: 0
    };

    // Test
    const nextPageOne: IPageResponse = pageContent(startOne, pageOne);
    const nextPageTwo: IPageResponse = pageContent(startTwo, pageTwo);
    const nextPageThree: IPageResponse = pageContent(startThree, pageThree);

    // Assertions
    expect(nextPageOne.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageOne.total).toEqual(10);
    expect(nextPageOne.hasNextPage).toEqual(false);

    expect(nextPageTwo.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageTwo.total).toEqual(10);
    expect(nextPageTwo.hasNextPage).toEqual(false);

    expect(nextPageThree.cursor).toEqual("eyJodWIiOjEwLCJhZ28iOjB9");
    expect(nextPageThree.total).toEqual(10);
    expect(nextPageThree.hasNextPage).toEqual(false);
  });

  it("can properly page current content search results when only ago results are returned with more remaining", () => {
    // Setup
    const startOne = { hub: undefined as number, ago: 2 };
    const pageOne = {
      hubRecordsAdded: undefined as number,
      agoRecordsAdded: 3,
      hubRecordsTotal: undefined as number,
      agoRecordsTotal: 5
    };

    const startTwo = { hub: null as number, ago: 2 };
    const pageTwo = {
      hubRecordsAdded: null as number,
      agoRecordsAdded: 3,
      hubRecordsTotal: null as number,
      agoRecordsTotal: 5
    };

    const startThree = { hub: 0, ago: 2 };
    const pageThree = {
      hubRecordsAdded: 0,
      agoRecordsAdded: 3,
      hubRecordsTotal: 0,
      agoRecordsTotal: 5
    };

    // Test
    const nextPageOne: IPageResponse = pageContent(startOne, pageOne);
    const nextPageTwo: IPageResponse = pageContent(startTwo, pageTwo);
    const nextPageThree: IPageResponse = pageContent(startThree, pageThree);

    // Assertions
    expect(nextPageOne.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageOne.total).toEqual(5);
    expect(nextPageOne.hasNextPage).toEqual(false);

    expect(nextPageTwo.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageTwo.total).toEqual(5);
    expect(nextPageTwo.hasNextPage).toEqual(false);

    expect(nextPageThree.cursor).toEqual("eyJodWIiOjAsImFnbyI6NX0=");
    expect(nextPageThree.total).toEqual(5);
    expect(nextPageThree.hasNextPage).toEqual(false);
  });

  it("can properly page random search results with no more remaining", () => {
    // Setup
    const hubStart: number = random.number(50);
    const agoStart: number = random.number(100);
    const hubRecordsAdded: number = random.number(10);
    const agoRecordsAdded: number = 10 - hubRecordsAdded;
    const hubRecordsTotal: number = hubStart + hubRecordsAdded;
    const agoRecordsTotal: number = agoStart + agoRecordsAdded;
    const expectedCursor = JSON.stringify({
      hub: hubStart + hubRecordsAdded,
      ago: agoStart + agoRecordsAdded
    });

    const start = { hub: hubStart, ago: agoStart };
    const page = {
      hubRecordsAdded,
      agoRecordsAdded,
      hubRecordsTotal,
      agoRecordsTotal
    };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual(encode(expectedCursor));
    expect(nextPage.total).toEqual(hubRecordsTotal + agoRecordsTotal);
    expect(nextPage.hasNextPage).toEqual(false);
  });
});
