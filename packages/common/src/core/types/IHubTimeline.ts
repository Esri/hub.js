/**
 * Hub Timeline Definition
 */
export interface IHubTimeline {
  schemaVersion: number;
  title: string;
  description: string;
  stages: IHubStage[];
  canCollapse: boolean;
}

/**
 * Hub Timeline Stage
 */
export interface IHubStage {
  /**
   * Stage identifier
   */
  key: number;
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
   * Stage Link
   */
  link?: IHubStageLink;
  /**
   * Stage status
   */
  status: string;
}

export interface IHubStageLink {
  /**
   * Link href
   */
  href: string;
  /**
   * Link display title text
   */
  title?: string;
}
