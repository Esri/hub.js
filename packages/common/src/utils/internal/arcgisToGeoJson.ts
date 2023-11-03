// @terraformer/arcgis
// https://github.com/terraformer-js/terraformer/blob/main/packages/arcgis/README.md
const edgeIntersectsEdge = (
  a1: number[],
  a2: number[],
  b1: number[],
  b2: number[]
) => {
  const uaT =
    (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
  const ubT =
    (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
  const uB =
    (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
  if (uB !== 0) {
    const ua = uaT / uB;
    const ub = ubT / uB;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return true;
    }
  }
  return false;
};
const arrayIntersectsArray = (a: number[][], b: number[][]) => {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
        return true;
      }
    }
  }
  return false;
};
const coordinatesContainPoint = (coordinates: number[][], point: number[]) => {
  let contains = false;
  /* tslint:disable one-variable-per-declaration */
  for (let i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
    if (
      ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
        (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
      point[0] <
        ((coordinates[j][0] - coordinates[i][0]) *
          (point[1] - coordinates[i][1])) /
          (coordinates[j][1] - coordinates[i][1]) +
          coordinates[i][0]
    ) {
      contains = !contains;
    }
  }
  return contains;
};
const pointsEqual = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
const closeRing = (coordinates: number[][]) => {
  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
};
const ringIsClockwise = (ringToTest: number[][]) => {
  let total = 0;
  let i = 0;
  const rLength = ringToTest.length;
  let pt1 = ringToTest[i];
  let pt2;
  for (i; i < rLength - 1; i++) {
    pt2 = ringToTest[i + 1];
    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
    pt1 = pt2;
  }
  return total >= 0;
};
const shallowClone = (obj: Record<string, any>) => {
  const target: Record<string, any> = {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
};
const coordinatesContainCoordinates = (
  outer: number[][],
  inner: number[][]
) => {
  const intersects = arrayIntersectsArray(outer, inner);
  const contains = coordinatesContainPoint(outer, inner[0]);
  if (!intersects && contains) {
    return true;
  }
  return false;
};
const convertRingsToGeoJSON = (rings: number[][][]) => {
  const outerRings = [];
  const holes = [];
  let x;
  let outerRing;
  let hole;
  /* tslint:disable prefer-for-of */
  for (let r = 0; r < rings.length; r++) {
    const ring = closeRing(rings[r].slice(0));
    if (ring.length < 4) {
      continue;
    }
    if (ringIsClockwise(ring)) {
      const polygon = [ring.slice().reverse()];
      outerRings.push(polygon);
    } else {
      holes.push(ring.slice().reverse());
    }
  }
  const uncontainedHoles = [];
  while (holes.length) {
    hole = holes.pop();
    let contained = false;
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (coordinatesContainCoordinates(outerRing, hole)) {
        outerRings[x].push(hole);
        contained = true;
        break;
      }
    }
    if (!contained) {
      uncontainedHoles.push(hole);
    }
  }
  while (uncontainedHoles.length) {
    hole = uncontainedHoles.pop();
    let intersects = false;
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (arrayIntersectsArray(outerRing, hole)) {
        outerRings[x].push(hole);
        intersects = true;
        break;
      }
    }
    if (!intersects) {
      outerRings.push([hole.reverse()]);
    }
  }
  if (outerRings.length === 1) {
    return {
      type: "Polygon",
      coordinates: outerRings[0],
    };
  } else {
    return {
      type: "MultiPolygon",
      coordinates: outerRings,
    };
  }
};
const getId = (attributes: Record<string, any>, idAttribute: string) => {
  const keys = idAttribute
    ? [idAttribute, "OBJECTID", "FID"]
    : ["OBJECTID", "FID"];
  /* tslint:disable prefer-for-of */
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (
      key in attributes &&
      (typeof attributes[key] === "string" ||
        typeof attributes[key] === "number")
    ) {
      return attributes[key];
    }
  }
  throw Error("No valid id attribute found");
};
export const arcgisToGeoJSON = (arcgis: any, idAttribute?: string) => {
  let geojson: any = {};
  if (arcgis.features) {
    geojson.type = "FeatureCollection";
    geojson.features = [];
    /* tslint:disable prefer-for-of */
    for (let i = 0; i < arcgis.features.length; i++) {
      geojson.features.push(arcgisToGeoJSON(arcgis.features[i], idAttribute));
    }
  }
  if (typeof arcgis.x === "number" && typeof arcgis.y === "number") {
    geojson.type = "Point";
    geojson.coordinates = [arcgis.x, arcgis.y];
    if (typeof arcgis.z === "number") {
      geojson.coordinates.push(arcgis.z);
    }
  }
  if (arcgis.points) {
    geojson.type = "MultiPoint";
    geojson.coordinates = arcgis.points.slice(0);
  }
  if (arcgis.paths) {
    if (arcgis.paths.length === 1) {
      geojson.type = "LineString";
      geojson.coordinates = arcgis.paths[0].slice(0);
    } else {
      geojson.type = "MultiLineString";
      geojson.coordinates = arcgis.paths.slice(0);
    }
  }
  if (arcgis.rings) {
    geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
  }
  if (
    typeof arcgis.xmin === "number" &&
    typeof arcgis.ymin === "number" &&
    typeof arcgis.xmax === "number" &&
    typeof arcgis.ymax === "number"
  ) {
    geojson.type = "Polygon";
    geojson.coordinates = [
      [
        [arcgis.xmax, arcgis.ymax],
        [arcgis.xmin, arcgis.ymax],
        [arcgis.xmin, arcgis.ymin],
        [arcgis.xmax, arcgis.ymin],
        [arcgis.xmax, arcgis.ymax],
      ],
    ];
  }
  if (arcgis.geometry || arcgis.attributes) {
    geojson.type = "Feature";
    geojson.geometry = arcgis.geometry
      ? arcgisToGeoJSON(arcgis.geometry)
      : null;
    geojson.properties = arcgis.attributes
      ? shallowClone(arcgis.attributes)
      : null;
    if (arcgis.attributes) {
      try {
        geojson.id = getId(arcgis.attributes, idAttribute);
      } catch (err) {
        // don't set an id
      }
    }
  }

  if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
    geojson.geometry = null;
  }
  return geojson;
};
