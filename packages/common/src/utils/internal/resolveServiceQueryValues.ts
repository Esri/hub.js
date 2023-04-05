import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { IStatisticDefinition } from "@esri/arcgis-rest-types";
import { IArcGISContext } from "../../ArcGISContext";
import {
  IDynamicServiceQueryDefinition,
  IDynamicValueOutput,
} from "../../core/types/DynamicValues";
import { setProp } from "../../objects";
import { getProp } from "../../objects/get-prop";

/**
 * @internal
 * Resolve a dynamic value that is derived from a service query
 * @param valueDef Service Query Definition that will be resolved by executing an aggregation querying on service and returning that value
 * @param context ArcGIS context of the current user.
 * @returns
 */
export const resolveServiceQueryValues = async (
  valueDef: IDynamicServiceQueryDefinition,
  context: IArcGISContext
): Promise<Record<string, IDynamicValueOutput>> => {
  // If no where is provided, default to "1=1"
  valueDef.options.where = valueDef.options.where || "1=1";

  // Construct the stats definition
  const statsDef: IStatisticDefinition = {
    onStatisticField: valueDef.options.field,
    statisticType: valueDef.options.statisticType,
    outStatisticFieldName: valueDef.options.field,
  };
  // Execute the query
  const response = await queryFeatures({
    url: valueDef.options.url as string,
    where: valueDef.options.where as string,
    f: "json",
    outStatistics: [statsDef],
    authentication: context.requestOptions.authentication,
  });

  // Pull the aggreate value out of the response
  const features = getProp(response, "features") || [];
  const firstEntry = features[0] || {};
  const aggregate =
    getProp(firstEntry, `attributes.${valueDef.options.field}`) || 0;

  // construct the result object
  const result: Record<string, IDynamicValueOutput> = {
    [valueDef.outPath]: {
      value: aggregate,
      sources: [{ ...valueDef.source, value: aggregate }],
    },
  };

  return result;
};
