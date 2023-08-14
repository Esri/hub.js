import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../checkPermission";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";

/**
 * @internal
 * Check the parent policies for the given policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkParents(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  if (policy.dependencies?.length) {
    // map over the parents array of permissions and check each one
    checks = policy.dependencies.reduce((acc, parent) => {
      const result = checkPermission(parent, context, entity);
      acc = [...acc, ...result.checks];
      return acc;
    }, [] as IPolicyCheck[]);
  }
  return checks;
}
