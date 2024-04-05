import { getDatePickerDate } from "../../utils/date/getDatePickerDate";
import { getTimePickerTime } from "../../utils/date/getTimePickerTime";
import { guessTimeZone } from "../../utils/date/guessTimeZone";

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
  const startDate = getDatePickerDate(sDate, timeZone);
  const endDate = getDatePickerDate(eDate, timeZone);
  return {
    startDate,
    startDateTime: new Date(sDate),
    startTime: getTimePickerTime(sDate, timeZone),
    endDate,
    endDateTime: new Date(eDate),
    endTime: getTimePickerTime(eDate, timeZone),
    timeZone,
  };
};
