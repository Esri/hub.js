import {
  ISurveyFormJson,
  ISurveySchedule,
  ISurveyStatus,
  IDetailedSurveyStatus
} from "@esri/hub-types";

/**
 * Parses survey form item and form.json to determine if survey is draft, scheduled, open, or closed
 * @param {ISurveyFormJson} form Form.json item resource associated with survey item
 * @param {Date} now Date object
 * @returns {ISurveyStatus}
 */
export function getSurveyStatus (
  { settings: { openStatusInfo: { status: _status, schedule } } }: ISurveyFormJson,
  now?: Date
): ISurveyStatus {
  let status = _status;
  if (status === "scheduled") {
    status = getSurveyStatusFromSchedule(schedule, now);
  }
  return status;
};

/**
 * Parses survey status and schedule to determine if survey is opening today,opening later,
 * open indefinitely, closing today, closing later, already closed, or upcoming
 * @param {ISurveyStatus} status Property value from <form.json>.settings.openStatusInfo
 * @param {ISurveySchedule} schedule Schedule hash from <form.json>.settings.openStatusInfo
 * @param {Date} now Date object
 * @returns {IDetailedSurveyStatus}
 */
export function getDetailedSurveyStatus (
  _status: ISurveyStatus,
  schedule: ISurveySchedule,
  now: Date = new Date()
): IDetailedSurveyStatus {
  let status: IDetailedSurveyStatus = _status;
  if (status === "scheduled") {
    status = getSurveyStatusFromSchedule(schedule, now);
    if (status === "scheduled") {
      status = now.toDateString() === new Date(schedule.start).toDateString() ? 'opening_today' : 'opening_future';
    } else if (status === "open") {
      status = now.toDateString() === new Date(schedule.end).toDateString() ? 'closing_today' : 'closing_future';
    }
  }
  return status;
};

/**
 * Parses survey schedule start and end to determine if survey is currently open, closed, or upcoming
 * @param {ISurveySchedule} schedule Schedule hash from <form.json>.settings.openStatusInfo
 * @param {Date} now Date object
 * @returns {ISurveyStatus}
 */
export function getSurveyStatusFromSchedule (
  { start, end }: ISurveySchedule,
  now: Date = new Date()
): ISurveyStatus {
  let status: ISurveyStatus = "open";
  if (end && now > new Date(end)) {
    status = "closed";
  } else if (start && new Date(start) > now) {
    status = "scheduled";
  }
  return status;
};
