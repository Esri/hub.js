/**
 * Interface representing a Hub Assistant.
 * This interface defines the structure of an assistant in the hub, including its properties and workflows.
 */
export interface IHubAssistant {
  /**
   * Enable this assistant.
   */
  enabled: boolean;
  /**
   * Personality for the assistant.
   */
  personality: string;
  /**
   * Example prompts to display to the user.
   */
  examplePrompts: string[];
  /**
   * Workflows for the assistant.
   */
  workflows: IHubAssistantWorkflow[];
  /**
   * Test prompts for the assistant.
   */
  testPrompts: string[];
  /**
   * Schema version for the assistant.
   */
  schemaVersion: number;
}

/**
 * Interface representing a Hub Assistant Workflow.
 */
export interface IHubAssistantWorkflow {
  /**
   * Unique identifier for the workflow.
   */
  id: string;
  /**
   * Name of the workflow.
   */
  name: string;
  /**
   * Description of the workflow.
   */
  description: string;
  /**
   * Assistant workflow for the response.
   */
  response: IHubAssistantWorkflowResponse[];
}

/**
 * Interface representing a Hub Assistant Workflow response.
 */
export interface IHubAssistantWorkflowResponse {
  /**
   * Assistant response.
   */
  text: string;
  /**
   * Steps to perform.
   */
  steps: Array<Record<string, string>>;
  /**
   * Optional actions to perform.
   */
  actions?: Array<Record<string, string>>;
  /**
   * Optional sources to include.
   */
  sources?: Array<Record<string, string>>;
}
