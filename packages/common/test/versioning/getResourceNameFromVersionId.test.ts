import { getResourceNameFromVersionId } from "../../src/versioning/_internal/getResourceNameFromVersionId";

describe("getResourceNameFromVersionId", () => {
  it("returns the appropriate resource name", async () => {
    const versionId = "abc123";
    const result = getResourceNameFromVersionId(versionId);
    expect(result).toBe("hubVersion_abc123/version.json");
  });
});
