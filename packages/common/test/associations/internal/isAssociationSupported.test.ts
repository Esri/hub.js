import { HubEntityType } from "../../../src/core/types";
import { isAssociationSupported } from "../../../src/associations/internal/isAssociationSupported";
import * as getAssociationHierarchyModule from "../../../src/associations/internal/getAssociationHierarchy";

describe("isAssociationSupported:", () => {
  it("returns true for supported associations", () => {
    const chk1 = isAssociationSupported("project", "initiative");
    expect(chk1).toBe(true);

    const chk2 = isAssociationSupported("initiative", "project");
    expect(chk2).toBe(true);
  });
  it("returns false if one of the provided entities doesn't have an association hierarchy defined", () => {
    spyOn(
      getAssociationHierarchyModule,
      "getAssociationHierarchy"
    ).and.returnValues(
      { children: ["child1"], parents: [] },
      { children: [], parents: ["parent1"] }
    );

    const chk = isAssociationSupported(
      "child1" as HubEntityType,
      "parent2" as HubEntityType
    );
    expect(chk).toBe(false);
  });
  it("returns false for unsupported associations", () => {
    const chk = isAssociationSupported("project", "group");
    expect(chk).toBe(false);
  });
});
