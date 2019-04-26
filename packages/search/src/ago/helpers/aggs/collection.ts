import { getCategory } from "@esri/hub-common";

// implements the 'collection' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
export function collection(agoAggregations: any = {}): any {
  const typeAggs = agoAggregations.counts.filter(
    (agg: any) => agg.fieldName === "type"
  )[0];
  if (!typeAggs) return;
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
      if (!(collectionType in formattedAggs.collection)) {
        formattedAggs.collection[collectionType] = 0; // initialize counter
      }
      formattedAggs.collection[collectionType]++;
      return formattedAggs;
    },
    { collection: {} }
  );
}
