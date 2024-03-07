import { IS123Question } from "../types";

/**
 * Determines if the given question is a map question
 * @param {Object} question A question object
 * @returns {boolean}
 */
export const isMapQuestion = (question: IS123Question) => {
  const { type, maps = [], defaultMap } = question;
  const types = [
    "esriQuestionTypeGeoPoint",
    "esriQuestionTypePolyline",
    "esriQuestionTypePolygon",
  ];
  const isType = types.includes(type);
  return isType && (maps.length > 0 || Boolean(defaultMap));
};
