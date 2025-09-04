import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubDiscussion } from "../../core/types/IHubDiscussion";
import { getCadenceComboBoxItems } from "../utils";
import { fetchHubChannel } from "../../channels";
import { canModerateChannelV2 } from "../api/utils/channels/can-moderate-channel-v2";
import { DISCUSSION_ACTIVITIES } from "./DiscussionSchemaSubscription";

export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubDiscussion>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  // 1. Fetch allowed channels in parallel
  const allowedIds = options?.discussionSettings?.allowedChannelIds ?? [];
  const allowedChannels = await Promise.all(
    allowedIds.map((channelId) =>
      fetchHubChannel(channelId, context).catch(() => null)
    )
  );
  // 2. Transform channels -> UI sections
  // Build one sub-section per channel, tailoring checkbox options by access level
  const channelSections = allowedChannels
    .map((channel, idx) => {
      const isModerator = canModerateChannelV2(channel, context.currentUser);
      // Per-channel values we want to render:
      // - moderators: both options
      // - non-mods: only newPosts
      const values = isModerator ? [...DISCUSSION_ACTIVITIES] : ["newPosts"];

      return {
        type: "Section",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        label: `Channel: ${channel.name}`,
        options: {
          helperText: isModerator
            ? { label: "Role: moderator" }
            : { label: "Role: participant" },
        }, // i18n
        elements: [
          {
            // TBD:
            // option1: Numeric index binds to channels[idx].subscriptions in the data model
            scope: `/properties/channels/${idx}/subscriptions`,
            type: "Control",
            options: {
              control: "hub-field-input-checkbox-group",
              values: [...values],
              enum: {
                i18nScope: `${i18nScope}.channels.subscriptions`,
              },
            },
          },
        ],
      };
    })
    .filter(Boolean); // filter out nulls

  // 3. Return full UI schema
  return {
    type: "Layout",
    elements: [
      // Cadence
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.header.label`,
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.header.helperText`,
          },
        },
        elements: [
          {
            labelKey: `${i18nScope}.cadence.label`,
            scope: "/properties/cadence",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              items: getCadenceComboBoxItems(),
              allowCustomValues: false,
              selectionMode: "single",
            },
          },
        ],
      },
      // Subscriptions blocks/accordions
      {
        type: "Section",
        options: {
          section: "accordion",
          selectionMode: "single",
        },
        elements: [
          {
            type: "Section",
            label: "Discussion activity", // i18n
            options: {
              section: "accordionItem",
              expanded: true,
              helperText: {
                label:
                  "Subscribe to discussions based off your role in each channel", // i18n
              },
            },
            elements: channelSections,
          },
          {
            type: "Section",
            label: "Item activity", // i18n
            options: {
              section: "accordionItem",
              expanded: false,
              helperText: {
                label:
                  "Subscribe to item detail updates, new content, events, and more", // i18n
              },
            },
            elements: [
              {
                scope: "/properties/itemActivity",
                type: "Control",
                options: {
                  control: "hub-field-input-checkbox-group",
                  enum: {
                    i18nScope: "${i18nScope}.itemActivity",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
