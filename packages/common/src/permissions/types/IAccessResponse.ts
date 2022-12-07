import { Permission } from "./Permission";
import { IPolicyCheck } from "./IPolicyCheck";
import { PolicyResponse } from "./PolicyResponse";

/**
 * Response from a permission check
 */

export interface IAccessResponse {
  /**
   * Permission being checked
   */
  permission: Permission;
  /**
   * Is the user allowed to perform the action
   */
  access: boolean;
  /**
   * Code for the access response. Used for i18n and UX level messages
   */
  code: string;
  /**
   * Reason for the access response
   */
  response: PolicyResponse;
  /**
   * Message with details access response. Typically used to return additional
   * information about assertion failures
   */
  message?: string;
  /**
   * List of all the policies that were checked, and their responses
   * For debugging / observability
   */
  checks: IPolicyCheck[];
}
