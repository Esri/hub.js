import { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionParams, IPost } from "../../types";
import { parseDatasetId, IHubContent } from "@esri/hub-common";
import { IUser } from "@esri/arcgis-rest-auth";
import { canModifyChannel } from "../channels";
import { CANNOT_DISCUSS, MENTION_ATTRIBUTE } from "../constants";

export { canModifyPost } from "../posts/can-modify-post";

/**
 * Utility that parses a discussion URI string into its component parts
 *
 * @export
 * @param {string} discussion A discussion URI
 * @return {string}
 */
export function parseDiscussionURI(discussion: string): IDiscussionParams {
  let url;
  try {
    url = new URL(discussion);
  } catch (e) {
    throw new Error(`Invalid URI: ${discussion}`);
  }
  const source = url.protocol.replace(":", "");
  const [, pathname] = discussion.split("://");
  const [type, identifier] = pathname.split("/");
  let id;
  let layer;
  if (identifier) {
    const { itemId, layerId } = parseDatasetId(identifier);
    [id, layer] = [itemId, layerId];
  }
  const searchParams = new URLSearchParams(url.search.replace("?", ""));
  const features =
    (searchParams.has("id") && searchParams.get("id").split(",")) || null;
  const attribute =
    (searchParams.has("attribute") && searchParams.get("attribute")) || null;
  return {
    source,
    type,
    id: id || null,
    layer: layer || null,
    features,
    attribute,
  };
}

/**
 * Utility to determine if a given IGroup, IItem or IHubContent
 * is discussable.
 * @export
 * @param {IGroup|IItem|IHubContent} The subject to evaluate
 * @return {boolean}
 */
export function isDiscussable(subject: IGroup | IItem | IHubContent) {
  return !(subject.typeKeywords ?? []).includes(CANNOT_DISCUSS);
}

/**
 * Determines if the given user has sufficient privileges to modify a post's status
 * @param post An IPost object
 * @param channel An IChannel object
 * @param user An IUser object
 * @returns true if the user can modify the post
 */
export function canModifyPostStatus(channel: IChannel, user: IUser): boolean {
  return canModifyChannel(channel, user);
}

/**
 * Determines if the given user has sufficient privileges to delete the given post
 * @param post An IPost object
 * @param channel An IChannel object
 * @param user An IUser object
 * @returns true if the user can delete the post
 */
export function canDeletePost(
  post: IPost,
  channel: IChannel,
  user: IUser
): boolean {
  return isPostCreator(post, user) || canModifyChannel(channel, user);
}

function isPostCreator(post: IPost, user: IUser) {
  return post.creator === user.username;
}

const MENTION_ATTRIBUTE_AND_VALUE_PATTERN = new RegExp(
  `${MENTION_ATTRIBUTE}=('|")(\\w)+('|")`,
  "g"
);
const MENTION_ATTRIBUTE_PATTERN = new RegExp(`${MENTION_ATTRIBUTE}=`, "g");
const NON_WORDS_PATTERN = new RegExp("[^\\w]", "g");

/**
 * Parses mentioned users
 * @param text A string to parse mentioned users from
 * @returns A unique collection of usernames parsed from the provided text
 */
export function parseMentionedUsers(text = ""): string[] {
  const toReplaced = (input: string, pattern: RegExp) =>
    input.replace(pattern, "");
  const toMentionedUsers = (acc: string[], match: string) => {
    const username = [MENTION_ATTRIBUTE_PATTERN, NON_WORDS_PATTERN].reduce(
      toReplaced,
      match
    );
    return acc.indexOf(username) < 0 ? [...acc, username] : acc;
  };
  const matches = text.match(MENTION_ATTRIBUTE_AND_VALUE_PATTERN) || [];
  return matches.reduce(toMentionedUsers, []);
}
