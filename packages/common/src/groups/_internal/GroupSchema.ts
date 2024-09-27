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
    access: {
      type: "string",
      enum: ["private", "org", "public"],
      default: "private",
    },
    isSharedUpdate: { type: "boolean", enum: [false, true], default: false },
    leavingDisallowed: { type: "boolean", enum: [false, true], default: false },
    isOpenData: { type: "boolean", enum: [false, true], default: false },
    membershipAccess: {
      type: "string",
      enum: ["organization", "collaborators", "anyone"],
      default: "organization",
    },
    isViewOnly: {
      type: "boolean",
      enum: [false, true],
      default: false,
    },
    _join: {
      type: "string",
      enum: ["invite", "request", "auto"],
      default: "invite",
    },
    hiddenMembers: {
      type: "boolean",
      enum: [false, true],
      default: false,
    },
    isDiscussable: ENTITY_IS_DISCUSSABLE_SCHEMA,
  },
  allOf: [
    // if the group is not public, isOpenData must be false
    {
      if: {
        properties: {
          access: { pattern: "(private|org)" },
        },
      },
      then: {
        properties: {
          isOpenData: { const: false },
        },
      },
    },
    // if the group is is an admin group (leavingDisallowed === true), it must have a membershipAccess of organization
    {
      if: {
        properties: {
          leavingDisallowed: { const: true },
        },
      },
      then: {
        properties: {
          membershipAccess: {
            type: "string",
            const: "organization",
          },
        },
      },
    },
    // if the group is a shared update group (isSharedUpdate === true), it must have a membershipAccess of org or collaborators
    {
      if: {
        properties: {
          isSharedUpdate: { const: true },
        },
      },
      then: {
        properties: {
          membershipAccess: {
            type: "string",
            pattern: "(organization|collaborators)",
          },
        },
      },
    },
    // if the group has access === 'private', then the _join must be 'invite'
    {
      if: {
        properties: {
          access: { const: "private" },
        },
      },
      then: {
        properties: {
          _join: { const: "invite" },
        },
      },
    },
    // if the group is admin (leavingDisallowed === true) or isSharedUpdate === true, _join must be 'invite' or 'request'
    {
      if: {
        anyOf: [
          {
            properties: {
              leavingDisallowed: { const: true },
            },
          },
          {
            properties: {
              isSharedUpdate: { const: true },
            },
          },
        ],
      },
      then: {
        properties: {
          _join: { pattern: "(invite|request)" },
        },
      },
    },
  ],
} as IConfigurationSchema;
