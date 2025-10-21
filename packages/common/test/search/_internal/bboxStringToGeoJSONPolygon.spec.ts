import { bboxStringToGeoJSONPolygon } from "../../../src/search/_internal/bboxStringToGeoJSONPolygon";
import { BBOX, GEOMETRY_FIXTURE } from "./fixtures";

describe("bboxStringToGeoJSONPolygon", () => {
  it("should transform a bbox string to a geojson polygon", () => {
    const results = bboxStringToGeoJSONPolygon(BBOX);
    expect(results).toEqual(GEOMETRY_FIXTURE);
  });
});
