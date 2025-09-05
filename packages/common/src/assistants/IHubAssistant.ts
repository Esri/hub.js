/**
 * Interface representing a Hub Assistant.
 * This interface defines the structure of an assistant in the hub, including its properties and workflows.
 */
export interface IHubAssistant {
  /**
   * Enable this assistant.
   */
  enabled?: boolean;
  /**
   * Access level for the assistant.
   * This can be public, org, or private.
   */
  access?: string;
  /**
   * Assistant access groups when not public.
   */
  accessGroups?: string[];
  /**
   * Personality for the assistant.
   */
  personality?: string;
  /**
   * Example prompts to display to the user.
   */
  examplePrompts?: string[];
  /**
   * Workflows for the assistant.
   */
  workflows?: IHubAssistantWorkflow[];
  /**
   * Test prompts for the assistant.
   */
  testPrompts?: string[];
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
   * Unique key for the workflow.
   * This is used to reference the workflow in the configuration list field.
   */
  key: string;
  /**
   * Label of the workflow.
   */
  label: string;
  /**
   * Description of the workflow.
   */
  description: string;
  /**
   * Action to be performed in the workflow.
   * This can be "search", or "respond".
   */
  action: "search" | "respond";
  /**
   * Assistant response.
   */
  response: string;
  /**
   * Data sources to be used in the workflow.
   */
  sources: string[];
}
