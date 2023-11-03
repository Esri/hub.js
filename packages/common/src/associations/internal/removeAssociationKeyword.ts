import { HubEntityType } from "../../core";

export function removeAssociationKeyword(
  typeKeywords: string[] = [],
  identifier: HubEntityType,
  id: string
): string[] {
  const associationKeyword = `${identifier}|${id}`;
  const filteredKeywords = typeKeywords.filter(
    (keyword) => keyword !== associationKeyword
  );

  return filteredKeywords;
}
