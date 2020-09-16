import { getSurveyStatus, getDetailedSurveyStatus, getSurveyStatusFromSchedule } from "../../src/utils/status-utils";
import { IGetSurveyFormJson, IGetSurveySchedule } from "@esri/hub-common";

const getFormJson = (status: string, start: string, end: string) => {
  const schedule: IGetSurveySchedule = { start, end };
  const form: IGetSurveyFormJson = {
    settings: {
      openStatusInfo: {
        status,
        schedule
      }
    }
  };
  return form;
}

const t1 = "2020-07-07T00:00:00-00:00";
const t2 = "2020-07-17T10:00:00-00:00";
const t3 = "2020-07-17T12:00:00-00:00";
const t4 = "2020-07-17T14:01:30-00:00";
const t5 = "2020-07-29T03:40:00-00:00";

describe("getSurveyStatus", function () {
  const combinations = [
    [t1, t2, t3, "scheduled"],
    [t3, t2, t4, "open"],
    [t4, t2, t3, "closed"]
  ];

  combinations.forEach(([now, start, end, expected]) => {
    it (`should return ${expected} when it has a schedule.start:${start} and schedule.end:${end}`, function () {
      const formJson = getFormJson("scheduled", start, end);
      const result = getSurveyStatus(formJson, new Date(now));
      expect(result).toEqual(expected);
    });
  });

  it (`should return open when status open and no schedule`, function () {
    const formJson = getFormJson("open", null, null);
    const result = getSurveyStatus(formJson);
    expect(result).toEqual("open");
  });

  it (`should return closed when status closed and no schedule`, function () {
    const formJson = getFormJson("closed", null, null);
    const result = getSurveyStatus(formJson);
    expect(result).toEqual("closed");
  });
});

describe("getDetailedSurveyStatus", function () {
  const combinations = [
    [t1, t2, t3, "opening_future"],
    [t2, t3, t4, "opening_today"],
    [t3, t2, t4, "closing_today"],
    [t3, t2, t5, "closing_future"],
    [t1, t2, null, "opening_future"],
    [t2, t3, null, "opening_today"],
    [t3, null, t4, "closing_today"],
    [t3, null, t5, "closing_future"],
    [t5, t1, t2, "closed"]
  ];

  combinations.forEach(([now, start, end, expected]) => {
    it (`should return ${expected} when it has a schedule.start:${start} and schedule.end:${end}`, function () {
      const {
        settings: {
          openStatusInfo: {
            status,
            schedule
          }
        }
      } = getFormJson("scheduled", start, end);
      const result = getDetailedSurveyStatus(status, schedule, new Date(now));
      expect(result).toEqual(expected);
    });
  });

  it (`should return open when status open and no schedule`, function () {
    const {
      settings: {
        openStatusInfo: {
          status,
          schedule
        }
      }
    } = getFormJson("open", null, null);
    const result = getDetailedSurveyStatus(status, schedule);
    expect(result).toEqual("open");
  });

  it (`should return closed when status closed and no schedule`, function () {
    const {
      settings: {
        openStatusInfo: {
          status,
          schedule
        }
      }
    } = getFormJson("closed", null, null);
    const result = getDetailedSurveyStatus(status, schedule);
    expect(result).toEqual("closed");
  });
});

describe("getSurveyStatusFromSchedule", function () {
  const combinations = [
    [t1, t2, t3, 'scheduled'],
    [t3, t2, t4, 'open'],
    [t4, t2, t3, 'closed'],
    [t1, t2, null, 'scheduled'],
    [t2, null, t1, 'closed']
  ];

  combinations.forEach(([now, start, end, expected]) => {
    it (`should return ${expected} when it has a schedule.start:${start} and schedule.end:${end}`, function () {
      const {
        settings: {
          openStatusInfo: {
            schedule
          }
        }
      } = getFormJson("scheduled", start, end);
      const result = getSurveyStatusFromSchedule(schedule, new Date(now));
      expect(result).toEqual(expected);
    });
  });

  it("should use Date.now when no date supplied", function () {
    const {
      settings: {
        openStatusInfo: {
          schedule
        }
      }
    } = getFormJson("scheduled", t1, t2);
    const result = getSurveyStatusFromSchedule(schedule);
    expect(result).toEqual("closed");
  });
});