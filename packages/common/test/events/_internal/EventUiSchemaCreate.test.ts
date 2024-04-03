import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { buildUiSchema } from "../../../src/events/_internal/EventUiSchemaCreate";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";

describe("EventUiSchemaCreate", () => {
  describe("buildUiSchema", () => {
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
      const res = await buildUiSchema(
        "myI18nScope",
        entity,
        authdCtxMgr.context
      );
      expect(res).toEqual({
        type: "Layout",
        elements: [
          {
            labelKey: `myI18nScope.fields.name.label`,
            scope: "/properties/name",
            type: "Control",
            options: {
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `myI18nScope.fields.name.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  labelKey: `shared.fields.title.maxLengthError`,
                },
              ],
            },
          },
          {
            labelKey: `myI18nScope.fields.date.label`,
            scope: "/properties/startDate",
            type: "Control",
            options: {
              control: "hub-field-input-date",
              min: jasmine.any(String),
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `myI18nScope.fields.date.requiredError`,
                },
              ],
            },
          },
          {
            labelKey: `myI18nScope.fields.allDay.label`,
            type: "Control",
            scope: "/properties/isAllDay",
            options: {
              control: "hub-field-input-switch",
            },
          },
          {
            labelKey: `myI18nScope.fields.startTime.label`,
            scope: "/properties/startTime",
            type: "Control",
            rule: {
              condition: {
                scope: "/properties/isAllDay",
                schema: { const: false },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-time",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `myI18nScope.fields.startTime.requiredError`,
                },
              ],
            },
          },
          {
            labelKey: `myI18nScope.fields.endTime.label`,
            scope: "/properties/endTime",
            type: "Control",
            rule: {
              condition: {
                scope: "/properties/isAllDay",
                schema: { const: false },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-time",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `myI18nScope.fields.endTime.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "formatExclusiveMinimum",
                  icon: true,
                  labelKey: `myI18nScope.fields.endTime.minTimeError`,
                },
              ],
            },
          },
          {
            labelKey: `myI18nScope.fields.attendanceType.label`,
            scope: "/properties/attendanceType",
            type: "Control",
            options: {
              control: "hub-field-input-radio-group",
              enum: { i18nScope: `myI18nScope.fields.attendanceType` },
            },
          },
          {
            labelKey: `myI18nScope.fields.onlineUrl.label`,
            scope: "/properties/onlineUrl",
            type: "Control",
            rule: {
              condition: {
                scope: "/properties/attendanceType",
                schema: { enum: ["online", "both"] },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-input",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `myI18nScope.fields.onlineUrl.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "format",
                  icon: true,
                  labelKey: `myI18nScope.fields.onlineUrl.linkHrefFormatError`,
                },
              ],
            },
          },
        ],
      });
    });
  });
});
