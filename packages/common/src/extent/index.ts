export * from "./get-geographic-org-extent";
export * from "./extent-to-bbox";
export * from "./get-org-extent-as-bbox";
export * from "./create-extent";

function isExtentCoordinateArray(extent: object) {
  return (
    Array.isArray(extent) &&
    Array.isArray(extent[0]) &&
    Array.isArray(extent[1])
  );
}

function isExtentEnvelope(extent: any) {
  return isExtentCoordinateArray(extent.coordinates);
}

function isExtentJSON(extent: any) {
  return ["xmin", "ymin", "xmax", "ymax"].every(
    key => typeof extent[key] === "number"
  );
}

/**
 * Check if the given extent is in a known format
 * @param  {Object} extent extent in any format
 * @return {Boolean}       indicator
 */
export function isValidExtent(extent: object) {
  return (
    !!extent &&
    [isExtentEnvelope, isExtentCoordinateArray, isExtentJSON].some(test =>
      test(extent)
    )
  );
}
