import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";

/**
 * Type signature for Permission Check Functions
 */
export type PermissionCheckFunction = (
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
) => IPolicyCheck[];
