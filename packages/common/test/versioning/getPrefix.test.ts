import { getPrefix } from "../../src/versioning/_internal/getPrefix";

describe("getPrefix", () => {
  it("returns the appropriate prefix", async () => {
    const versionId = "abc123";
    const result = getPrefix(versionId);
    expect(result).toBe("hubVersion_abc123");
  });
});
