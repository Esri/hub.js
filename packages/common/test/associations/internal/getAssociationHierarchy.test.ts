import { HubEntityType } from "../../../src/core/types";
import { getAssociationHierarchy } from "../../../src/associations/internal/getAssociationHierarchy";

describe("getAssociationHierarchy:", () => {
  it("returns a valid IHubAssociationHierarchy for initiatives", () => {
    const chk = getAssociationHierarchy("initiative");

    expect(chk.parents.length).toBe(0);
    expect(chk.children).toEqual(["project"]);
  });
  it("returns a valid IHubAssociationHierarchy for projects", () => {
    const chk = getAssociationHierarchy("project");

    expect(chk.parents).toEqual(["initiative"]);
    expect(chk.children.length).toBe(0);
  });
  it("throws an error for unsupported entity types", () => {
    try {
      getAssociationHierarchy("unsupportedEntity" as HubEntityType);
    } catch (err) {
      expect(err.message).toBe(
        "getAssociationHierarchy: Invalid type for assosiations: unsupportedEntity."
      );
    }
  });
});
