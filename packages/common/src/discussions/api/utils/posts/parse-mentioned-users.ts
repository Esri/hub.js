import { MENTION_ATTRIBUTE } from "../../../constants";

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
