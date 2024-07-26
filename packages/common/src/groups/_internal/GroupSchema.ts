import { IConfigurationSchema } from "../../core";
import {
  ENTITY_IMAGE_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
} from "../../core/schemas/shared";

export type GroupEditorType = (typeof GroupEditorTypes)[number];
export const GroupEditorTypes = [
  "hub:group:edit",
  "hub:group:settings",
  "hub:group:discussions",
  // editor to create a followers group
  "hub:group:create:followers",
  // editor to create an association group
  "hub:group:create:association",
  "hub:group:create:view",
  "hub:group:create:edit",
  "hub:group:create",
] as const;

/**
 * Defines the JSON schema for a Hub Group's editable fields
 */
export const GroupSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      ...ENTITY_SUMMARY_SCHEMA,
      // group snippets (mapped to summary on the entity) have
      // a max char limit of 250
      maxLength: 250,
    },
    description: { type: "string" },
    _thumbnail: ENTITY_IMAGE_SCHEMA,
    isSharedUpdate: { type: "boolean", enum: [false, true], default: false },
    membershipAccess: {
      type: "string",
      enum: ["organization", "collaborators", "anyone"],
      default: "anyone",
    },
    isViewOnly: {
      type: "boolean",
      enum: [false, true],
      default: false,
    },
    isDiscussable: ENTITY_IS_DISCUSSABLE_SCHEMA,
  },
  allOf: [
    // if the group is a shared update group, it must have a membershipAccess of org or collaborators
    {
      if: {
        properties: {
          isSharedUpdate: { const: true },
        },
      },
      then: {
        properties: {
          membershipAccess: {
            pattern: "(organization|collaborators)",
          },
        },
      },
    },
  ],
} as IConfigurationSchema;
