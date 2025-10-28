import { describe, it, expect, vi } from "vitest";
import { HubEntityType } from "../../../src/core/types/HubEntityType";
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
    const spy = vi.spyOn(
      getAssociationHierarchyModule,
      "getAssociationHierarchy"
    );
    spy.mockReturnValueOnce({ children: ["child1"], parents: [] } as any);
    spy.mockReturnValueOnce({ children: [], parents: ["parent1"] } as any);

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
