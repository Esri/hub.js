import { getLocalDate, getLocalTime, guessTimeZone } from "../../utils/date";

/**
 * Builds an object containing the user's guessed timezone and default
 * event start/end dates and times
 */
export const getDefaultEventDatesAndTimes = () => {
  const hour = 1000 * 60 * 60;
  const startMs = Date.now() + hour;
  const sDate = new Date(startMs).toISOString();
  const eDate = new Date(startMs + hour).toISOString();
  const timeZone = guessTimeZone();
  const startDate = getLocalDate(sDate, timeZone);
  const endDate = getLocalDate(eDate, timeZone);
  return {
    startDate,
    startDateTime: new Date(sDate),
    startTime: getLocalTime(sDate, timeZone),
    endDate,
    endDateTime: new Date(eDate),
    endTime: getLocalTime(eDate, timeZone),
    timeZone,
  };
};
