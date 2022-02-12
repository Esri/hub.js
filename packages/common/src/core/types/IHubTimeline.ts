/**
 * Hub Timeline Definition
 */
export interface IHubTimeline {
  title: string;
  description: string;
  stages: IHubStage[];
}

/**
 * Hub Timeline Stage
 */
export interface IHubStage {
  /**
   * Stage identifier
   */
  id: number;
  /**
   * Stage Title
   */
  title: string;
  /**
   * Timeframe for the stage
   * i.e. "Late Fall 2022"
   */
  timeframe: string;
  /**
   * Stage Description
   */
  description: string;
  /**
   * Stage status
   */
  status: string;
  /**
   * Icon Name
   */
  icon: string;

  // TODO: These should likely be removed as they are not
  // specific to the Stage itself, but rather the edit UI
  isEditing: boolean; // render editing ui for a stage
  leadingElement: boolean; // indicates if the move-up button should be disabled
  trailingElement: boolean; // indicates if the move-down button should be disabled
}
