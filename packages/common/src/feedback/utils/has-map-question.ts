import { IS123Question } from "../types";
import { getMapQuestion } from "./get-map-question";

/**
 * Determines if the given Array of questions contains
 * a map question
 * @param {Array} questions An array of questions
 * @returns {boolean}
 */
export const hasMapQuestion = (questions: IS123Question[]) => {
  return Boolean(getMapQuestion(questions));
};
