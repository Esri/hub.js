/**
 * Determines if the given question is actually a page of questions
 * @param {Object} question A question object
 * @returns {boolean}
 */
export const isPageQuestion = (question: any) => {
  return question.type === "esriQuestionTypePage";
};
