import type { IArcGISContext } from "../../../../types/IArcGISContext";
import { IUiSchema } from "../../types";
import { EntityEditorOptions } from "../EditorOptions";

/**
 * Builds the UI Schema for the "settings => discussions" workspace pane
 * @param i18nScope the i18n scope for translations
 * @param options an EntityEditorOptions object
 * @param context an IArcGISContext object
 * @returns a promise that resolves a UI Schema object
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema: IUiSchema = {
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
                `{{${i18nScope}.fields.discussable.disabled.label:translate}}`,
              ],
              descriptions: [
                "{{shared.fields.discussable.disabled.label:translate}}",
                `{{${i18nScope}.fields.discussable.disabled.description:translate}}`,
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
  };
  // if (context.hubLicense === "hub-premium") {
  //   uiSchema.elements[0].elements.push({
  //     labelKey: "shared.fields.allowedChannelIds.label",
  //     scope: "/properties/discussionSettings/properties/allowedChannelIds",
  //     type: "Control",
  //     options: {
  //       control: "hub-field-input-gallery-picker",
  //       targetEntity: "channel",
  //       showSelection: false,
  //       showAllCollectionFacet: false,
  //       canReorder: false,
  //       catalogs: [
  //         {
  //           schemaVersion: 1,
  //           title:
  //             "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
  //           scopes: {},
  //           collections: [
  //             {
  //               label:
  //                 "{{shared.fields.allowedChannelIds.catalog.title:translate}}",
  //               key: "channels",
  //               targetEntity: "channel",
  //               scope: {
  //                 targetEntity: "channel",
  //                 filters: [],
  //                 collection: "channel",
  //               },
  //               include: ["groups"],
  //             },
  //           ],
  //         },
  //       ],
  //       facets: [
  //         {
  //           label:
  //             "{{shared.fields.allowedChannelIds.facets.access.label:translate}}",
  //           key: "access",
  //           display: "multi-select",
  //           operation: "OR",
  //           options: [
  //             {
  //               label:
  //                 "{{shared.fields.allowedChannelIds.facets.access.options.public.label:translate}}",
  //               key: "public",
  //               selected: false,
  //               predicates: [
  //                 {
  //                   access: "public",
  //                 },
  //               ],
  //             },
  //             {
  //               label:
  //                 "{{shared.fields.allowedChannelIds.facets.access.options.org.label:translate}}",
  //               key: "organization",
  //               selected: false,
  //               predicates: [
  //                 {
  //                   access: "org",
  //                 },
  //               ],
  //             },
  //             {
  //               label:
  //                 "{{shared.fields.allowedChannelIds.facets.access.options.private.label:translate}}",
  //               key: "private",
  //               selected: false,
  //               predicates: [
  //                 {
  //                   access: "private",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           label:
  //             "{{shared.fields.allowedChannelIds.facets.groups.label:translate}}",
  //           key: "groups",
  //           display: "multi-select",
  //           operation: "OR",
  //           options: context.currentUser.groups.map((group) => ({
  //             label: group.title,
  //             key: group.title,
  //             selected: false,
  //             predicates: [
  //               {
  //                 groups: group.id,
  //               },
  //             ],
  //           })),
  //         },
  //       ],
  //       include: "groups",
  //       reorderable: false,
  //     },
  //   });
  // }
  return uiSchema;
};
