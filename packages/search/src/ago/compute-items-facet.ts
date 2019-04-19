import { ISearchResult } from "@esri/arcgis-rest-items";
import { IItem } from "@esri/arcgis-rest-common-types";

/*
 * This Util function takes AGO results and formats them into an aggregations object
 * that looks like it came from the V3 API. Many facets can be fairly easily mocked
 * using a standardized approach (the 'else if' and 'else' branches) but a few facets
 * require more complex and customized logic. Those go in the `customFacets` hash,
 * where the name of the key is the name of the facet being computed and the custom function
 * is implemented below.
 */

export function computeItemsFacet(
  response: ISearchResult,
  facets: any = {}
): any {
  const options = response.results.reduce((opts: any, result) => {
    facets.forEach((facet: string) => {
      if (!opts[facet]) opts[facet] = {};
      if (isCustomFacet(facet)) {
        opts = customFacets[facet](opts, result);
      } else if (Array.isArray(result[facet])) {
        // facets like tags are arrays
        result[facet].forEach((f: string) => {
          const item = facet === "tags" ? f.toLowerCase() : f;
          opts[facet][item] = opts[facet][item] ? opts[facet][item] + 1 : 1;
        });
      } else {
        // facets like owner are just a string
        opts[facet][result[facet]] = opts[facet][result[facet]]
          ? opts[facet][result[facet]] + 1
          : 1;
      }
    });
    return opts;
  }, {});
  return format(options, facets);
}

function format(options: any = {}, facets: any = {}) {
  return facets.reduce((opts: any, facet: string) => {
    opts[facet] = Object.keys(options[facet] || {})
      .map(f => {
        return {
          key: f,
          docCount: options[facet][f]
        };
      })
      .sort(compareReverse);
    return opts;
  }, {});
}

function compareReverse(a: any, b: any) {
  return b.docCount > a.docCount ? 1 : -1;
}

// custom facet hash
const customFacets: { [key: string]: any } = {
  downloadable,
  hasApi
};

// this function is the gating mechanism for customized facets
function isCustomFacet(facet: string): boolean {
  return ["downloadable", "hasApi"].indexOf(facet) > -1;
}

// implements the 'hasApi' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
function hasApi(opts: any = {}, result: IItem): any {
  if (apiTypes.indexOf(result.type) > -1) {
    opts.hasApi["true"] = opts.hasApi["true"] ? opts.hasApi["true"] + 1 : 1;
  } else {
    opts.hasApi["false"] = opts.hasApi["false"] ? opts.hasApi["false"] + 1 : 1;
  }
  return opts;
}

// more types TBD
const apiTypes = ["Feature Service", "Map Service", "Image Service"];

// implements the 'downloadable' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
function downloadable(opts: any = {}, result: IItem): any {
  let isDownloadable = false;
  if (result.typeKeywords.indexOf("Data") > -1) {
    isDownloadable = true;
  }
  if (downloadableTypes.indexOf(result.type) > -1) {
    isDownloadable = true;
  }
  if (isDownloadable) {
    opts.downloadable["true"] = opts.downloadable["true"]
      ? opts.downloadable["true"] + 1
      : 1;
  } else {
    opts.downloadable["false"] = opts.downloadable["false"]
      ? opts.downloadable["false"] + 1
      : 1;
  }
  return opts;
}

// eligible types are listed here: http://doc.arcgis.com/en/arcgis-online/reference/supported-items.htm
const downloadableTypes = [
  "360 VR Experience",
  "Application",
  "CityEngine Web Scene",
  "Code Sample",
  "CSV Collection",
  "CSV",
  "CAD Drawing",
  "Desktop Application",
  "Desktop Application Template",
  "Desktop Style",
  "File Geodatabase",
  "GeoJson",
  "Geoprocessing Package",
  "Geoprocessing Sample",
  "Image",
  "iWork Keynote",
  "iWork Numbers",
  "KML Collection",
  "KML",
  "Layer",
  "Layer File",
  "Layer Package",
  "Layout",
  "Locator Package",
  "Map Package",
  "Map Service Definition",
  "Map Template",
  "Microsoft Excel",
  "Microsoft Powerpoint",
  "Microsoft Visio",
  "Microsoft Word",
  "Operations Dashboard Add In",
  "PDF",
  "Pro Map",
  "Project Package",
  "Project Template",
  "Raster function template",
  "Rule Package",
  "Service Definition",
  "Shapefile",
  "Vector Tile Package",
  "Workflow Manager Package"
];
