import { isValidEntityType } from "../../src/core/isValidEntityType";

describe("isValidEntityType", () => {
  let result;

  it("returns true for a valid entity type", () => {
    result = isValidEntityType("project");
    expect(result).toBeTruthy();
  });
  it("returns false for an invalid entity type", () => {
    result = isValidEntityType("invalid-type");
    expect(result).toBeFalsy();
  });
});
