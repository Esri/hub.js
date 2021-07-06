import { isValidExtent } from "../../src/extent";
import { IExtent } from "@esri/arcgis-rest-types";

describe("isValidExtent", function() {
  it("identifies valid extent coordinate array", function() {
    const extent: object = [[-122.68, 45.53], [-122.45, 45.6]];
    const result = isValidExtent(extent);
    expect(result).toBeTruthy();
  });
  it("identifies valid extent JSON", function() {
    const extent: IExtent = {
      xmin: -122.68,
      ymin: 45.53,
      xmax: -122.45,
      ymax: 45.6,
      spatialReference: {
        wkid: 4326
      }
    };
    const result = isValidExtent(extent);
    expect(result).toBeTruthy();
  });
  it("identifies invalid extent", function() {
    const extent: object = {
      str: "I am invalid"
    };
    const result = isValidExtent(extent);
    expect(result).toBeFalsy();
  });
});
