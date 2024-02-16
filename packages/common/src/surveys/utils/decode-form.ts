import { getProp, setProp } from "../../objects";
import { cloneObject } from "../../util";
import { isPageQuestion } from "./is-page-question";

/**
 * Decodes certain properties of the Survey Form json into html
 * @param {any} form
 */
export const decodeForm = (form: any) => {
  const target = cloneObject(form);
  const props = [
    "header.content",
    "subHeader.content",
    "footer.content",
    "settings.thankYouScreenContent",
  ];
  props.forEach((prop) => {
    if (getProp(target, prop)) {
      setProp(prop, decodeURIComponent(getProp(target, prop)), target);
    }
  });
  const toDecoded = (question: any) => {
    const decode = (q: any) => {
      if (q.description) {
        q.description = decodeURIComponent(q.description);
      }
      return q;
    };
    return !isPageQuestion(question)
      ? decode(question)
      : { ...question, questions: question.questions.map(decode) };
  };
  return {
    ...target,
    questions: (target.questions || []).map(toDecoded),
  };
};
