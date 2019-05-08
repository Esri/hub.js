import { getProp, categories } from "@esri/hub-common";

// builds the filter for the 'downloadable' facet
export function downloadable(queryFilters: any) {
  const download = (getProp(queryFilters, "downloadable.terms") || [])[0];
  let downloadFilter: string[];
  let typeKeywordFilter;
  if (download === "true") {
    downloadFilter = categories.downloadableTypes.map(type => {
      return `type:"${type}"`;
    });
    typeKeywordFilter = categories.downloadableTypeKeywords.map(type => {
      return `typekeywords:"${type}"`;
    });
  } else {
    downloadFilter = categories.downloadableTypes.map(type => {
      return `-type:"${type}"`;
    });
    typeKeywordFilter = categories.downloadableTypeKeywords.map(type => {
      return `-typekeywords:"${type}"`;
    });
  }
  return `(${downloadFilter.concat(typeKeywordFilter).join(" OR ")})`;
}
