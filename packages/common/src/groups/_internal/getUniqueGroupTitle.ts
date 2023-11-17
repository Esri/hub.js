import { IQuery } from "../../search/types";
import { hubSearch } from "../../search/hubSearch";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Given a title, construct a group title that is unique
 * in the user's org.
 *
 * Ex: Given a title of "Medical Team", if a group with that
 * title exists this fn will add a number on the end, and
 * increment until an available group title is found - i.e.
 * "Medical Team 3"
 * @param {String} title Group Title to ensure if unique
 * @param {IUserRequestOptions} requestOptions
 * @param {Number} step Number to increment. Defaults to 0
 */
export function getUniqueGroupTitle(
  title: string,
  requestOptions: IUserRequestOptions,
  step = 0
): Promise<string> {
  let combinedName = title;

  if (step) {
    combinedName = `${title} ${step}`;
  }

  return doesGroupExist(combinedName, requestOptions)
    .then((result) => {
      if (result) {
        step++;
        return getUniqueGroupTitle(title, requestOptions, step);
      } else {
        return combinedName;
      }
    })
    .catch((err) => {
      throw Error(`Error in getUniqueGroupTitle: ${err}`);
    });
}

/**
 * checks whether the group with the specified title
 * exists in the user's org
 *
 * @param {String} title Group Title
 * @param {IUserRequestOptions} requestOptions
 */
async function doesGroupExist(
  title: string,
  requestOptions: IUserRequestOptions
) {
  const query: IQuery = {
    targetEntity: "group",
    filters: [{ predicates: [{ title }] }],
  };
  try {
    const { results } = await hubSearch(query, { requestOptions });
    return results.length > 0;
  } catch (error) {
    throw Error(`Error in getUniqueGroupTitle > doesGroupExist: ${error}`);
  }
}
