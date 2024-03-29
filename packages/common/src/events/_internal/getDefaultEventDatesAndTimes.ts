export const getDefaultEventDatesAndTimes = () => {
  const hour = 1000 * 60 * 60;
  const sDate = new Date(Date.now() + hour);
  const eDate = new Date(sDate.valueOf() + hour);
  const zeroPad = (num: number) => num.toString().padStart(2, "0");

  const getDate = (date: Date): string => {
    const year = date.getFullYear().toString();
    const day = zeroPad(date.getDate());
    const monthIndex = date.getMonth();
    const month = zeroPad(monthIndex === 11 ? 1 : monthIndex + 1);
    return [year, month, day].join("-");
  };

  const getHour = (date: Date): string => {
    const hours = zeroPad(date.getHours());
    const minutes = zeroPad(0);
    return [hours, minutes].join(":");
  };

  const startDate = getDate(sDate);
  const endDate = getDate(eDate);
  return {
    startDate,
    startDateTime: sDate,
    startTime: getHour(sDate),
    endDate,
    endDateTime: eDate,
    endTime: getHour(eDate),
  };
};
