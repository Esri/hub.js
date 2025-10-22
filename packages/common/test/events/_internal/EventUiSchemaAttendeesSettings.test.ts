import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { buildUiSchema } from "../../../src/events/_internal/EventUiSchemaAttendeesSettings";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { HubEventAttendanceType } from "../../../src/events/enums/hubEventAttendanceType";

describe("EventUiSchemaAttendeesSettings", () => {
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
        attendanceType: HubEventAttendanceType.InPerson,
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
            type: "Section",
            elements: [
              {
                labelKey: `myI18nScope.fields.allowRegistration.label`,
                scope: "/properties/allowRegistration",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  type: "radio",
                  helperText: {
                    labelKey: `myI18nScope.fields.allowRegistration.helperText`,
                  },
                  labels: [
                    `{{myI18nScope.fields.allowRegistration.enabled.label:translate}}`,
                    `{{myI18nScope.fields.allowRegistration.disabled.label:translate}}`,
                  ],
                  descriptions: [
                    `{{myI18nScope.fields.allowRegistration.enabled.description:translate}}`,
                    `{{myI18nScope.fields.allowRegistration.disabled.description:translate}}`,
                  ],
                  icons: ["user-calendar", "circle-disallowed"],
                  layout: "horizontal",
                },
              },
              {
                labelKey: `myI18nScope.fields.notifyAttendees.label`,
                scope: "/properties/notifyAttendees",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  type: "radio",
                  helperText: {
                    labelKey: `myI18nScope.fields.notifyAttendees.helperText`,
                  },
                  labels: [
                    `{{myI18nScope.fields.notifyAttendees.enabled.label:translate}}`,
                    `{{myI18nScope.fields.notifyAttendees.disabled.label:translate}}`,
                  ],
                  descriptions: [
                    `{{myI18nScope.fields.notifyAttendees.enabled.description:translate}}`,
                    `{{myI18nScope.fields.notifyAttendees.disabled.description:translate}}`,
                  ],
                  icons: ["envelope", "circle-disallowed"],
                  layout: "horizontal",
                },
              },
            ],
          },
        ],
      });
    });
  });
});
