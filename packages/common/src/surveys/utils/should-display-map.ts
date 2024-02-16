import { IItem } from "@esri/arcgis-rest-types";
import { MAP_SURVEY_TYPEKEYWORD } from "../../feedback";

/**
 * Determines the display mode of the given survey
 * @param {Object} formItem A Form item
 * @returns {boolean}
 */
export const shouldDisplayMap = (item: IItem) => {
  return (
    item.type === "Form" && item.typeKeywords.includes(MAP_SURVEY_TYPEKEYWORD)
  );
};
