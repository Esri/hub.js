import { isMapQuestion } from "./is-map-question";
import { isPageQuestion } from "./is-page-question";

/**
 * Gets the map question from an Array of questions
 * @param {Array} questions An array of questions
 * @returns {Object}
 */
export const getMapQuestion = (questions: any[]): any => {
  const [head, ...tail] = questions;
  return getMapQuestionRecur(head, tail);
};

const getMapQuestionRecur: any = (head: any, tail: any) => {
  let result;
  if (!head) {
    result = null;
  } else if (isMapQuestion(head)) {
    result = head;
  } else {
    if (isPageQuestion(head)) {
      result = getMapQuestion(head.questions);
    }
    if (!result && tail.length) {
      const [h, ...t] = tail;
      result = getMapQuestionRecur(h, t);
    }
  }
  return result;
};
