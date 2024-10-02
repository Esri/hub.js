import { IHubSchedule } from "./types";

// IHubSchedule utils

/**
 * Get the next daily occurance of the specified hour in the specified timezone
 * @param hour takes an hour of the day between 0 and 23
 * @param timezone takes a timezone string
 * @param locale takes a locale string
 * @returns a Date object representing the next daily occurance of the specified hour
 */
const getNextDailyOccurance = (
  hour: number,
  timezone: string,
  locale: string
): Date => {
  validateHour(hour);

  // Get the time in the specified timezone
  const targetTime = getInitialTargetTime(timezone, locale);

  if (targetTime.getHours() < hour) {
    targetTime.setHours(hour, 0, 0, 0);
  } else {
    targetTime.setDate(targetTime.getDate() + 1);
    targetTime.setHours(hour, 0, 0, 0);
  }

  return targetTime;
};

/**
 * Get the next weekly occurance of the specified hour in the specified timezone
 * @param hour takes an hour of the day between 0 and 23
 * @param timezone takes a timezone string
 * @param dayOfWeek takes a day of the week between 0 (Sunday) and 6 (Saturday)
 * @param locale takes a locale string
 * @returns a Date object representing the next weekly occurance of the specified hour
 */
const getNextWeeklyOccurance = (
  hour: number,
  timezone: string,
  dayOfWeek: number,
  locale: string
): Date => {
  validateHour(hour);
  validateDayOfWeek(dayOfWeek);

  // Get the time in the specified timezone
  const targetTime = getInitialTargetTime(timezone, locale);

  // Calculate the difference in days between today and the next occurrence of the specified day of the week
  const currentDayOfWeek = targetTime.getDay();
  let daysUntilNextEvent = (dayOfWeek - currentDayOfWeek + 7) % 7;

  // If the event is today but the hour has already passed, schedule it for next week
  if (daysUntilNextEvent === 0 && targetTime.getHours() >= hour) {
    daysUntilNextEvent = 7;
  }

  // Set the event time to the next occurrence of the specified day at the given hour
  targetTime.setDate(targetTime.getDate() + daysUntilNextEvent);
  targetTime.setHours(hour, 0, 0, 0);

  // Convert the event time to an ISO string
  return targetTime;
};

/**
 * Get the next monthly occurance of the specified hour in the specified timezone
 * @param hour takes an hour of the day between 0 and 23
 * @param timezone takes a timezone string
 * @param dayOfMonth takes a day of the week between 1 and 28
 * @param locale takes a locale string
 * @returns a Date object representing the next monthly occurance of the specified hour
 */
const getNextMonthlyOccurance = (
  hour: number,
  timezone: string,
  dayOfMonth: number,
  locale: string
): Date => {
  validateHour(hour);
  validateDayOfMonth(dayOfMonth);

  // Get the time in the specified timezone
  const targetTime = getInitialTargetTime(timezone, locale);

  // Calculate the difference in days between today and the next occurrence of the specified day of the month
  const currentDayOfMonth = targetTime.getDate();
  let daysUntilNextEvent = dayOfMonth - currentDayOfMonth;

  // If the event is today but the hour has already passed, schedule it for next month
  if (daysUntilNextEvent === 0 && targetTime.getHours() >= hour) {
    daysUntilNextEvent = 0;
    targetTime.setMonth(targetTime.getMonth() + 1);
  } else if (daysUntilNextEvent < 0) {
    // If the day of the month has already passed, schedule it for next month
    targetTime.setMonth(targetTime.getMonth() + 1);
    targetTime.setDate(dayOfMonth);
  } else {
    // Set the event time to the next occurrence of the specified day at the given hour
    targetTime.setDate(dayOfMonth);
  }

  targetTime.setHours(hour, 0, 0, 0);

  // Convert the event time to an ISO string
  return targetTime;
};

/**
 * Get the next yearly occurance of the specified hour in the specified timezone
 * @param hour takes an hour of the day between 0 and 23
 * @param timezone takes a timezone string
 * @param dayOfMonth takes a day of the week between 1 and 28
 * @param month takes a month of the year between 0 and 11
 * @param locale takes a locale string
 * @returns a Date object representing the next yearly occurance of the specified hour
 */
const getNextYearlyOccurance = (
  hour: number,
  timezone: string,
  dayOfMonth: number,
  month: number,
  locale: string
): Date => {
  validateHour(hour);
  validateDayOfMonth(dayOfMonth);
  validateMonth(month);

  // Get the time in the specified timezone
  const targetTime = getInitialTargetTime(timezone, locale);

  // Calculate the next occurrence of the specified month and day
  const currentMonth = targetTime.getMonth();
  const currentDayOfMonth = targetTime.getDate();
  const currentYear = targetTime.getFullYear();

  if (
    currentMonth > month ||
    (currentMonth === month &&
      (currentDayOfMonth > dayOfMonth ||
        (currentDayOfMonth === dayOfMonth && targetTime.getHours() >= hour)))
  ) {
    // If the specified month and day have already passed this year, schedule it for next year
    targetTime.setFullYear(currentYear + 1);
  }
  targetTime.setMonth(month);
  targetTime.setDate(dayOfMonth);
  targetTime.setHours(hour, 0, 0, 0);

  // Convert the event time to an ISO string
  return targetTime;
};

/**
 * Get the next occurance of the specified schedule
 * @param schedule takes an IHubSchedule object
 * @param locale takes a locale string
 * @returns a Date object representing the next occurance of the specified schedule
 */
export const getNextOccurance = (
  schedule: IHubSchedule,
  locale: string
): Date => {
  if (schedule.mode === "scheduled") {
    switch (schedule.cadence) {
      case "daily":
        return getNextDailyOccurance(schedule.hour, schedule.timezone, locale);
      case "weekly":
        return getNextWeeklyOccurance(
          schedule.hour,
          schedule.timezone,
          schedule.day,
          locale
        );
      case "monthly":
        return getNextMonthlyOccurance(
          schedule.hour,
          schedule.timezone,
          schedule.date,
          locale
        );
      case "yearly":
        return getNextYearlyOccurance(
          schedule.hour,
          schedule.timezone,
          schedule.date,
          schedule.month,
          locale
        );
      default:
        throw new Error("Invalid cadence");
    }
  } else {
    // If the schedule mode is not "scheduled", return undefined because it is either "automatic" or "manual"
    return undefined;
  }
};

/**
 * Get the initial target time in the specified timezone
 * @param timezone the timezone string
 * @param locale the locale string
 * @returns a Date object representing the initial target time in the specified timezone
 */
const getInitialTargetTime = (timezone: string, locale: string): Date => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() + utcOffset);
  const targetTime = new Date(
    localTime.toLocaleString(locale, { timeZone: timezone })
  );
  return targetTime;
};

/****** VALIDATION ******/
const validateHour = (hour: number): void => {
  if (hour < 0 || hour > 23) {
    throw new Error("Hour must be between 0 and 23");
  }
};

const validateDayOfWeek = (dayOfWeek: number): void => {
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error(
      "Day of the week must be between 0 (Sunday) and 6 (Saturday)"
    );
  }
};

const validateMonth = (month: number): void => {
  if (month < 0 || month > 11) {
    throw new Error("Month must be between 0 and 11");
  }
};

const validateDayOfMonth = (dayOfMonth: number): void => {
  if (dayOfMonth < 1 || dayOfMonth > 28) {
    throw new Error("Day of the month must be between 1 and 28");
  }
};
