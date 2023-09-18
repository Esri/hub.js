import { AssociationType } from "../../../src";
import { getTargetEntityFromAssociationType } from "../../../src/associations/internal/getTargetEntityFromAssociationType";

describe("getTargetEntityFromAssociationType:", () => {
  it("throws if passed an invalid type", () => {
    try {
      getTargetEntityFromAssociationType("INVALID" as AssociationType);
    } catch (ex) {
      expect(ex.message).toContain("Invalid association type INVALID");
    }
  });
  it("returns item for initiative", () => {
    expect(getTargetEntityFromAssociationType("initiative")).toEqual("item");
  });
});
