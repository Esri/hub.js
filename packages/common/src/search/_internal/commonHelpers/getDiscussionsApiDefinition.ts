import { IApiDefinition } from "../../types/types";

export function getDiscussionsApiDefinition(): IApiDefinition {
  // Currently, url is null because this is handled internally by the
  // discussions request method called by searchChannels, which relies on
  // the URL defined in the request options.hubApiUrl
  return {
    type: "arcgis-hub",
    url: null,
  };
}
