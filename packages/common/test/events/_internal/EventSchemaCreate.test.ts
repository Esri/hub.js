import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { buildSchema } from "../../../src/events/_internal/EventSchemaCreate";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { IConfigurationSchema } from "../../../src/core/schemas/types";
import * as getDefaultEventDatesAndTimesModule from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import { ENTITY_NAME_SCHEMA } from "../../../src/core/schemas/shared/subschemas";

describe("EventSchemaCreate", () => {
  describe("buildSchema", () => {
    it("should return the expected ui schema", async () => {
      const authdCtxMgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
        } as unknown as PortalModule.IUser,
        portal: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
        } as unknown as PortalModule.IPortal,
        portalUrl: "https://myserver.com",
      });
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/New_York",
      };
      const entity = {
        access: "private",
        allowRegistration: true,
        attendanceType: "inPerson",
        categories: [],
        inPersonCapacity: null,
        isAllDay: false,
        isCanceled: false,
        isDiscussable: true,
        isPlanned: true,
        isRemoved: false,
        name: "",
        notifyAttendees: true,
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        permissions: [],
        references: [],
        schemaVersion: 1,
        tags: [],
        ...datesAndTimes,
      } as unknown as IHubEvent;
      const getDefaultEventDatesAndTimesSpy = spyOn(
        getDefaultEventDatesAndTimesModule,
        "getDefaultEventDatesAndTimes"
      ).and.returnValue(datesAndTimes);
      const res = buildSchema();
      expect(res).toEqual({
        required: ["name", "startDate", "endDate"],
        properties: {
          name: ENTITY_NAME_SCHEMA,
          startDate: {
            type: "string",
            format: "date",
            formatMinimum: datesAndTimes.startDate,
          },
          startTime: {
            type: "string",
          },
          endTime: {
            type: "string",
          },
          attendanceType: {
            type: "string",
            enum: ["inPerson", "online", "both"],
            default: "inPerson",
          },
          isAllDay: {
            type: "boolean",
            default: false,
          },
          onlineUrl: {
            type: "string",
          },
        },
        allOf: [
          {
            if: {
              properties: {
                attendanceType: { enum: ["online", "both"] },
              },
            },
            then: {
              required: ["onlineUrl"],
              properties: {
                onlineUrl: {
                  format: "url" as string,
                },
              },
            },
          },
          {
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
          },
        ],
      } as IConfigurationSchema);
    });
  });
});
