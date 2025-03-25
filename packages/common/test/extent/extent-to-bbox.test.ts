import { extentToBBox } from "../../src";
import type { IExtent } from "@esri/arcgis-rest-feature-layer";

describe("extentToBBox", function () {
  it("converts extent to bbox", function () {
    const extent: IExtent = {
      xmin: 132,
      ymin: 435,
      xmax: 429,
      ymax: 192,
    };

    const result = extentToBBox(extent);

    expect(result).toEqual([
      [extent.xmin, extent.ymin],
      [extent.xmax, extent.ymax],
    ]);
  });
});
