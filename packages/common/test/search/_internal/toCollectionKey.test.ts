import { toCollectionKey } from "../../../src/search/_internal/commonHelpers/toCollectionKey";

describe("toCollectionKey", () => {
  it("lowercases most search categories", () => {
    const result = toCollectionKey("Document");
    expect(result).toBe("document");
  });
  it("properly handles irregular search categories", () => {
    const result = toCollectionKey("App,Map");
    expect(result).toBe("appAndMap");
  });
});
