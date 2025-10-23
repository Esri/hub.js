import { IArcGISContext } from "../../../../../src/types/IArcGISContext";
import { IHubDiscussion } from "../../../../../src/core/types/IHubDiscussion";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";

describe("EntityUiSchemaDiscussionsSettings", () => {
  it("should build a ui schema for a premium user", async () => {
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-premium",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
        orgId: "o1",
      },
      trustedOrgs: [{ from: { orgId: "o1" } }],
      trustedOrgIds: ["o1"],
    } as unknown as IArcGISContext;
    const results = await buildUiSchema("myI18nScope", entity, context);
    expect(results).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "shared.sections.discussionSettings.moderation.label",
          elements: [
            {
              labelKey: "shared.fields.discussable.label",
              scope: "/properties/isDiscussable",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                labels: [
                  "{{shared.fields.discussable.enabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{shared.fields.discussable.disabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.description:translate}}",
                ],
                icons: ["speech-bubbles", "circle-disallowed"],
                layout: "horizontal",
                styles: { "max-width": "45rem" },
                type: "radio",
              },
            },
            {
              labelKey: "shared.fields.allowedChannelIds.label",
              scope:
                "/properties/discussionSettings/properties/allowedChannelIds",
              type: "Control",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "channel",
                showSelection: false,
                showAddContent: true,
                allowGroupSelection: false,
                showAllCollectionFacet: false,
                canReorder: false,
                linkTarget: "event",
                catalogs: [
                  {
                    schemaVersion: 1,
                    title:
                      "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
                    scopes: {
                      channel: {
                        targetEntity: "channel",
                        filters: [
                          {
                            predicates: [],
                          },
                        ],
                      },
                    },
                    collections: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
                        key: "channels",
                        targetEntity: "channel",
                        scope: {
                          targetEntity: "channel",
                          filters: [],
                        },
                        include: ["groups"],
                      },
                    ],
                  },
                ],
                facets: [
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.access.label:translate}}",
                    key: "access",
                    display: "multi-select",
                    operation: "OR",
                    options: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.public.label:translate}}",
                        key: "public",
                        selected: false,
                        predicates: [
                          {
                            access: "public",
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.org.label:translate}}",
                        key: "organization",
                        selected: false,
                        predicates: [
                          {
                            access: "org",
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.private.label:translate}}",
                        key: "private",
                        selected: false,
                        predicates: [
                          {
                            access: "private",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.organization.label:translate}}",
                    key: "organization",
                    display: "single-select",
                    operation: "OR",
                    options: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.organization.label:translate}}",
                        key: "organization",
                        predicates: [
                          {
                            orgId: [context.currentUser.orgId],
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.world.label:translate}}",
                        key: "world",
                        predicates: [
                          {
                            orgId: [null],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.groups.label:translate}}",
                    key: "groups",
                    display: "multi-select",
                    operation: "OR",
                    options: [
                      {
                        label: "Group 1",
                        key: "Group 1",
                        selected: false,
                        predicates: [
                          {
                            group: "42b",
                          },
                        ],
                      },
                      {
                        label: "Group 2",
                        key: "Group 2",
                        selected: false,
                        predicates: [
                          {
                            group: "53a",
                          },
                        ],
                      },
                    ],
                  },
                ],
                include: "groups",
              },
            },
          ],
        },
      ],
    });
  });
  it("should build a ui schema with all of the org facets", async () => {
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-premium",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
        orgId: "o1",
      },
      communityOrgId: "co1",
      trustedOrgs: [{ from: { orgId: "o1" } }, { from: { orgId: "o2" } }],
      trustedOrgIds: ["o1", "o2"],
    } as unknown as IArcGISContext;
    const results = await buildUiSchema("myI18nScope", entity, context);
    expect(results).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "shared.sections.discussionSettings.moderation.label",
          elements: [
            {
              labelKey: "shared.fields.discussable.label",
              scope: "/properties/isDiscussable",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                labels: [
                  "{{shared.fields.discussable.enabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{shared.fields.discussable.disabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.description:translate}}",
                ],
                icons: ["speech-bubbles", "circle-disallowed"],
                layout: "horizontal",
                styles: { "max-width": "45rem" },
                type: "radio",
              },
            },
            {
              labelKey: "shared.fields.allowedChannelIds.label",
              scope:
                "/properties/discussionSettings/properties/allowedChannelIds",
              type: "Control",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "channel",
                showSelection: false,
                showAddContent: true,
                allowGroupSelection: false,
                showAllCollectionFacet: false,
                canReorder: false,
                linkTarget: "event",
                catalogs: [
                  {
                    schemaVersion: 1,
                    title:
                      "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
                    scopes: {
                      channel: {
                        targetEntity: "channel",
                        filters: [
                          {
                            predicates: [],
                          },
                        ],
                      },
                    },
                    collections: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
                        key: "channels",
                        targetEntity: "channel",
                        scope: {
                          targetEntity: "channel",
                          filters: [],
                        },
                        include: ["groups"],
                      },
                    ],
                  },
                ],
                facets: [
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.access.label:translate}}",
                    key: "access",
                    display: "multi-select",
                    operation: "OR",
                    options: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.public.label:translate}}",
                        key: "public",
                        selected: false,
                        predicates: [
                          {
                            access: "public",
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.org.label:translate}}",
                        key: "organization",
                        selected: false,
                        predicates: [
                          {
                            access: "org",
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.access.options.private.label:translate}}",
                        key: "private",
                        selected: false,
                        predicates: [
                          {
                            access: "private",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.organization.label:translate}}",
                    key: "organization",
                    display: "single-select",
                    operation: "OR",
                    options: [
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.organization.label:translate}}",
                        key: "organization",
                        predicates: [
                          {
                            orgId: [context.currentUser.orgId],
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.community.label:translate}}",
                        key: "community",
                        predicates: [
                          {
                            orgId: [context.communityOrgId],
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.partner.label:translate}}",
                        key: "partner",
                        predicates: [
                          {
                            orgId: ["o2"],
                          },
                        ],
                      },
                      {
                        label:
                          "{{shared.fields.allowedChannelIds.facets.organization.options.world.label:translate}}",
                        key: "world",
                        predicates: [
                          {
                            orgId: [null],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label:
                      "{{shared.fields.allowedChannelIds.facets.groups.label:translate}}",
                    key: "groups",
                    display: "multi-select",
                    operation: "OR",
                    options: [
                      {
                        label: "Group 1",
                        key: "Group 1",
                        selected: false,
                        predicates: [
                          {
                            group: "42b",
                          },
                        ],
                      },
                      {
                        label: "Group 2",
                        key: "Group 2",
                        selected: false,
                        predicates: [
                          {
                            group: "53a",
                          },
                        ],
                      },
                    ],
                  },
                ],
                include: "groups",
              },
            },
          ],
        },
      ],
    });
  });
  it("should build a ui schema for a non-premium user", async () => {
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-basic",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
      },
    } as unknown as IArcGISContext;
    const results = await buildUiSchema("myI18nScope", entity, context);
    expect(results).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "shared.sections.discussionSettings.moderation.label",
          elements: [
            {
              labelKey: "shared.fields.discussable.label",
              scope: "/properties/isDiscussable",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                labels: [
                  "{{shared.fields.discussable.enabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{shared.fields.discussable.disabled.label:translate}}",
                  "{{myI18nScope.fields.discussable.disabled.description:translate}}",
                ],
                icons: ["speech-bubbles", "circle-disallowed"],
                layout: "horizontal",
                styles: { "max-width": "45rem" },
                type: "radio",
              },
            },
          ],
        },
      ],
    });
  });
  it("should render the correct tile select layout for default variant", async () => {
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-premium",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
        orgId: "o1",
      },
      trustedOrgs: [{ from: { orgId: "o1" } }],
      trustedOrgIds: ["o1"],
    } as unknown as IArcGISContext;
    const results = await buildUiSchema("myI18nScope", entity, context);
    expect(results.elements[0].elements[0].options.layout).toBe("horizontal");
  });
  it("should build correct tile select layout for a compact variant", async () => {
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-premium",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
        orgId: "o1",
      },
      trustedOrgs: [{ from: { orgId: "o1" } }],
      trustedOrgIds: ["o1"],
    } as unknown as IArcGISContext;
    const results = await buildUiSchema(
      "myI18nScope",
      entity,
      context,
      "compact"
    );
    expect(results.elements[0].elements[0].options.layout).toBe("vertical");
  });
});
