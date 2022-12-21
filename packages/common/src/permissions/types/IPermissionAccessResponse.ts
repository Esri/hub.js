import { Permission } from "./Permission";
import { Capability } from "../../capabilities";
import { IAccessResponse } from "../../core/types/IAccessResponse";
import { IPolicyCheck } from "./IPolicyCheck";

/**
 * Response from a permission check
 */

export interface IPermissionAccessResponse extends IAccessResponse {
  /**
   * Permission being checked
   */
  policy: Permission | Capability;
  /**
   * List of all the policies that were checked, and their responses
   * For debugging / observability
   */
  checks: IPolicyCheck[];
}
