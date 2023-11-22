import { IArcGISContext } from "../ArcGISContext";

interface IGroupReharvestInfo {
  /**
   * Catalog group being harvested
   */
  groupId: string;
  /**
   * Internal job id
   */
  jobId: string;
  /**
   * HTTP status code of the job
   */
  status: number;
}

interface IReharvestError {
  message: string;
  cause: string;
}

interface IReharvestInfo {
  groups?: IGroupReharvestInfo[];
  error?: IReharvestError;
}

/**
 * Trigger a manual update to reharvest each public item within a site's catalog.
 * This should only be used when search metadata has gotten out of sync despite
 * the nightly reharvest.
 *
 * @param siteId site's catalog to reharvest
 * @param context
 * @returns Job info for each group whose content is being harvested
 */
export async function reharvestSiteCatalog(
  siteId: string,
  context: IArcGISContext
): Promise<IReharvestInfo> {
  const apiHost = context.hubUrl;
  const url = `${apiHost}/api/v3/jobs/site/${siteId}/harvest`;
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: context.hubRequestOptions.authentication.token,
    },
  };

  return fetch(url, options)
    .then((result) => result.json())
    .then((rawResult) => {
      const result: IReharvestInfo = {};
      if (rawResult.groups) {
        result.groups = rawResult.groups;
      }
      if (rawResult.message) {
        result.error = rawResult;
      }
      return result;
    });
}
