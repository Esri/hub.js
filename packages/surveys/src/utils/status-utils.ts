import { IGetSurveyFormJson, IGetSurveySchedule } from "@esri/hub-common";

/**
 * Parses survey form item and form.json to determine if survey is draft, scheduled, open, or closed
 * @param {IGetSurveyFormJson} form Form.json item resource associated with survey item
 * @param {Date} now Date object
 * @returns {string}
 */
export function getSurveyStatus (
  { settings: { openStatusInfo: { status: _status, schedule } } }: IGetSurveyFormJson,
  now?: Date
): string {
  let status = _status;
  if (status === 'scheduled') {
    status = getSurveyStatusFromSchedule(schedule, now);
  }
  return status;
};

/**
 * Parses survey status and schedule to determine if survey is opening today,opening later,
 * open indefinitely, closing today, closing later, already closed, or upcoming
 * @param {string} status Property value from <form.json>.settings.openStatusInfo
 * @param {IGetSurveySchedule} schedule Schedule hash from <form.json>.settings.openStatusInfo
 * @param {Date} now Date object
 * @returns {string}
 */
export function getDetailedSurveyStatus (
  _status: string,
  schedule: IGetSurveySchedule,
  now: Date = new Date()
): string {
  let status = _status;
  if (status === 'scheduled') {
    status = getSurveyStatusFromSchedule(schedule, now);
    if (status === 'scheduled') {
      status = now.toDateString() === new Date(schedule.start).toDateString() ? 'opening_today' : 'opening_future';
    } else if (status === 'open') {
      status = now.toDateString() === new Date(schedule.end).toDateString() ? 'closing_today' : 'closing_future';
    }
  }
  return status;
};

/**
 * Parses survey schedule start and end to determine if survey is currently open, closed, or upcoming
 * @param {IGetSurveySchedule} schedule Schedule hash from <form.json>.settings.openStatusInfo
 * @param {Date} now Date object
 * @returns {string}
 */
export function getSurveyStatusFromSchedule (
  { start, end }: IGetSurveySchedule,
  now: Date = new Date()
): string {
  let status = 'open';
  if (end && now > new Date(end)) {
    status = 'closed';
  } else if (start && new Date(start) > now) {
    status = 'scheduled';
  }
  return status;
};
