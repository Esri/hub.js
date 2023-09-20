import { AssociationType } from "../../../src";
import { getTypeFromAssociationType } from "../../../src/associations/internal/getTypeFromAssociationType";

describe("getTypeFromAssociationType:", () => {
  it("throws if passed an invalid type", () => {
    try {
      getTypeFromAssociationType("INVALID" as AssociationType);
    } catch (ex) {
      expect(ex.message).toContain("Invalid association type INVALID");
    }
  });
  it("returns item for initiative", () => {
    expect(getTypeFromAssociationType("initiative")).toEqual("Hub Initiative");
  });
});
