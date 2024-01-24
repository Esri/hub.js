import {
  isValidExtent,
  allCoordinatesPossiblyWGS84,
  GeoJSONPolygonToBBox,
} from "../../src/extent";
import { IExtent } from "@esri/arcgis-rest-types";

describe("isValidExtent", function () {
  it("identifies valid extent coordinate array", function () {
    const extent: object = [
      [-122.68, 45.53],
      [-122.45, 45.6],
    ];
    const result = isValidExtent(extent);
    expect(result).toBeTruthy();
  });
  it("identifies valid extent JSON", function () {
    const extent: IExtent = {
      xmin: -122.68,
      ymin: 45.53,
      xmax: -122.45,
      ymax: 45.6,
      spatialReference: {
        wkid: 4326,
      },
    };
    const result = isValidExtent(extent);
    expect(result).toBeTruthy();
  });
  it("identifies invalid extent", function () {
    const extent: object = {
      str: "I am invalid",
    };
    const result = isValidExtent(extent);
    expect(result).toBeFalsy();
  });
});

describe("allCoordinatesPossiblyWGS84", function () {
  it("returns true for valid WGS84 coordinates", function () {
    const coordinates: number[][] = [
      [-122.68, 45.53],
      [-122.45, 45.6],
    ];
    const result = allCoordinatesPossiblyWGS84(coordinates);
    expect(result).toBeTruthy();
  });

  it("returns false for invalid WGS84 coordinates", function () {
    const coordinates: number[][] = [
      [-122.68, 45.53],
      [-122.45, 95.6],
    ];
    const result = allCoordinatesPossiblyWGS84(coordinates);
    expect(result).toBeFalsy();
  });

  it("returns true for valid single coordinate", function () {
    const coordinates: number[] = [-122.68, 45.53];
    const result = allCoordinatesPossiblyWGS84(coordinates);
    expect(result).toBeTruthy();
  });

  it("returns false for invalid single coordinate", function () {
    const coordinates: number[] = [-122.68, 195.53];
    const result = allCoordinatesPossiblyWGS84(coordinates);
    expect(result).toBeFalsy();
  });
});

describe("GeoJSONPolygonToBBox", function () {
  it("returns the correct bounding box for a polygon", function () {
    const polygon = {
      coordinates: [
        [
          [-122.68, 45.53],
          [-122.45, 45.6],
          [-122.6, 45.7],
          [-122.8, 45.8],
          [-122.68, 45.53],
        ],
      ],
    };
    const result = GeoJSONPolygonToBBox(polygon);
    expect(result).toEqual([
      [-122.8, 45.53],
      [-122.45, 45.8],
    ]);
  });

  it("returns the correct bounding box for a polygon with multiple rings", function () {
    const polygon = {
      coordinates: [
        [
          [-122.68, 45.53],
          [-122.45, 45.6],
          [-122.6, 45.7],
          [-122.8, 45.8],
          [-122.68, 45.53],
        ],
        [
          [-122.7, 45.55],
          [-122.55, 45.62],
          [-122.65, 45.72],
          [-122.85, 45.82],
          [-122.7, 45.55],
        ],
      ],
    };
    const result = GeoJSONPolygonToBBox(polygon);
    expect(result).toEqual([
      [-122.85, 45.53],
      [-122.45, 45.82],
    ]);
  });

  it("returns the correct bounding box for a polygon with negative coordinates", function () {
    const polygon = {
      coordinates: [
        [
          [-122.68, -45.53],
          [-122.45, -45.6],
          [-122.6, -45.7],
          [-122.8, -45.8],
          [-122.68, -45.53],
        ],
      ],
    };
    const result = GeoJSONPolygonToBBox(polygon);
    expect(result).toEqual([
      [-122.8, -45.8],
      [-122.45, -45.53],
    ]);
  });

  it("returns the correct bounding box for a polygon with a single point", function () {
    const polygon = {
      coordinates: [[[-122.68, 45.53]]],
    };
    const result = GeoJSONPolygonToBBox(polygon);
    expect(result).toEqual([
      [-122.68, 45.53],
      [-122.68, 45.53],
    ]);
  });
});
