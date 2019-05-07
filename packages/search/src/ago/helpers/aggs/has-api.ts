import { getProp } from "@esri/hub-common";

// implements the 'hasApi' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
export function hasApi(agoAggregations: any = {}): any {
  const typeAggs = (getProp(agoAggregations, "counts") || []).filter(
    (agg: any) => agg.fieldName === "type"
  )[0];
  if (!typeAggs) return { hasApi: {} };
  return typeAggs.fieldValues.reduce(
    (formattedAggs: any, fieldVal: any) => {
      if (apiTypes.indexOf(fieldVal.value) > -1) {
        formattedAggs.hasApi.true += fieldVal.count;
      } else {
        formattedAggs.hasApi.false += fieldVal.count;
      }
      return formattedAggs;
    },
    { hasApi: { true: 0, false: 0 } }
  );
}

// more types TBD
const apiTypes = ["feature service", "map service", "image service"];
