import { bboxStringToGeoJSONPolygon } from "../../../src/search/_internal/bboxStringToGeoJSONPolygon";

describe("bboxStringToGeoJSONPolygon", () => {
  it("should transform a bbox string to a geojson polygon", () => {
    const bbox =
      "126.2274169922485, -42.559149812106845, -25.647583007805757, 83.1100826092665";
    const results = bboxStringToGeoJSONPolygon(bbox);
    expect(results).toEqual({
      type: "Polygon",
      coordinates: [
        [
          [-25.647583007805757, -42.559149812106845],
          [126.2274169922485, -42.559149812106845],
          [126.2274169922485, 83.1100826092665],
          [-25.647583007805757, 83.1100826092665],
          [-25.647583007805757, -42.559149812106845],
        ],
      ],
    });
  });
});
