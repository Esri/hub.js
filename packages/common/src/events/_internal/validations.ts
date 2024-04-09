import { HubEventAttendanceType, HubEventOnlineCapacityType } from "../types";

export const TIME_VALIDATIONS_WHEN_NOT_ALL_DAY = {
  if: {
    properties: {
      isAllDay: { const: false },
    },
  },
  then: {
    required: ["startTime", "endTime"],
    properties: {
      endTime: {
        format: "timePickerTime",
        formatExclusiveMinimum: { $data: "1/startTime" },
      },
    },
  },
};

export const URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID = {
  if: {
    properties: {
      attendanceType: {
        enum: [HubEventAttendanceType.Online, HubEventAttendanceType.Both],
      },
    },
  },
  then: {
    required: ["onlineUrl"],
    properties: {
      onlineUrl: {
        format: "url",
      },
    },
  },
};

export const FIXED_ONLINE_ATTENDANCE_VALIDATIONS = {
  if: {
    properties: {
      onlineCapacityType: { const: HubEventOnlineCapacityType.Fixed },
      attendanceType: {
        enum: [HubEventAttendanceType.Online, HubEventAttendanceType.Both],
      },
    },
  },
  then: {
    required: ["onlineCapacity"],
    properties: {
      onlineCapacity: {
        minimum: 1,
      },
    },
  },
};
