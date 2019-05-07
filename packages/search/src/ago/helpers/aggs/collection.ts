import { getCategory, getProp } from "@esri/hub-common";

// implements the 'collection' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
/**
 * Calculate raw counts for collection based on AGO type aggregations
 * @param agoAggregations aggregations from ago results
 */
export function collection(agoAggregations: any = {}): any {
  const typeAggs = (getProp(agoAggregations, "counts") || []).filter(
    (agg: any) => agg.fieldName === "type"
  )[0];
  if (!typeAggs) return { collection: {} };
  return typeAggs.fieldValues.reduce(
    (formattedAggs: any, fieldVal: any) => {
      const category = getCategory(fieldVal.value);
      let collectionType;
      if (category) {
        // upper case first letter and return as element in array for backwards compatibility
        collectionType = category
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      } else {
        collectionType = "Other";
      }
      formattedAggs.collection[collectionType] = fieldVal.count;
      return formattedAggs;
    },
    { collection: {} }
  );
}
