import { createExtent } from "../../src";
import { IExtent } from "@esri/arcgis-rest-types";

describe("createExtent", function() {
  it("creates an extent with default spatial reference", function() {
    const extent: IExtent = {
      xmin: -122.68,
      ymin: 45.53,
      xmax: -122.45,
      ymax: 45.6,
      spatialReference: {
        wkid: 4326
      }
    };
    const result = createExtent(-122.68, 45.53, -122.45, 45.6);
    expect(result).toEqual(extent);
  });
  it("creates an extent with explicit spatial reference", function() {
    const extent: IExtent = {
      // autocasts as new Extent()
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: {
        wkid: 102100
      }
    };
    const result = createExtent(-9177811, 4247000, -9176791, 4247784, 102100);
    expect(result).toEqual(extent);
  });
});
