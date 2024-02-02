import { IConfigurationSchema } from "../../types";
import { FollowSchema } from "../follow/FollowSchema";

export const ActionLinksSchema: IConfigurationSchema = {
  type: 'object',
  required: [],
  properties: {
    source: {
      type: "string",
      default: "external",
      enum: [ "external", "content", "action" ]
    },
    label: { type: 'string' },
    description: { type: 'string' },
    href: {
      type: 'string',
    },
    contentId: {
      type: "array",
      maxItems: 1,
      items: {
        type: "string"
      }
    },
    action: {
      type: "string",
      enum: [ "follow", "share" ]
    },
    section: {
      type: "string"
    },
    // well-known Hub action configs
    follow: FollowSchema
  },
  allOf: [
    // conditionally validate formatting for "href" for "external" links
    {
      if: {
        properties: {
          source: { const: "external" },
          href: { minLength: 1 }
        }
      },
      then: { properties: { "href": { format: "uri" }} },
    },
    // conditionally require "label" & "href" for "external" links
    {
      if: { required: ['source'], properties: { source: { const: "external" } } },
      then: { required: ['label', 'href'] },
    },
    // conditionally require "label" & "contentId" for "content" links
    {
      if: { required: ['source'], properties: { source: { const: "content" } } },
      then: { required: ['label', "contentId"] },
    },
    // conditionally require "action" for well-known action links
    {
      if: { required: ['source'], properties: { source: { const: "action" } } },
      then: { required: ["action"] },
    }
  ],
};