import {
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_IMAGE_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  DISCUSSION_SETTINGS_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared/subschemas";
import { IConfigurationSchema } from "../../core/schemas/types";

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
    discussionSettings: DISCUSSION_SETTINGS_SCHEMA,
    tags: ENTITY_TAGS_SCHEMA,
  },
} as IConfigurationSchema;
