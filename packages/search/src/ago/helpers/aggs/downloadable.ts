import { ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { categories } from "@esri/hub-common";

// implements the 'downloadable' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
export function downloadable(response: ISearchResult<IItem>): any {
  // Get counts of true and false for downloadable facet
  // i.e. { true: 10, false: 15 }
  return response.results.reduce(
    (formattedAggs: any, result: IItem) => {
      if (
        (result.typeKeywords || []).indexOf("Data") > -1 ||
        categories.downloadableTypes.indexOf(result.type) > -1
      ) {
        formattedAggs.downloadable.true++;
      } else {
        formattedAggs.downloadable.false++;
      }
      return formattedAggs;
    },
    { downloadable: { true: 0, false: 0 } }
  );
}
