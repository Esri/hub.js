export type ISurveyStatus = "open" | "closed" | "scheduled";

export type IDetailedSurveyStatus =
  | "opening_today"
  | "opening_future"
  | "closing_today"
  | "closing_future"
  | ISurveyStatus;

export interface ISurveyFormJson {
  settings: {
    [propName: string]: any,
    openStatusInfo: {
      status: ISurveyStatus,
      schedule: ISurveySchedule
    }
  }
}

export interface ISurveySchedule {
  start?: string | null,
  end?: string | null
}