import { parseDatasetId } from "../src/index";

describe("utils", () => {
  describe("parseDatasetId", function() {
    it("parse item id", () => {
      const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb");
      expect(result).toEqual({
        itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
        layerId: undefined
      });
    });
    it("parse item id and layer id", () => {
      const result = parseDatasetId("7a153563b0c74f7eb2b3eae8a66f2fbb_0");
      expect(result).toEqual({
        itemId: "7a153563b0c74f7eb2b3eae8a66f2fbb",
        layerId: "0"
      });
    });
  });
});
