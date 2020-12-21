import { random } from "faker";
import { encode } from "base-64";
import { pageContent } from "../../../src/util/pagination/content-paginator";
import { IPageResponse } from "../../../src/util/pagination/paginator";

describe("Page Content function", () => {
  it("can properly page current content search results when ago and hub results are returned with more remaining", () => {
    // Setup
    const start = { hub: 3, ago: 2 };
    const page = { hubAdded: 7, agoAdded: 3, hubTotal: 15, agoTotal: 7 };

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
      hubAdded: 7,
      agoAdded: undefined as number,
      hubTotal: 15,
      agoTotal: undefined as number
    };

    const startTwo = { hub: 3, ago: null as number };
    const pageTwo = {
      hubAdded: 7,
      agoAdded: null as number,
      hubTotal: 15,
      agoTotal: null as number
    };

    const startThree = { hub: 3, ago: 0 };
    const pageThree = { hubAdded: 7, agoAdded: 0, hubTotal: 15, agoTotal: 0 };

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
      hubAdded: undefined as number,
      agoAdded: 3,
      hubTotal: undefined as number,
      agoTotal: 7
    };

    const startTwo = { hub: null as number, ago: 2 };
    const pageTwo = {
      hubAdded: null as number,
      agoAdded: 3,
      hubTotal: null as number,
      agoTotal: 7
    };

    const startThree = { hub: 0, ago: 2 };
    const pageThree = { hubAdded: 0, agoAdded: 3, hubTotal: 0, agoTotal: 7 };

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
    const hubAdded: number = random.number(10);
    const agoAdded: number = 10 - hubAdded;
    const hubTotal: number = hubStart * 2;
    const agoTotal: number = agoStart * 2;
    const expectedCursor = JSON.stringify({
      hub: hubStart + hubAdded,
      ago: agoStart + agoAdded
    });

    const start = { hub: hubStart, ago: agoStart };
    const page = { hubAdded, agoAdded, hubTotal, agoTotal };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual(encode(expectedCursor));
    expect(nextPage.total).toEqual(hubTotal + agoTotal);
    expect(nextPage.hasNextPage).toEqual(true);
  });

  it("can properly page current content search results when ago and hub results are returned with no more remaining", () => {
    // Setup
    const start = { hub: 3, ago: 2 };
    const page = { hubAdded: 7, agoAdded: 3, hubTotal: 10, agoTotal: 5 };

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
      hubAdded: 7,
      agoAdded: undefined as number,
      hubTotal: 10,
      agoTotal: undefined as number
    };

    const startTwo = { hub: 3, ago: null as number };
    const pageTwo = {
      hubAdded: 7,
      agoAdded: null as number,
      hubTotal: 10,
      agoTotal: null as number
    };

    const startThree = { hub: 3, ago: 0 };
    const pageThree = { hubAdded: 7, agoAdded: 0, hubTotal: 10, agoTotal: 0 };

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
      hubAdded: undefined as number,
      agoAdded: 3,
      hubTotal: undefined as number,
      agoTotal: 5
    };

    const startTwo = { hub: null as number, ago: 2 };
    const pageTwo = {
      hubAdded: null as number,
      agoAdded: 3,
      hubTotal: null as number,
      agoTotal: 5
    };

    const startThree = { hub: 0, ago: 2 };
    const pageThree = { hubAdded: 0, agoAdded: 3, hubTotal: 0, agoTotal: 5 };

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
    const hubAdded: number = random.number(10);
    const agoAdded: number = 10 - hubAdded;
    const hubTotal: number = hubStart + hubAdded;
    const agoTotal: number = agoStart + agoAdded;
    const expectedCursor = JSON.stringify({
      hub: hubStart + hubAdded,
      ago: agoStart + agoAdded
    });

    const start = { hub: hubStart, ago: agoStart };
    const page = { hubAdded, agoAdded, hubTotal, agoTotal };

    // Test
    const nextPage: IPageResponse = pageContent(start, page);

    // Assertions
    expect(nextPage.cursor).toEqual(encode(expectedCursor));
    expect(nextPage.total).toEqual(hubTotal + agoTotal);
    expect(nextPage.hasNextPage).toEqual(false);
  });
});
