import { IFilter } from "../../../src/search/types/IHubCatalog";
import { getTopLevelPredicate } from "../../../src/search/_internal/commonHelpers/getTopLevelPredicate";

describe("getTopLevelPredicate |", () => {
  it("returns null when passed an empty array", () => {
    const result = getTopLevelPredicate("bbox", []);
    expect(result).toBeNull();
  });
  it("returns null when passed when predicate has nil value", () => {
    const result = getTopLevelPredicate("bbox", [
      { predicates: [{ bbox: undefined }] },
    ]);
    expect(result).toBeNull();
  });
  it("returns null when passed when predicate has empty string value", () => {
    const result = getTopLevelPredicate("bbox", [
      { predicates: [{ bbox: "" }] },
    ]);
    expect(result).toBeNull();
  });
  it("throws an error when more than 1 filter with target field predicates are passed in", () => {
    const filters: IFilter[] = [
      { predicates: [{ bbox: "1,2,3,4" }] },
      { predicates: [{ bbox: "4,5,6,7" }] },
    ];

    try {
      getTopLevelPredicate("bbox", filters);
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toEqual(
        "Only 1 IFilter can have a 'bbox' predicate but 2 were detected"
      );
    }
  });

  it("throws an error when a filter with more than one target field predicate is passed in", () => {
    const filters: IFilter[] = [
      {
        predicates: [{ bbox: "1,2,3,4" }, { bbox: "4,5,6,7" }],
      },
    ];

    try {
      getTopLevelPredicate("bbox", filters);
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toEqual(
        "Only 1 'bbox' predicate is allowed but 2 were detected"
      );
    }
  });

  it("throws an error when a target field predicate is ORd with another predicate", () => {
    const filters: IFilter[] = [
      {
        operation: "OR",
        predicates: [{ bbox: "1,2,3,4" }, { type: "typeA" }],
      },
    ];

    try {
      getTopLevelPredicate("bbox", filters);
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toEqual(
        "'bbox' predicates cannot be OR'd to other predicates"
      );
    }
  });

  it("throws an error when a target field predicate is an array", () => {
    const filters: IFilter[] = [
      {
        predicates: [{ bbox: ["1,2,3,4", "5,6,7,8"] }],
      },
    ];

    try {
      getTopLevelPredicate("bbox", filters);
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toEqual(
        "'bbox' predicate must be a string or boolean primitive. string[] and IMatchOptions are not allowed."
      );
    }
  });

  it("throws an error when a target field predicate is an IMatchOptions", () => {
    const filters: IFilter[] = [
      {
        predicates: [
          {
            bbox: {
              any: ["1,2,3,4", "5,6,7,8"],
            },
          },
        ],
      },
    ];

    try {
      getTopLevelPredicate("bbox", filters);
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toEqual(
        "'bbox' predicate must be a string or boolean primitive. string[] and IMatchOptions are not allowed."
      );
    }
  });

  it("returns the predicate when the target field predicate is a string", () => {
    const expected = { bbox: "1,2,3,4" };
    const filters: IFilter[] = [
      {
        predicates: [expected],
      },
    ];

    const result = getTopLevelPredicate("bbox", filters);
    expect(result).toBe(expected);
  });
});
