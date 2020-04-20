import { extentToBBox } from "../../src";
import { IExtent } from "@esri/arcgis-rest-types";

describe("extentToBBox", function() {
  it("converts extent to bbox", function() {
    const extent: IExtent = {
      xmin: 132,
      ymin: 435,
      xmax: 429,
      ymax: 192
    };

    const result = extentToBBox(extent);

    expect(result).toEqual([
      [extent.xmin, extent.ymin],
      [extent.xmax, extent.ymax]
    ]);
  });
});
