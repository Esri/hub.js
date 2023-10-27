import {
  IAggregationResult,
  mergeAggregations,
} from "../../../src/util/aggregations/merge-aggregations";

describe("Merge Aggregation Function", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("can properly merge several lists of aggregations with a default merge function", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 5,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 10,
          },
        ],
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 17,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "1",
            value: 12,
          },
          {
            label: "feature layer",
            value: 7,
          },
        ],
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: 12,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "feature layer",
            value: 2,
          },
        ],
      },
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "public",
            value: 22,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 22,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "1",
            value: 12,
          },
          {
            label: "feature layer",
            value: 9,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree,
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly merge several lists of aggregations with a custom merge function", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 5,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 10,
          },
        ],
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 17,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "1",
            value: 12,
          },
          {
            label: "feature layer",
            value: 7,
          },
        ],
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: 12,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "feature layer",
            value: 2,
          },
        ],
      },
    ];

    const mergeFunc: any = (one: number, two: number) => Math.max(one, two);

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "public",
            value: 17,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 12,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "1",
            value: 12,
          },
          {
            label: "feature layer",
            value: 7,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations(
      [aggregationsOne, aggregationsTwo, aggregationsThree],
      mergeFunc
    );

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly ignore falsey field values when merging with truthy values with the same label", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: null,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 4,
          },
        ],
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 17,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: undefined,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "public",
            value: 17,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 4,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree,
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can ignore aggregations entirely when all field values are falsey for a given label", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: null,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: undefined,
          },
        ],
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: undefined,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: null,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "1",
            value: 23,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree,
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly ignore field names with no aggregations", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: 5,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [],
      },
      {
        fieldName: "type",
        aggregations: undefined,
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            value: undefined,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: null,
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: 20,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "public",
            value: 5,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "a_category",
            value: 20,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree,
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly merge several lists of aggregations with mixedCasings", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "PUBLIC",
            value: 5,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "0",
            value: 2,
          },
        ],
      },
      {
        fieldName: "CATEGORY",
        aggregations: [
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_Category",
            value: 10,
          },
        ],
      },
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "ACCESS",
        aggregations: [
          {
            label: "public",
            value: 17,
          },
          {
            label: "shared",
            value: 5,
          },
          {
            label: "1",
            value: 4,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "1",
            value: 12,
          },
          {
            label: "FeaTure laYer",
            value: 7,
          },
        ],
      },
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            value: 12,
          },
          {
            label: "0",
            value: 9,
          },
        ],
      },
      {
        fieldName: "TYPE",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "FeaturE LayeR",
            value: 2,
          },
        ],
      },
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            value: 2,
          },
          {
            label: "1",
            value: 4,
          },
          {
            label: "public",
            value: 22,
          },
          {
            label: "private",
            value: 3,
          },
          {
            label: "shared",
            value: 5,
          },
        ],
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            value: 9,
          },
          {
            label: "1",
            value: 23,
          },
          {
            label: "a_category",
            value: 22,
          },
        ],
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            value: 6,
          },
          {
            label: "1",
            value: 12,
          },
          {
            label: "feature layer",
            value: 9,
          },
        ],
      },
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree,
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("returns an empty array with falsey input", () => {
    // Test
    const one: any = mergeAggregations(null);
    const two: any = mergeAggregations(undefined);
    const three: any = mergeAggregations();

    // Assert
    expect(one).toEqual([]);
    expect(two).toEqual([]);
    expect(three).toEqual([]);
  });
});
