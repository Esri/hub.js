import { DRAFT_RESOURCE_REGEX } from "./_draft-resource-regex";

/**
 *
 * @param draftName
 */
export function getDraftDate(draftName: string) {
  const parsed = DRAFT_RESOURCE_REGEX.exec(draftName);
  let ret;
  try {
    ret = new Date(parseInt(parsed[1], 10));
  } catch {
    ret = null;
  }
  return ret;
}
