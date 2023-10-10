import { PolicyResponse } from "../../permissions/types/PolicyResponse";

export interface IAccessResponse {
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
}
