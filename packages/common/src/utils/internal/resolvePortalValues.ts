import { getSelf } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValues,
  IDynamicPortalSelfDefinition,
  IDynamicValueOutput,
  IValueSource,
} from "../../core/types/DynamicValues";
import { setProp } from "../../objects";
import { getProp } from "../../objects/get-prop";
import { memoize } from "../memoize";

/**
 * @internal
 * Resolve a set of dynamic values by extracting properties
 * from the current user's portal/self
 * @param valueDef Portal Query Definition that wil be resolved using properties from the current user's portal/self
 * @param context ArcGIS context of the current user.
 * @returns
 */
export async function resolvePortalValues(
  valueDef: IDynamicPortalSelfDefinition,
  context: IArcGISContext
): Promise<Record<string, IDynamicValueOutput>> {
  const result: Record<string, IDynamicValueOutput> = {};
  const memoizedPortalSelf = memoize(getSelf);
  // TODO: This could use the context.portal values to skip even a single request
  // get the portalSelf via memoized function
  const portal = await memoizedPortalSelf(
    context.requestOptions.authentication
  );

  // get the value from the portal and attach into the result
  const value = getProp(portal, valueDef.sourcePath);
  // For portal, we create the source on the fly
  const source: IValueSource = {
    type: "portal",
    label: portal.name,
    id: portal.id,
    value,
  };
  setProp(
    valueDef.outPath,
    {
      value,
      sources: [source],
    },
    result
  );

  return result;
}
