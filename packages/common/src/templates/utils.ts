import { IItem } from "@esri/arcgis-rest-types";
import { dasherize } from "../utils";
import { capitalize } from "../util";

/**
 * We do our best to glean what the solution template
 * is supposed to become when activated. This util
 * extracts the expected item type from the
 * hubSolutionType typeKeyword on the solution item
 *
 * We use this in various UIs to show the expected
 * type rather than "Solution"
 *
 * @param template
 */
export const getActivatedTemplateType = (template: IItem): string => {
  let activatedType = "Solution";
  // 1. Extract the camelCase item type from the
  // hubSolutionType|<camel-case-item-type> typeKeyword
  const hubSolutionTypeKeyword = template.typeKeywords.find((keyword: string) =>
    keyword.startsWith("hubSolutionType|")
  );

  // 2. Attempt to de-camelize the item type
  if (hubSolutionTypeKeyword) {
    const camelizedType = hubSolutionTypeKeyword.split("|")[1];
    activatedType = dasherize(camelizedType)
      .split("-")
      .map((str) => capitalize(str))
      .join(" ");

    // some item types need to be handled separately
    // because they don't follow the standard pattern
    const exceptionMap: Record<string, string> = {
      storyMap: "StoryMap",
      // TODO: add other relevant exceptions
    };

    if (exceptionMap[camelizedType]) {
      activatedType = exceptionMap[camelizedType];
    }
  }

  return activatedType;
};
