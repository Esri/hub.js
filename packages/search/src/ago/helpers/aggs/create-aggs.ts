const agoSupportedAggs = ["tags", "type", "access"];
const aggsAlias: any = {
  collection: "type"
};

export function createAggs(facets: string): any {
  // return aggs that are supported by AGO - tags, type, access
  const agoFacets = facets
    .split(",")
    .filter((facet: string) => agoSupportedAggs.indexOf(facet) > -1);
  // if there `collection` in facets, then see if its alias has already been added
  Object.keys(aggsAlias).forEach((key: string) => {
    if (!(aggsAlias[key] in agoFacets)) {
      agoFacets.push(aggsAlias[key]);
    }
  });
  return {
    countFields: agoFacets.join(","),
    countSize: 200 // max supported by AGO
  };
}
