import { MAP_SURVEY_TYPEKEYWORD } from "../constants";

/**
 * Adds or removes MAP_SURVEY_TYPEKEYWORD type keyword and returns the updated list
 * @param {IGroup|IHubContent|IHubItemEntity} subject
 * @param {boolean} displayMap
 * @returns {string[]} updated list of type keywords
 */
export function setDisplayMapKeyword(
  typeKeywords: string[],
  displayMap: boolean
): string[] {
  const updatedTypeKeywords = (typeKeywords || []).filter(
    (typeKeyword: string) => typeKeyword !== MAP_SURVEY_TYPEKEYWORD
  );
  if (!displayMap) {
    updatedTypeKeywords.push(MAP_SURVEY_TYPEKEYWORD);
  }
  return updatedTypeKeywords;
}
