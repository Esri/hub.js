import { convertToHubParams } from "../../../src/content/helpers/convert-request-to-hub-params";
import { SortDirection } from "../../../src/types/common";
import {
  IBooleanOperator,
  IContentSearchFilter,
  IContentSearchOptions,
} from "../../../src/types/content";
import { btoa } from "@esri/hub-common";

describe("Convert Hub Params Function", () => {
  it("can convert content filters to hub API filters", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: ["me", "you"],
      created: { from: 1609459200000, to: 1612137600000 },
      modified: { from: 1609459200000, to: 1612137600000 },
      title: { bool: IBooleanOperator.NOT, value: ["a title", "b title"] },
      typekeywords: "a type keyword",
      tags: ["tag 1", "tag 2", "tag 3"],
      type: { value: ["Feature Layer", "Table", "CSV"] },
      access: "private",
      culture: ["en", "de"],
      categories: {
        value: ["category one", "category 2", "category three"],
        bool: IBooleanOperator.AND,
      },
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toEqual("any(me,you)");
    expect(hubParams.filter.created).toEqual("between(2021-01-01,2021-02-01)");
    expect(hubParams.filter.modified).toEqual("between(2021-01-01,2021-02-01)");
    expect(hubParams.filter.name).toEqual("not(a title,b title)");
    expect(hubParams.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParams.filter.tags).toEqual("any(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toEqual("any(Feature Layer,Table,CSV)");
    expect(hubParams.filter.access).toEqual("any(myself)");
    expect(hubParams.filter.culture).toEqual("any(en,de)");
    expect(hubParams.filter.categories).toEqual(
      "all(category one,category 2,category three)"
    );
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("can handle explicitly undefined filters, empty strings, empty arrays and malformed filters", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: [],
      created: { from: 1609459200000, to: 1612137600000 },
      modified: { from: 1609459200000, to: 1612137600000 },
      title: undefined,
      typekeywords: "",
      tags: ["tag 1", "tag 2", "tag 3"],
      type: { value: null },
      access: "",
      culture: [],
      categories: null,
      orgid: "",
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toBeUndefined();
    expect(hubParams.filter.created).toEqual("between(2021-01-01,2021-02-01)");
    expect(hubParams.filter.modified).toEqual("between(2021-01-01,2021-02-01)");
    expect(hubParams.filter.name).toBeUndefined();
    expect(hubParams.filter.typeKeywords).toBeUndefined();
    expect(hubParams.filter.tags).toEqual("any(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toBeUndefined();
    expect(hubParams.filter.access).toBeUndefined();
    expect(hubParams.filter.culture).toBeUndefined();
    expect(hubParams.filter.categories).toBeUndefined();
    expect(hubParams.catalog.orgId).toBeUndefined();
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("can handle partially applied created/modified filters", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: ["me", "you"],
      created: { from: 1609459200000 },
      modified: { to: 1612137600000 },
      title: undefined,
      typekeywords: "a type keyword",
      tags: ["tag 1", "tag 2", "tag 3"],
      type: { value: ["Feature Layer", "Table", "CSV"] },
      access: "private",
      culture: ["en", "de"],
      categories: {
        value: ["category one", "category 2", "category three"],
        bool: IBooleanOperator.AND,
      },
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toEqual("any(me,you)");
    expect(
      hubParams.filter.created.includes("between(2021-01-01,")
    ).toBeTruthy();
    expect(hubParams.filter.modified).toEqual("between(1970-01-01,2021-02-01)");
    expect(hubParams.filter.name).toBeUndefined();
    expect(hubParams.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParams.filter.tags).toEqual("any(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toEqual("any(Feature Layer,Table,CSV)");
    expect(hubParams.filter.access).toEqual("any(myself)");
    expect(hubParams.filter.culture).toEqual("any(en,de)");
    expect(hubParams.filter.categories).toEqual(
      "all(category one,category 2,category three)"
    );
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("can handle a falsey filter", () => {
    // Setup
    const filters: IContentSearchFilter = undefined;

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toBeUndefined();
    expect(hubParams.filter).toBeUndefined();
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("can separately convert filters and hub catalog-specific filters", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: { bool: IBooleanOperator.NOT, value: ["me", "you"] },
      created: { from: 1577836800000, to: 1580515200000 },
      modified: { from: 1580515200000, to: 1583020800000 },
      title: ["title 1", "title 2", "title 3"],
      typekeywords: "a type keyword",
      tags: { value: ["tag 1", "tag 2", "tag 3"], bool: IBooleanOperator.AND },
      type: "Feature Layer",
      access: ["private", "org"],
      culture: "en",
      categories: { value: ["category one", "category 2", "category three"] },
      orgid: ["org one", "org two"],
      id: { value: ["1", "2", "3"], bool: IBooleanOperator.NOT },
      initiativeid: "12345",
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toEqual("not(me,you)");
    expect(hubParams.filter.created).toEqual("between(2020-01-01,2020-02-01)");
    expect(hubParams.filter.modified).toEqual("between(2020-02-01,2020-03-01)");
    expect(hubParams.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParams.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParams.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toEqual("any(Feature Layer)");
    expect(hubParams.filter.access).toEqual("any(myself,organization)");
    expect(hubParams.filter.culture).toEqual("any(en)");
    expect(hubParams.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParams.catalog).toBeDefined();
    expect(hubParams.catalog.id).toEqual("not(1,2,3)");
    expect(hubParams.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParams.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("can properly create a hub-supported sort field", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: { bool: IBooleanOperator.NOT, value: ["me", "you"] },
      created: { from: 1577836800000, to: 1580515200000 },
      modified: { from: 1580515200000, to: 1583020800000 },
      title: ["title 1", "title 2", "title 3"],
      typekeywords: "a type keyword",
      tags: { value: ["tag 1", "tag 2", "tag 3"], bool: IBooleanOperator.AND },
      type: "Feature Layer",
      access: ["private", "org"],
      culture: "en",
      categories: { value: ["category one", "category 2", "category three"] },
      orgid: ["org one", "org two"],
      id: { value: ["1", "2", "3"], bool: IBooleanOperator.NOT },
      initiativeid: "12345",
    };

    const optionsOne: IContentSearchOptions = {
      sortField: "name",
      sortOrder: SortDirection.desc,
    };
    const optionsTwo: IContentSearchOptions = {
      sortField: "modified",
      sortOrder: SortDirection.asc,
    };
    const optionsThree: IContentSearchOptions = { sortField: "created" };

    // Test
    const hubParamsOne = convertToHubParams({
      filter: filters,
      options: optionsOne,
    });
    const hubParamsTwo = convertToHubParams({
      filter: filters,
      options: optionsTwo,
    });
    const hubParamsThree = convertToHubParams({
      filter: filters,
      options: optionsThree,
    });

    // Assert
    expect(hubParamsOne).toBeDefined();
    expect(hubParamsOne.q).toEqual("water");
    expect(hubParamsOne.filter).toBeDefined();
    expect(hubParamsOne.filter.owner).toEqual("not(me,you)");
    expect(hubParamsOne.filter.created).toEqual(
      "between(2020-01-01,2020-02-01)"
    );
    expect(hubParamsOne.filter.modified).toEqual(
      "between(2020-02-01,2020-03-01)"
    );
    expect(hubParamsOne.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParamsOne.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParamsOne.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParamsOne.filter.type).toEqual("any(Feature Layer)");
    expect(hubParamsOne.filter.access).toEqual("any(myself,organization)");
    expect(hubParamsOne.filter.culture).toEqual("any(en)");
    expect(hubParamsOne.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParamsOne.catalog).toBeDefined();
    expect(hubParamsOne.catalog.id).toEqual("not(1,2,3)");
    expect(hubParamsOne.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParamsOne.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParamsOne.sort).toBeDefined();
    expect(hubParamsOne.sort).toEqual("-name");
    expect(hubParamsOne.agg).toBeUndefined();
    expect(hubParamsOne.fields).toBeUndefined();

    expect(hubParamsTwo).toBeDefined();
    expect(hubParamsTwo.q).toEqual("water");
    expect(hubParamsTwo.filter).toBeDefined();
    expect(hubParamsTwo.filter.owner).toEqual("not(me,you)");
    expect(hubParamsTwo.filter.created).toEqual(
      "between(2020-01-01,2020-02-01)"
    );
    expect(hubParamsTwo.filter.modified).toEqual(
      "between(2020-02-01,2020-03-01)"
    );
    expect(hubParamsTwo.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParamsTwo.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParamsTwo.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParamsTwo.filter.type).toEqual("any(Feature Layer)");
    expect(hubParamsTwo.filter.access).toEqual("any(myself,organization)");
    expect(hubParamsTwo.filter.culture).toEqual("any(en)");
    expect(hubParamsTwo.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParamsTwo.catalog).toBeDefined();
    expect(hubParamsTwo.catalog.id).toEqual("not(1,2,3)");
    expect(hubParamsTwo.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParamsTwo.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParamsTwo.sort).toBeDefined();
    expect(hubParamsTwo.sort).toEqual("modified");
    expect(hubParamsTwo.agg).toBeUndefined();
    expect(hubParamsTwo.fields).toBeUndefined();

    expect(hubParamsThree).toBeDefined();
    expect(hubParamsThree.q).toEqual("water");
    expect(hubParamsThree.filter).toBeDefined();
    expect(hubParamsThree.filter.owner).toEqual("not(me,you)");
    expect(hubParamsThree.filter.created).toEqual(
      "between(2020-01-01,2020-02-01)"
    );
    expect(hubParamsThree.filter.modified).toEqual(
      "between(2020-02-01,2020-03-01)"
    );
    expect(hubParamsThree.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParamsThree.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParamsThree.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParamsThree.filter.type).toEqual("any(Feature Layer)");
    expect(hubParamsThree.filter.access).toEqual("any(myself,organization)");
    expect(hubParamsThree.filter.culture).toEqual("any(en)");
    expect(hubParamsThree.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParamsThree.catalog).toBeDefined();
    expect(hubParamsThree.catalog.id).toEqual("not(1,2,3)");
    expect(hubParamsThree.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParamsThree.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParamsThree.sort).toBeDefined();
    expect(hubParamsThree.sort).toEqual("created");
    expect(hubParamsThree.agg).toBeUndefined();
    expect(hubParamsThree.fields).toBeUndefined();
  });

  it("can properly create a hub-supported aggregations field", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: { bool: IBooleanOperator.NOT, value: ["me", "you"] },
      created: { from: 1577836800000, to: 1580515200000 },
      modified: { from: 1580515200000, to: 1583020800000 },
      title: ["title 1", "title 2", "title 3"],
      typekeywords: "a type keyword",
      tags: { value: ["tag 1", "tag 2", "tag 3"], bool: IBooleanOperator.AND },
      type: "Feature Layer",
      access: ["private", "org"],
      culture: "en",
      categories: { value: ["category one", "category 2", "category three"] },
      orgid: ["org one", "org two"],
      id: { value: ["1", "2", "3"], bool: IBooleanOperator.NOT },
      initiativeid: "12345",
    };

    const options: IContentSearchOptions = {
      sortField: "name",
      sortOrder: SortDirection.desc,
      aggregations: "downloadable,access,type,hasApi",
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters, options });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toEqual("not(me,you)");
    expect(hubParams.filter.created).toEqual("between(2020-01-01,2020-02-01)");
    expect(hubParams.filter.modified).toEqual("between(2020-02-01,2020-03-01)");
    expect(hubParams.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParams.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParams.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toEqual("any(Feature Layer)");
    expect(hubParams.filter.access).toEqual("any(myself,organization)");
    expect(hubParams.filter.culture).toEqual("any(en)");
    expect(hubParams.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParams.catalog).toBeDefined();
    expect(hubParams.catalog.id).toEqual("not(1,2,3)");
    expect(hubParams.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParams.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParams.sort).toBeDefined();
    expect(hubParams.sort).toEqual("-name");
    expect(hubParams.agg).toBeDefined();
    expect(hubParams.agg.fields).toEqual("downloadable,access,type,hasApi");
    expect(hubParams.fields).toBeUndefined();
  });

  it("can properly create a hub-supported fields field", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
      owner: { bool: IBooleanOperator.NOT, value: ["me", "you"] },
      created: { from: 1577836800000, to: 1580515200000 },
      modified: { from: 1580515200000, to: 1583020800000 },
      title: ["title 1", "title 2", "title 3"],
      typekeywords: "a type keyword",
      tags: { value: ["tag 1", "tag 2", "tag 3"], bool: IBooleanOperator.AND },
      type: "Feature Layer",
      access: ["private", "org"],
      culture: "en",
      categories: { value: ["category one", "category 2", "category three"] },
      orgid: ["org one", "org two"],
      id: { value: ["1", "2", "3"], bool: IBooleanOperator.NOT },
      initiativeid: "12345",
    };

    const options: IContentSearchOptions = {
      sortField: "name",
      sortOrder: SortDirection.desc,
      aggregations: "downloadable,access,type,hasApi",
      fields: "id,name,created,modified",
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters, options });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeDefined();
    expect(hubParams.filter.owner).toEqual("not(me,you)");
    expect(hubParams.filter.created).toEqual("between(2020-01-01,2020-02-01)");
    expect(hubParams.filter.modified).toEqual("between(2020-02-01,2020-03-01)");
    expect(hubParams.filter.name).toEqual("any(title 1,title 2,title 3)");
    expect(hubParams.filter.typeKeywords).toEqual("any(a type keyword)");
    expect(hubParams.filter.tags).toEqual("all(tag 1,tag 2,tag 3)");
    expect(hubParams.filter.type).toEqual("any(Feature Layer)");
    expect(hubParams.filter.access).toEqual("any(myself,organization)");
    expect(hubParams.filter.culture).toEqual("any(en)");
    expect(hubParams.filter.categories).toEqual(
      "any(category one,category 2,category three)"
    );
    expect(hubParams.catalog).toBeDefined();
    expect(hubParams.catalog.id).toEqual("not(1,2,3)");
    expect(hubParams.catalog.orgId).toEqual("any(org one,org two)");
    expect(hubParams.catalog.initiativeId).toEqual("any(12345)");
    expect(hubParams.sort).toBeDefined();
    expect(hubParams.sort).toEqual("-name");
    expect(hubParams.agg).toBeDefined();
    expect(hubParams.agg.fields).toEqual("downloadable,access,type,hasApi");
    expect(hubParams.fields).toBeDefined();
    expect(hubParams.fields.datasets).toEqual("id,name,created,modified");
  });

  it("can properly create a term only search", () => {
    // Setup
    const filters: IContentSearchFilter = {
      terms: "water",
    };

    // Test
    const hubParams = convertToHubParams({ filter: filters });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.q).toEqual("water");
    expect(hubParams.filter).toBeUndefined();
    expect(hubParams.catalog).toBeUndefined();
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });

  it("passes along paging info", () => {
    const pageParams = {
      hub: { start: 1, size: 10 },
      ago: { start: 3, size: 20 },
    };

    // Setup
    const options: IContentSearchOptions = {
      page: btoa(JSON.stringify(pageParams)),
    };

    // Test
    const hubParams = convertToHubParams({ options });

    // Assert
    expect(hubParams).toBeDefined();
    expect(hubParams.page).toEqual(pageParams);
    expect(hubParams.filter).toBeUndefined();
    expect(hubParams.catalog).toBeUndefined();
    expect(hubParams.sort).toBeUndefined();
    expect(hubParams.agg).toBeUndefined();
    expect(hubParams.fields).toBeUndefined();
  });
});
