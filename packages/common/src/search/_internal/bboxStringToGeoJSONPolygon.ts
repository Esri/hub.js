import { Polygon } from "geojson";

/**
 * Given a bounding box string, e.g. "126.2274169922485, -42.559149812106845, -25.647583007805757, 83.1100826092665",
 * convert it into a geojson Polygon object
 * @param bbox The bounding box string
 * @returns a geojson Polygon object derived from the given bounding box string
 */
export function bboxStringToGeoJSONPolygon(bbox: string): Polygon {
  const [lon1, lat1, lon2, lat2] = bbox
    .split(",")
    .map((vertex) => parseFloat(vertex.trim()));
  const minLon = Math.min(lon1, lon2);
  const minLat = Math.min(lat1, lat2);
  const maxLon = Math.max(lon1, lon2);
  const maxLat = Math.max(lat1, lat2);
  return {
    type: "Polygon",
    coordinates: [
      [
        [minLon, minLat],
        [maxLon, minLat],
        [maxLon, maxLat],
        [minLon, maxLat],
        [minLon, minLat],
      ],
    ],
  };
}
