import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { buildUiSchema } from "../../../src/events/_internal/EventUiSchemaEdit";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../../src/events/types";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as fetchCategoryItemsModule from "../../../src/core/schemas/internal/fetchCategoryItems";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as buildReferencedContentSchemaModule from "../../../src/events/_internal/buildReferencedContentSchema";

describe("EventUiSchemaEdit", () => {
  const referencedContentSchema = {
    scope: "/properties/referencedContentIds",
    type: "Control",
  };

  let buildReferencedContentSchemaSpy: jasmine.Spy;

  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().mockDate(new Date("2024-04-03T16:30:00.000Z"));
  });

  beforeEach(() => {
    buildReferencedContentSchemaSpy = spyOn(
      buildReferencedContentSchemaModule,
      "buildReferencedContentSchema"
    ).and.returnValue(referencedContentSchema);
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  describe("buildUiSchema", () => {
    it("should return the expected ui schema", async () => {
      const getLocationExtentSpy = spyOn(
        getLocationExtentModule,
        "getLocationExtent"
      ).and.returnValue(Promise.resolve([]));
      const getLocationOptionsSpy = spyOn(
        getLocationOptionsModule,
        "getLocationOptions"
      ).and.returnValue(Promise.resolve([]));
      const authdCtxMgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
          orgId: "9y2",
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
        id: "t2c",
        type: "Event",
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
        location: { type: "none" },
        ...datesAndTimes,
      } as unknown as IHubEvent;
      const tags = [{ value: "tag1" }, { value: "tag2" }];
      const getTagItemsSpy = spyOn(
        getTagItemsModule,
        "getTagItems"
      ).and.returnValue(Promise.resolve(tags));
      const categories = [{ value: "category1" }, { value: "category2" }];
      const fetchCategoryItemsSpy = spyOn(
        fetchCategoryItemsModule,
        "fetchCategoryItems"
      ).and.returnValue(Promise.resolve(categories));
      const res = await buildUiSchema(
        "myI18nScope",
        entity,
        authdCtxMgr.context
      );
      expect(getLocationExtentSpy).toHaveBeenCalledTimes(1);
      expect(getLocationExtentSpy).toHaveBeenCalledWith(
        entity.location,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getLocationOptionsSpy).toHaveBeenCalledTimes(1);
      expect(getLocationOptionsSpy).toHaveBeenCalledWith(
        entity.id,
        entity.type,
        entity.location,
        authdCtxMgr.context.portal.name,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getTagItemsSpy).toHaveBeenCalledTimes(1);
      expect(getTagItemsSpy).toHaveBeenCalledWith(
        entity.tags,
        authdCtxMgr.context.portal.id,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(fetchCategoryItemsSpy).toHaveBeenCalledTimes(1);
      expect(fetchCategoryItemsSpy).toHaveBeenCalledWith(
        authdCtxMgr.context.portal.id,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(buildReferencedContentSchemaSpy).toHaveBeenCalledTimes(1);
      expect(buildReferencedContentSchemaSpy).toHaveBeenCalledWith(
        "myI18nScope",
        authdCtxMgr.context
      );
      expect(res).toEqual({
        type: "Layout",
        elements: [
          {
            type: "Section",
            labelKey: "myI18nScope.sections.eventInfo.label",
            elements: [
              {
                labelKey: "myI18nScope.fields.name.label",
                scope: "/properties/name",
                type: "Control",
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: "myI18nScope.fields.name.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: "shared.fields.title.maxLengthError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.description.label",
                scope: "/properties/description",
                type: "Control",
                options: {
                  control: "hub-field-input-rich-text",
                  type: "textarea",
                  helperText: {
                    labelKey: "myI18nScope.fields.description.helperText",
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: "myI18nScope.sections.dateTime.label",
            elements: [
              {
                labelKey: "myI18nScope.fields.startDate.label",
                scope: "/properties/startDate",
                type: "Control",
                options: {
                  control: "hub-field-input-date",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: "myI18nScope.fields.startDate.requiredError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.endDate.label",
                scope: "/properties/endDate",
                type: "Control",
                options: {
                  control: "hub-field-input-date",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: "myI18nScope.fields.endDate.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "formatMinimum",
                      icon: true,
                      labelKey: "myI18nScope.fields.endDate.minDateError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.allDay.label",
                type: "Control",
                scope: "/properties/isAllDay",
                options: {
                  control: "hub-field-input-switch",
                },
              },
              {
                labelKey: "myI18nScope.fields.startTime.label",
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
                      labelKey: "myI18nScope.fields.startTime.requiredError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.endTime.label",
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
                      labelKey: "myI18nScope.fields.endTime.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "formatExclusiveMinimum",
                      icon: true,
                      labelKey: "myI18nScope.fields.endTime.minTimeError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.timeZone.label",
                scope: "/properties/timeZone",
                type: "Control",
                options: {
                  control: "hub-field-input-time-zone",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: "myI18nScope.fields.timeZone.requiredError",
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: "myI18nScope.sections.location.label",
            elements: [
              {
                labelKey: "myI18nScope.fields.attendanceType.label",
                scope: "/properties/attendanceType",
                type: "Control",
                options: {
                  control: "hub-field-input-radio-group",
                  enum: { i18nScope: "myI18nScope.fields.attendanceType" },
                },
              },
              {
                scope: "/properties/location",
                type: "Control",
                labelKey: "myI18nScope.fields.location.label",
                options: {
                  control: "hub-field-input-location-picker",
                  extent: [],
                  options: [],
                },
              },
              {
                labelKey: "myI18nScope.fields.inPersonCapacityType.label",
                scope: "/properties/inPersonCapacityType",
                type: "Control",
                rule: {
                  condition: {
                    scope: "/properties/attendanceType",
                    schema: {
                      enum: [
                        HubEventAttendanceType.InPerson,
                        HubEventAttendanceType.Both,
                      ],
                    },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-field-input-radio-group",
                  enum: {
                    i18nScope: "myI18nScope.fields.inPersonCapacityType",
                  },
                },
              },
              {
                labelKey: "myI18nScope.fields.inPersonCapacity.label",
                scope: "/properties/inPersonCapacity",
                type: "Control",
                rule: {
                  condition: {
                    schema: {
                      properties: {
                        attendanceType: {
                          enum: [
                            HubEventAttendanceType.InPerson,
                            HubEventAttendanceType.Both,
                          ],
                        },
                        inPersonCapacityType: {
                          const: HubEventCapacityType.Fixed,
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
                      labelKey:
                        "myI18nScope.fields.inPersonCapacity.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "minimum",
                      icon: true,
                      labelKey:
                        "myI18nScope.fields.inPersonCapacity.minimumError",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.onlineUrl.label",
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
                      labelKey: "myI18nScope.fields.onlineUrl.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "format",
                      icon: true,
                      labelKey: "shared.errors.urlFormat",
                    },
                  ],
                },
              },
              {
                labelKey: "myI18nScope.fields.onlineDetails.label",
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
                    labelKey: "myI18nScope.fields.onlineDetails.helperText",
                  },
                },
              },
              {
                labelKey: "myI18nScope.fields.onlineCapacityType.label",
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
                  enum: { i18nScope: "myI18nScope.fields.onlineCapacityType" },
                },
              },
              {
                labelKey: "myI18nScope.fields.onlineCapacity.label",
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
                          const: HubEventCapacityType.Fixed,
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
                      labelKey:
                        "myI18nScope.fields.onlineCapacity.requiredError",
                    },
                    {
                      type: "ERROR",
                      keyword: "minimum",
                      icon: true,
                      labelKey:
                        "myI18nScope.fields.onlineCapacity.minimumError",
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `myI18nScope.sections.referencedContent.label`,
            elements: [referencedContentSchema],
          },
          {
            type: "Section",
            labelKey: "myI18nScope.sections.discoverability.label",
            elements: [
              {
                labelKey: "myI18nScope.fields.tags.label",
                scope: "/properties/tags",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: tags,
                  allowCustomValues: true,
                  selectionMode: "multiple",
                  placeholderIcon: "label",
                  helperText: {
                    labelKey: "myI18nScope.fields.tags.helperText",
                  },
                },
              },
              {
                labelKey: "shared.fields.categories.label",
                scope: "/properties/categories",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: categories,
                  allowCustomValues: false,
                  selectionMode: "ancestors",
                  placeholderIcon: "select-category",
                  helperText: {
                    labelKey: "myI18nScope.fields.categories.helperText",
                  },
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [false],
                  },
                ],
              },
              {
                type: "Notice",
                options: {
                  notice: {
                    configuration: {
                      id: "no-categories-notice",
                      noticeType: "notice",
                      closable: false,
                      icon: "exclamation-mark-triangle",
                      kind: "warning",
                      scale: "m",
                    },
                    message:
                      "{{shared.fields.categories.noCategoriesNotice.body:translate}}",
                    autoShow: true,
                    actions: [
                      {
                        label:
                          "{{shared.fields.categories.noCategoriesNotice.link:translate}}",
                        icon: "launch",
                        href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
                        target: "_blank",
                      },
                    ],
                  },
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [false],
                  },
                ],
              },
              {
                labelKey: "myI18nScope.fields.summary.label",
                scope: "/properties/summary",
                type: "Control",
                options: {
                  control: "hub-field-input-input",
                  type: "textarea",
                  rows: 4,
                  helperText: {
                    labelKey: "myI18nScope.fields.summary.helperText",
                  },
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: "shared.fields.summary.maxLengthError",
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
