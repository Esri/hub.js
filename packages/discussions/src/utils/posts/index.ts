import { parseDatasetId } from "@esri/hub-common";
import { IDiscussionParams } from "../../types";
import { MENTION_ATTRIBUTE } from "../constants";

export { canModifyPost } from "./can-modify-post";
export { canDeletePost } from "./can-delete-post";
export { canModifyPostStatus } from "./can-modify-post-status";
export { isDiscussable } from "@esri/hub-common";

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

const MENTION_ATTRIBUTE_AND_VALUE_PATTERN = new RegExp(
  `${MENTION_ATTRIBUTE}=('|")[\\w@\\.-]+('|")`,
  "g"
);
const MENTION_ATTRIBUTE_PATTERN = new RegExp(`${MENTION_ATTRIBUTE}=`, "g");
const NON_WORDS_PATTERN = new RegExp("[^\\w@\\.-]", "g");

/**
 * Parses mentioned users
 * @param text A string to parse mentioned users from
 * @returns A unique collection of usernames parsed from the provided text
 */
export function parseMentionedUsers(text = ""): string[] {
  const toReplaced = (input: string, pattern: RegExp) =>
    input.replace(pattern, "");
  const toMentionedUsers = (
    acc: RegExpMatchArray | string[],
    match: string
  ) => {
    const username = [MENTION_ATTRIBUTE_PATTERN, NON_WORDS_PATTERN].reduce(
      toReplaced,
      match
    );
    return acc.indexOf(username) < 0 ? [...acc, username] : acc;
  };
  const matches =
    text.match(MENTION_ATTRIBUTE_AND_VALUE_PATTERN) || ([] as string[]);
  return matches.reduce(toMentionedUsers, []);
}
