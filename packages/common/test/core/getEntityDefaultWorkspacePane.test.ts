import { getEntityDefaultWorkspacePane } from "../../src/core/getEntityDefaultWorkspacePane";

describe("getRelativeWorkspaceUrl", () => {
  it("returns default for entity type", () => {
    const result = getEntityDefaultWorkspacePane("discussion");
    expect(result).toEqual("details");
  });
  it("returns undefined if no default set", () => {
    const result = getEntityDefaultWorkspacePane("fake");
    expect(result).toBeUndefined();
  });
});
