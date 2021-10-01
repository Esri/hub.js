import { IHubRequestOptions } from "../../";
import { doesGroupExist } from "./does-group-exist";

/**
 * Given a title, construct a group title that is unique
 * in the user's org.
 * Given a title of "Medical Team", if a group with that title exists
 * this fn will add a number on the end, and increment until
 * an available group title is found - i.e. "Medical Team 3"
 * @param {String} title Group Title to ensure if unique
 * @param {IHubRequestOptions} hubRequestOptions
 * @param {Number} step Number to increment. Defaults to 0
 */
export function getUniqueGroupTitle(
  title: string,
  hubRequestOptions: IHubRequestOptions,
  step = 0
): Promise<string> {
  let combinedName = title;

  if (step) {
    combinedName = `${title} ${step}`;
  }

  return doesGroupExist(combinedName, hubRequestOptions)
    .then((result) => {
      if (result) {
        step++;
        return getUniqueGroupTitle(title, hubRequestOptions, step);
      } else {
        return combinedName;
      }
    })
    .catch((err) => {
      throw Error(`Error in team-utils::getUniqueGroupTitle ${err}`);
    });
}
