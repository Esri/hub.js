import { HubEntityHero } from "../../types";

/**
 * adds/updates the entity hero typekeyword and returns
 * a new array of typekeywords
 * @param typeKeywords entity's current typekeywords
 * @param hero entity hero
 */
export function setEntityHeroKeyword(
  typeKeywords: string[],
  hero: HubEntityHero
): string[] {
  // filter out the existing hero typekeyword
  const filteredTypekeywords = typeKeywords.filter((typekeyword: string) => {
    return !typekeyword.startsWith("hero|");
  });

  // add the new/updated hero typekeyword
  filteredTypekeywords.push(`hero|${hero}`);
  return filteredTypekeywords;
}
