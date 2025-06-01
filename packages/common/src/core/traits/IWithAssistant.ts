import { IHubAssistant } from "../../assistants";

/**
 * Expose an assistant on an entity
 */
export interface IWithAssistant {
  /**
   * Optional Hub Assistant.
   */
  assistant?: IHubAssistant;
}
