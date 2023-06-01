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
  key: string;
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
  stageDescription: string;
  /**
   * Stage Link
   */
  link?: IHubStageLink;
  /**
   * Stage status
   */
  status: TimelineStageStatus;
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

type TimelineStageStatus = keyof typeof TIMELINE_STAGE_STATUSES;
export enum TIMELINE_STAGE_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  skipped = "skipped",
  onHold = "onHold",
  complete = "complete",
}
