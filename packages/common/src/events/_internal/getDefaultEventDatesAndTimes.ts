import { getLocalDate, getLocalTime, guessTimeZone } from "../../utils/date";

/**
 * @private
 * Builds an object containing the user's guessed timezone and default
 * event start/end dates and times
 */
export const getDefaultEventDatesAndTimes = () => {
  const hour = 1000 * 60 * 60;
  const nowPlus1Hour = new Date(Date.now() + hour);
  const nextFullHour = new Date(
    nowPlus1Hour.getFullYear(),
    nowPlus1Hour.getMonth(),
    nowPlus1Hour.getDate(),
    nowPlus1Hour.getHours()
  );
  const sDate = nextFullHour.toISOString();
  const eDate = new Date(nextFullHour.valueOf() + hour).toISOString();
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
