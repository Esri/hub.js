import { getUser } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";
import {
  IHubRequestOptions,
  getPortalUrl,
  Logger,
  batch
} from "@esri/hub-common";

// TODO: once the Hub API User Search is complete, integrate
// it in this function for AGO users, and fallback to the
// current implementation for enterprise users

/**
 * Fetches and returns members given a list of usernames
 *
 * NOTE: AGO's user search endpoint is only available to
 * authenticated users; however, since unauthenticated users
 * should still be able to access public profiles, we support
 * fetching members for both unauthenticated/authenticated
 * users in this function
 *
 * @param {string[]} usernames List of usernames to search for
 * @param {object} requestOptions IHubRequestOptions
 */
export function getMembers(
  usernames: string[],
  requestOptions: IHubRequestOptions
): Promise<IUser[]> {
  return requestOptions.authentication
    ? authenticatedGetMembers(usernames, requestOptions)
    : unauthenticatedGetMembers(usernames, requestOptions);
}

/**
 * groups the provided usernames in chunks of 100 and creates query
 * strings to batch fetch those members from AGO's user search
 * (/community/users) endpoint. AGO will only return the subset of
 * members which the current user has access to.
 *
 * @param {Array} usernames List of usernames to search for
 * @param {object} requestOptions IHubRequestOptions
 */
function authenticatedGetMembers(
  usernames: string[],
  requestOptions: IHubRequestOptions
): Promise<IUser[]> {
  const urlPath = `${getPortalUrl(
    requestOptions
  )}/sharing/rest/community/users`;
  const chunkSize = 100;
  const chunkedUsernames = [];

  for (let i = 0; i < usernames.length; i += chunkSize) {
    chunkedUsernames.push(usernames.slice(i, i + chunkSize));
  }

  const chunkedOptions = chunkedUsernames.map(chunk => {
    const q = chunk.map(username => `username:${username}`).join(" OR ");
    return {
      urlPath,
      requestOptions: { params: { q, num: chunk.length }, ...requestOptions }
    };
  });

  return batch(chunkedOptions, batchMemberRequest).then(batchedMembers => {
    return batchedMembers.reduce((flat: IUser[], toFlatten: IUser[]) => {
      return flat.concat(toFlatten);
    }, []);
  });
}

/**
 * fetch members individually from AGO's /community/users/{username}
 * endpoint. This endpoint, unlike the users search endpoint which
 * only returns the subset of members that the current user has acces
 * to, will only limit the information returned for each member
 * (i.e. firstname, lastname and fullname will be empty strings if
 * an unauthenticated user tries to access a non-public profile).
 *
 * @param {Array} usernames List of usernames to search for
 * @param {object} requestOptions IHubRequestOptions
 */
function unauthenticatedGetMembers(
  usernames: string[],
  requestOptions: IHubRequestOptions
): Promise<IUser[]> {
  return Promise.all(
    usernames.map(username => {
      return getUser({ username, ...requestOptions })
        .then(response => {
          // if the firstname, lastname, and fullname are empty strings, assume that the
          // user is not accessible (i.e. not a public profile) and should not be returned
          // to the unauthenticated user
          if (response.firstName || response.lastName || response.fullName) {
            return response;
          }
        })
        .catch(e => {
          Logger.error(
            `Error fetching user, ${username}, from AGO user endpoint, ${e}`
          );
          return null;
        });
    })
  ).then(members => members.filter(Boolean));
}

interface IBatchMemberRequestOptions {
  urlPath: "string";
  requestOptions: IHubRequestOptions;
}

/**
 * callback function to batch the requests to the user search endpoint
 * if >100 usernames are supplied. This is necessary because the
 * endpoint sets the maximum number of results to be included in the
 * result set response to 100
 *
 * @param options IBatchMemberRequestOptions
 */
function batchMemberRequest(
  options: IBatchMemberRequestOptions
): Promise<IUser[][]> {
  return request(options.urlPath, options.requestOptions)
    .then(response => response.results)
    .catch(e => {
      Logger.error(
        `Error fetching members from AGO user search endpoint: ${e}`
      );
      return [];
    });
}
