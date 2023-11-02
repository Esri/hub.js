import { HubEntityType } from "../../core";

export function setAssociationKeyword(
  typeKeywords: string[] = [],
  identifier: HubEntityType,
  id: string
): string[] {
  const keyword = `${identifier}|${id}`;
  if (!typeKeywords.includes(keyword)) {
    typeKeywords = [...typeKeywords, keyword];
  }

  return typeKeywords;
}
