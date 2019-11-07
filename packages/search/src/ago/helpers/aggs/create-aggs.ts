const agoSupportedAggs = ["tags", "type", "access", "categories"];
const aggsAlias: any = {
  collection: "type"
};

/**
 * Get aggreations query object that AGO understands i.e. countFields and countSize
 * only on fields supported by AGO
 * @param facets comma separated list of aggregation fields
 */
export function createAggs(facets: string): any {
  // return aggs that are supported by AGO - tags, type, access
  const agoFacets = facets
    .split(",")
    .filter((facet: string) => agoSupportedAggs.indexOf(facet) > -1);
  const aliases = facets
    .split(",")
    .filter((facet: string) => Object.keys(aggsAlias).indexOf(facet) > -1);
  // if there is `collection` in facets, then check if its alias has already been added
  Object.keys(aggsAlias).forEach((key: string) => {
    if (aliases.indexOf(key) > -1 && !(aggsAlias[key] in agoFacets)) {
      agoFacets.push(aggsAlias[key]);
    }
  });
  return {
    countFields: agoFacets.join(","),
    countSize: 200 // max supported by AGO
  };
}
