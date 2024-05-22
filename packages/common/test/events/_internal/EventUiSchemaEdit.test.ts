import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { buildUiSchema } from "../../../src/events/_internal/EventUiSchemaEdit";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import {
  HubEventAttendanceType,
  HubEventOnlineCapacityType,
} from "../../../src/events/types";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as getDatePickerDateUtils from "../../../src/utils/date/getDatePickerDate";
import * as getCategoryItemsModule from "../../../src/core/schemas/internal/getCategoryItems";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";

describe("EventUiSchemaEdit", () => {
  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().mockDate(new Date("2024-04-03T16:30:00.000Z"));
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

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
        categories: ["category1"],
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
        tags: ["tag1"],
        ...datesAndTimes,
      } as unknown as IHubEvent;
      const getDatePickerDateSpy = spyOn(
        getDatePickerDateUtils,
        "getDatePickerDate"
      ).and.returnValue("2024-04-03");
      const tags = [{ value: "tag1" }, { value: "tag2" }];
      const getTagItemsSpy = spyOn(
        getTagItemsModule,
        "getTagItems"
      ).and.returnValue(Promise.resolve(tags));
      const categories = [{ value: "category1" }, { value: "category2" }];
      const getCategoryItemsSpy = spyOn(
        getCategoryItemsModule,
        "getCategoryItems"
      ).and.returnValue(Promise.resolve(categories));
      const res = await buildUiSchema(
        "myI18nScope",
        entity,
        authdCtxMgr.context
      );
      expect(getDatePickerDateSpy).toHaveBeenCalledTimes(1);
      expect(getDatePickerDateSpy).toHaveBeenCalledWith(
        jasmine.any(Date),
        entity.timeZone
      );
      expect(getTagItemsSpy).toHaveBeenCalledTimes(1);
      expect(getTagItemsSpy).toHaveBeenCalledWith(
        entity.tags,
        authdCtxMgr.context.portal.id,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getCategoryItemsSpy).toHaveBeenCalledTimes(1);
      expect(getCategoryItemsSpy).toHaveBeenCalledWith(
        authdCtxMgr.context.portal.id,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(res).toEqual({
        type: "Layout",
        elements: [
          {
            type: "Section",
            labelKey: `myI18nScope.sections.eventInfo.label`,
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
                labelKey: `myI18nScope.fields.description.label`,
                scope: "/properties/description",
                type: "Control",
                options: {
                  control: "hub-field-input-rich-text",
                  type: "textarea",
                  helperText: {
                    labelKey: `myI18nScope.fields.description.helperText`,
                  },
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `myI18nScope.fields.description.requiredError`,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `myI18nScope.sections.dateTime.label`,
            elements: [
              {
                labelKey: `myI18nScope.fields.startDate.label`,
                scope: "/properties/startDate",
                type: "Control",
                options: {
                  control: "hub-field-input-date",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `myI18nScope.fields.startDate.requiredError`,
                    },
                  ],
                },
              },
              {
                labelKey: `myI18nScope.fields.endDate.label`,
                scope: "/properties/endDate",
                type: "Control",
                options: {
                  control: "hub-field-input-date",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `myI18nScope.fields.endDate.requiredError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "formatMinimum",
                      icon: true,
                      labelKey: `myI18nScope.fields.endDate.minDateError`,
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
                labelKey: `myI18nScope.fields.timeZone.label`,
                scope: "/properties/timeZone",
                type: "Control",
                options: {
                  control: "hub-field-input-time-zone",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `myI18nScope.fields.timeZone.requiredError`,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `myI18nScope.sections.location.label`,
            elements: [
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
                    schema: {
                      enum: [
                        HubEventAttendanceType.Online,
                        HubEventAttendanceType.Both,
                      ],
                    },
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
                      labelKey: `shared.errors.urlFormat`,
                    },
                  ],
                },
              },
              {
                labelKey: `myI18nScope.fields.onlineDetails.label`,
                scope: "/properties/onlineDetails",
                type: "Control",
                rule: {
                  condition: {
                    scope: "/properties/attendanceType",
                    schema: {
                      enum: [
                        HubEventAttendanceType.Online,
                        HubEventAttendanceType.Both,
                      ],
                    },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-field-input-rich-text",
                  type: "textarea",
                  helperText: {
                    labelKey: `myI18nScope.fields.onlineDetails.helperText`,
                  },
                },
              },
              {
                labelKey: `myI18nScope.fields.onlineCapacityType.label`,
                scope: "/properties/onlineCapacityType",
                type: "Control",
                rule: {
                  condition: {
                    scope: "/properties/attendanceType",
                    schema: {
                      enum: [
                        HubEventAttendanceType.Online,
                        HubEventAttendanceType.Both,
                      ],
                    },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-field-input-radio-group",
                  enum: { i18nScope: `myI18nScope.fields.onlineCapacityType` },
                },
              },
              {
                labelKey: `myI18nScope.fields.onlineCapacity.label`,
                scope: "/properties/onlineCapacity",
                type: "Control",
                rule: {
                  condition: {
                    schema: {
                      properties: {
                        attendanceType: {
                          enum: [
                            HubEventAttendanceType.Online,
                            HubEventAttendanceType.Both,
                          ],
                        },
                        onlineCapacityType: {
                          const: HubEventOnlineCapacityType.Fixed,
                        },
                      },
                    },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-field-input-input",
                  type: "number",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `myI18nScope.fields.onlineCapacity.requiredError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "minimum",
                      icon: true,
                      labelKey: `myI18nScope.fields.onlineCapacity.minimumError`,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `myI18nScope.sections.discoverability.label`,
            elements: [
              {
                labelKey: `myI18nScope.fields.tags.label`,
                scope: "/properties/tags",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: tags,
                  allowCustomValues: true,
                  selectionMode: "multiple",
                  placeholderIcon: "label",
                  helperText: {
                    labelKey: `myI18nScope.fields.tags.helperText`,
                  },
                },
              },
              {
                labelKey: `myI18nScope.fields.categories.label`,
                scope: "/properties/categories",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: categories,
                  allowCustomValues: false,
                  selectionMode: "multiple",
                  placeholderIcon: "select-category",
                  helperText: {
                    labelKey: `myI18nScope.fields.categories.helperText`,
                  },
                },
              },
              {
                labelKey: `myI18nScope.fields.summary.label`,
                scope: "/properties/summary",
                type: "Control",
                options: {
                  control: "hub-field-input-input",
                  type: "textarea",
                  rows: 4,
                  helperText: {
                    labelKey: `myI18nScope.fields.summary.helperText`,
                  },
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: `shared.fields.summary.maxLengthError`,
                    },
                  ],
                },
              },
            ],
          },
        ],
      });
    });
  });
});
