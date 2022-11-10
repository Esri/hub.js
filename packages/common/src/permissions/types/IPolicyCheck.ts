import { PolicyResponse } from "./PolicyResponse";

/**
 * Information about a specific policy check, and its response
 * Used for debugging / observability
 */

export interface IPolicyCheck {
  /**
   * Description of the policy being checked
   * e.g. License Required: "hub-premium"
   */
  name: string;
  /**
   * Value determined for the current user
   * e.g. "hub-basic"
   */
  value: string;
  /**
   * Policy Response code, for i18n
   */
  code: string;
  /**
   * Policy Response string
   */
  response: PolicyResponse;
}
