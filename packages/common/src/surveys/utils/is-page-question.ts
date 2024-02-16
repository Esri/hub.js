import { IS123Question } from "../types";

/**
 * Determines if the given question is actually a page of questions
 * @param {Object} question A question object
 * @returns {boolean}
 */
export const isPageQuestion = (question: IS123Question) => {
  return question.type === "esriQuestionTypePage";
};
