import { getProp } from "../../objects/get-prop";
import { setProp } from "../../objects/set-prop";
import { cloneObject } from "../../util";
import { IS123FormJSON, IS123Question } from "../types";
import { isPageQuestion } from "./is-page-question";

/**
 * Decodes certain properties of the Survey Form json into html
 * @param {IS123FormJSON} form
 */
export const decodeForm = (form: IS123FormJSON) => {
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
  const toDecoded = (question: IS123Question) => {
    const decode = (q: IS123Question) => {
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
